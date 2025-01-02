import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import Select from "react-select";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute'; // import the ProtectedRoute component
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
function Employee() {
    let navugate = useNavigate()
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState({});
    const [managerOptions, setManagerOptions] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    let [allEmployees, setAllEmployees] = useState([])
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
    const [errors, setErrors] = useState({ mobileNumber: '' });


    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8080/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUser(res.data.data);


                const managers = res.data.data
                    .filter(item => item.designation === "manager" || item.designation==="owner" ||item.designation==="admin")
                    .map(manager => ({
                        value: manager.employee_id,
                        label: `${manager.employee_id}${"->"}${manager.name}`
                    }));
                setManagerOptions(managers);

            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                let res = await axios.get("http://localhost:8080/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setAllEmployees(res.data.data);
                console.log(res.data.data)
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
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (formData.Designation.toLowerCase() !== 'employee') {
        //     toast.error("Designation must be 'employee'");
        //     return;
        // }
        if (validateForm()) {
            const token = localStorage.getItem("token");

            const payload = {
                name: formData.name,
                mobile_number: formData.mobile_number,
                email: formData.email,
                address: formData.address,
                department: formData.Department,
                designation: formData.Designation,
                doj: formData.dateofjoining,
                password: formData.password,
                manager_id: selectedManager?.value || null,
            };

            try {
                const response = await axios.post("http://localhost:8080/register", payload, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                location.reload()
                setShowModal(false); // Close modal on successful submission
            } catch (err) {
                console.error("Error registering employee:", err.message);
                toast.error("Email already exixts")
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
                    <div className="table-responsive">
                        <div
                            className="heading"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <h1 style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: "900" }}>
                                Employee Management
                            </h1>
                        </div>
                        <div className="position-relative">
                            <div className="position-absolute top-0 end-0">
                                <button type="button" className="btn btn-success" onClick={handleAddTaskClick}>
                                    + Onboarding Employee
                                </button>
                            </div>
                        </div>

                        <table className="table colored-header datatable project-list" style={{ marginTop: "80px" }}>
                            <thead>
                                <tr>
                                    <th>Employee ID </th>
                                    <th>Employee Name </th>
                                    <th>Mobile Number  </th>
                                    <th>Email</th>
                                    <th>Address </th>
                                    <th>Manager Name </th>
                                    <th>Department </th>
                                    <th>Designation</th>
                                    <th>Date of joining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* <td>
                                                {managerOptions.find(
                                                    (manager) => manager.value === employee.manager_id
                                                )?.label || "N/A"}
                                            </td> */}
                                {/* {allEmployees
                                    .filter((employee) => employee.designation.toLowerCase() === "employee")
                                    .map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.employee_id}</td>
                                            <td>{employee.name}</td>
                                            <td>{employee.mobile_number}</td>
                                            <td>{employee.email}</td>
                                            <td>{employee.address}</td>
                                          
                                            <td>{employee.department}</td>
                                            <td>{employee.designation}</td>
                                            <td>{employee.doj}</td>
                                        </tr>
                                    ))} */}
                                {
                                    allEmployees.map((item, index) => {
                                        return (
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
                                        )
                                    })
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Onboarding Employee</h5>
                                <button style={{ border: "none", marginLeft: "50px" }} type="button" className="close" onClick={handleCloseModal}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Employee Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            name="mobile_number"
                                            value={formData.mobile_number}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            maxLength="10"
                                            required
                                        />
                                        {errors.mobileNumber && (
                                            <small className="text-danger">{errors.mobileNumber}</small>
                                        )}
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Manager Name</label>
                                        <Select
                                            id="managerSelect"
                                            options={managerOptions}
                                            value={selectedManager}
                                            onChange={setSelectedManager}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Department</label>
                                        <input
                                            type="text"
                                            name="Department"
                                            value={formData.Department}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Designation</label>
                                        <input
                                            type="text"
                                            name="Designation"
                                            value={formData.Designation}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Date of joining</label>
                                        <input
                                            type="Date"
                                            name="dateofjoining"
                                            value={formData.dateofjoining}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{ marginTop: "20px" }}>Save Employee</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </ProtectedRoute>
    );
}

export default Employee;
