import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import Select from "react-select";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "./employee.css";
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from 'react-loading-skeleton';
// import { useNavigate } from 'react-router-dom';

function Employee() {
    // let navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState({});
    const [current ,setCurrent]=useState({})
    const [managerOptions, setManagerOptions] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    let [allEmployees, setAllEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        mobile_number: '',
        email: '',
        address: '',
        manager_id: '',
        Department: '',
        Designation: '',
        dateofjoining: '',
        password: ''
    });
    const [errors, setErrors] = useState({ mobile_number: '' });

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("https://task-mmnrpiyxn-rajs-projects-bbd5b6a9.vercel.app/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUser(res.data.data);


                const managers = res.data.data
                    .filter(item => item.designation === "manager" || item.designation === "owner" || item.designation === "admin")
                    .map(manager => ({
                        value: manager.employee_id,
                        label: `${manager.employee_id}${"->"}${manager.name}`
                    }));
                setManagerOptions(managers);

            } catch (err) {
                console.error(err);
            }
            finally {
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
        }
        fetchData();
    }, []);
console.log(user)
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                let res = await axios.get("https://task-mmnrpiyxn-rajs-projects-bbd5b6a9.vercel.app/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setAllEmployees(res.data.data);
                setCurrent(res.data.current)
                // console.log(res.data.data);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

    const handleAddTaskClick = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        if (formData.mobile_number && formData.mobile_number.length !== 10) {
            formErrors.mobile_number = 'Mobile number must be 10 digits long';
        }
        const validDesignations = ["employee", "admin", "owner", "manager"];
        if (!validDesignations.includes(formData.Designation)) {
            formErrors.Designation = 'Designation must be Employee, Admin, or Owner';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const token = localStorage.getItem("token");
            const formattedDate = new Date(formData.dateofjoining).toISOString().split('T')[0];

            const payload = {
                name: formData.name,
                mobile_number: formData.mobile_number,
                email: formData.email,
                address: formData.address,
                department: formData.Department,
                designation: formData.Designation,
                doj: formattedDate,
                password: formData.password,
                manager_id: selectedManager?.value || null,
            };

            try {
                const response = await axios.post("https://task-mmnrpiyxn-rajs-projects-bbd5b6a9.vercel.app/register", payload, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                location.reload();
                setShowModal(false); // Close modal on successful submission
            } catch (err) {
                console.error("Error registering employee:", err.message);
                toast.error("Email already exists");
            }
        }
    };

    return (
        <ProtectedRoute>
            <div>
                <Dashboard />
            </div>


            <div>
                <div className="container bootstrap snippets bootdey">
                    <div className="table-responsive" >
                        <div className="heading" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h1 style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: "900" }}>
                                Employee Management
                            </h1>
                        </div>


                        {
                            current.designation == "admin" || current.designation == 'owner' ? (
                                <>
                                    <div className="position-relative">
                                        <div className="position-absolute top-0 end-0">
                                            <button type="button" className="btn btn-success" onClick={handleAddTaskClick}>
                                                + Onboarding Employee
                                            </button>
                                        </div>
                                    </div>

                                    <table className="table colored-header datatable project-list table table-hover " style={{ marginTop: "80px" }}>
                                        <thead >
                                            <tr>
                                                <th>Employee ID</th>
                                                <th>Employee Name</th>
                                                <th>Mobile Number</th>
                                                <th>Email</th>
                                                <th>Address</th>
                                                <th>Manager Name</th>
                                                <th>Department</th>
                                                <th>Designation</th>
                                                <th>Date of joining</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading
                                                ? Array.from({ length: 5 }).map((_, index) => (
                                                    <tr key={index}>
                                                        <td><Skeleton width={100} height={100} /></td>
                                                        <td><Skeleton width={150} /></td>
                                                        <td><Skeleton width={120} /></td>
                                                        <td><Skeleton width={180} /></td>
                                                        <td><Skeleton width={200} /></td>
                                                        <td><Skeleton width={150} /></td>
                                                        <td><Skeleton width={100} /></td>
                                                        <td><Skeleton width={100} /></td>
                                                        <td><Skeleton width={120} /></td>
                                                    </tr>
                                                ))
                                                : allEmployees.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{item.employee_id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.mobile_number}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.address}</td>
                                                        <td>
                                                            {managerOptions.find(
                                                                (manager) => manager.value === item.manager_id
                                                            )?.label || "N/A"}
                                                        </td>
                                                        <td>{item.department}</td>
                                                        <td>{item.designation}</td>
                                                        <td>{item.doj}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <>
                                    <h1>Not having access</h1>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>


            {showModal && (
                <>
                    {/* Overlay for dim background */}
                    <div className="modal-overlay"></div>

                    {/* Modal */}
                    <div className="modal fade show modal-animated" style={{ display: 'block', zIndex: 1050 }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Onboarding Employee</h5>
                                    <button type="button" className="close" onClick={handleCloseModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="mobile_number">Mobile Number</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="mobile_number"
                                                name="mobile_number"
                                                value={formData.mobile_number}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.mobile_number && (
                                                <small className="text-danger">{errors.mobile_number}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <textarea
                                                className="form-control"
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                            ></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="manager">Manager</label>
                                            <Select
                                                id="manager"
                                                options={managerOptions}
                                                value={selectedManager}
                                                onChange={setSelectedManager}
                                                placeholder="Select a manager"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Department">Department</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Department"
                                                name="Department"
                                                value={formData.Department}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="Designation">Designation</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="Designation"
                                                name="Designation"
                                                value={formData.Designation}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.Designation && (
                                                <small className="text-danger">{errors.Designation}</small>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dateofjoining">Date of Joining</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dateofjoining"
                                                name="dateofjoining"
                                                value={formData.dateofjoining}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                                Close
                                            </button>
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} theme="dark" />
        </ProtectedRoute>
    );
}

export default Employee;
