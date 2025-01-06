import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import "./project.css";
import Select from "react-select";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import 'react-toastify/dist/ReactToastify.css';

const Project = () => {
    const [showModal, setShowModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [loading, setLoading] = useState(true);
    // const [selectedcurrent, setSelectedcurrent] = useState([]);
    const [user, setUser] = useState({});
    const [managerOptions, setManagerOptions] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    // const [useAllproject, setAllproject] = useState([])
    const [formData, setFormData] = useState({
        projectName: '',
        startDate: '',
        deadline: '',
        completionDate: '',
        projectManager: '',
        assignedBy: '',
        deliveryDate: ''
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (user && user.name) {
            setFormData((prev) => ({
                ...prev,
                assignedBy: user.name,
            }));
        }
    }, [user]);

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
        const validationErrors = {};
        if (!formData.projectName) validationErrors.projectName = 'Project name is required';
        if (!formData.startDate) validationErrors.startDate = 'Start date is required';
        if (!formData.deadline) validationErrors.deadline = 'Deadline is required';
        if (!formData.assignedBy) validationErrors.assignedBy = 'Assigned By is required';
        if (!formData.deliveryDate) validationErrors.deliveryDate = 'Delivery Date is required';
        if (!selectedManager) validationErrors.projectManager = 'At least one project manager must be selected';

        if (formData.startDate && formData.deadline && new Date(formData.startDate) > new Date(formData.deadline)) {
            validationErrors.dateOrder = 'Start Date cannot be later than Deadline';
        }

        if (formData.startDate && formData.completionDate && new Date(formData.startDate) > new Date(formData.completionDate)) {
            validationErrors.completionDateOrder = 'Completion Date cannot be earlier than Start Date';
        }

        return validationErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.assignedBy) {
            setErrors({ assignedBy: "Assigned By is required" });
            return;
        }

        // Proceed with form submission
        console.log("Form submitted:", formData);
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            setShowModal(false);
            setConfirmationModal(true);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleConfirmSubmit = async () => {
        let token = localStorage.getItem("token")
        const payload = {
            project_name: formData.projectName,
            owner_id: formData.assignedBy,
            manager_id: selectedManager?.value || null,
            start_date: formData.startDate,
            end_date: formData.deadline,
            comp_date: formData.completionDate,
            delivery_date: formData.deliveryDate,
            project_progress: formData.project_progress || 0,
            time_elapsed: calculateTimeElapsed(formData.startDate, formData.end_date),
        };


        function calculateTimeElapsed(startDate, endDate) {
            const start = new Date(endDate);
            // console.log(start)
            const end = new Date(endDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return null;
            }
            const diffInMs = Math.abs(end - start); // Difference in milliseconds
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Convert to days
            return diffInDays; // Return the number of days elapsed
        }
        try {
            await axios.post("http://localhost:8080/project", payload, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            setConfirmationModal(false);
            setErrors({});
            location.reload();
        } catch (error) {
            console.error("Error adding project:", error);
            toast.error("Failed to add project. Please try again.");
        }




    };

    const handleCloseConfirmation = () => setConfirmationModal(false);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        async function fetchUserData() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8080/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setUserRole(res.data.current.designation);

            } catch (err) {
                toast.error("some thing went wrong")
                console.error(err);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8080/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                setUser(res.data.current);

                const managers = res.data.data
                    .filter(item => item.designation === "manager" || item.designation === "owner" || item.designation === "admin")
                    .map(manager => ({
                        value: manager.employee_id,
                        label: `${manager.employee_id}${"-"}${manager.name}`
                    }));
                setManagerOptions(managers);

            } catch (err) {
                toast.error("some thing went wrong")
                console.error(err);
            }

        }
        fetchData();
    }, []);

    const [useProject, setUseProject] = useState([]);
    const [allProject, setAllProject] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                if (user.designation === "manager") {
                    const res = await axios.get("http://localhost:8080/projectManager", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setUseProject(res.data.data);
                } else if (user.designation === "admin" || user.designation === "owner") {
                    const res = await axios.get("http://localhost:8080/AllProject", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setAllProject(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 2000)
            }
        }
        fetchData();
    }, [user.designation]);

    let [employeeProjects, setEmployeeprojects] = useState([])
    useEffect(() => {
        async function fetchEmployeeproject() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("http://localhost:8080/employee", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setEmployeeprojects(res.data.team)
                // console.log(res.data)
            }
            catch (err) {
                console.error(err)
            }
        }
        fetchEmployeeproject()
    }, [])

    // skeleton 
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
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
                                Projects
                            </h1>
                        </div>
                        <div className="position-relative">
                            <div className="position-absolute top-0 end-0">
                                {loading ? (
                                    <Skeleton width={150} height={40} />
                                ) : (
                                    userRole !== "employee" && (
                                        <button type="button" className="btn btn-success" onClick={handleAddTaskClick}>
                                            + Add Projects
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                        <>
                            {loading ? (
                                <table className="table colored-header datatable project-list table table-hover" style={{ marginTop: "80px" }}>
                                    <thead>
                                        <tr>
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
                                    </thead>
                                    <tbody>
                                        {[...Array(5)].map((_, index) => ( // Create 5 skeleton rows as placeholders
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
                                        ))}
                                    </tbody>
                                </table>
                            ) : user.designation === "manager" && useProject.length > 0 ? (
                                <table className="table colored-header datatable project-list table table-hover" style={{ marginTop: "80px" }}>
                                    <thead>
                                        <tr>
                                            <th>Project ID</th>
                                            <th>Project Name</th>
                                            <th>Start Date</th>
                                            <th>Deadline</th>
                                            <th>Project progress</th>
                                            <th>Completion date</th>
                                            <th>Project Manager</th>
                                            <th>Assigned by</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {useProject.map((item) => (
                                            <tr key={item.project_id}>
                                                <td>{item.project_id}</td>
                                                <td>{item.project_name}</td>
                                                <td>{formatDate(item.start_date)}</td>
                                                <td>{formatDate(item.end_date)}</td>
                                                <td>{item.project_progress}</td>
                                                <td>{formatDate(item.comp_date)}</td>
                                                <td>{user.name}</td>
                                                <td>{item.owner_id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : user.designation === "admin" || user.designation === "owner" && allProject.length > 0 ? (
                                <table className="table colored-header datatable project-list table table-hover" style={{ marginTop: "80px" }}>
                                    <thead>
                                        <tr>
                                            <th>Project ID</th>
                                            <th>Project Name</th>
                                            <th>Start Date</th>
                                            <th>Deadline</th>
                                            <th>Project progress</th>
                                            <th>Completion date</th>
                                            <th>Project Manager</th>
                                            <th>Assigned by</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allProject.map((item) => (
                                            <tr key={item.project_id}>
                                                <td>{item.project_id}</td>
                                                <td>{item.project_name}</td>
                                                <td>{formatDate(item.start_date)}</td>
                                                <td>{formatDate(item.end_date)}</td>
                                                <td>{item.project_progress}</td>
                                                <td>{formatDate(item.comp_date)}</td>
                                                <td>{item.manager_id}</td>
                                                <td>{item.owner_id}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : user.designation === "employee" ? (
                                <>
                                    <table className="table colored-header datatable project-list table table-hover" style={{ marginTop: "80px" }}>
                                        <thead>
                                            <tr>
                                                <th>Project Name</th>
                                                <th>Start Date</th>
                                                <th>Deadline</th>
                                                <th>Project Progress</th>
                                                <th>Completion Date</th>
                                                <th>Project Manager</th>
                                                <th>Department</th> {/* New Department column */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employeeProjects.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.project_name}</td>
                                                    <td>{formatDate(item.start_date)}</td>
                                                    <td>{formatDate(item.deadline)}</td>
                                                    <td>{item.project_progress}</td>
                                                    <td>{item.comp_date}</td>
                                                    <td>{item.manager_id}</td>
                                                    <td>{item.department}</td> {/* Show department */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </>
                            ) : null}
                        </>

                    </div>
                </div>
            </div>

            {showModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    ></div>
                    <div
                        className="modal fade show"
                        style={{ display: 'block' }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div
                            className="modal-dialog modal-dialog-upward"
                            role="document"
                        >
                            <div
                                className="modal-content"
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Project</h5>
                                    <button style={{ border: "none" }} type="button" className="close" onClick={handleCloseModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <label>Project Name</label>
                                            <input
                                                type="text"
                                                name="projectName"
                                                value={formData.projectName}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                            {errors.projectName && <span className="text-danger">{errors.projectName}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                            {errors.startDate && <span className="text-danger">{errors.startDate}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Deadline</label>
                                            <input
                                                type="date"
                                                name="deadline"
                                                value={formData.deadline}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                            {errors.dateOrder && <span className="text-danger">{errors.dateOrder}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Project Manager</label>
                                            <Select
                                                id="managerSelect"
                                                options={managerOptions}
                                                value={selectedManager}
                                                onChange={setSelectedManager}
                                            />
                                            {errors.projectManager && <span className="text-danger">{errors.projectManager}</span>}
                                        </div>
                                        <div className="form-group">
                                            <label>Assigned By</label>
                                            <input
                                                type="text"
                                                name="assignedBy"
                                                value={formData.assignedBy || user.name}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                readOnly
                                            />
                                            {errors.assignedBy && <span className="text-danger">{errors.assignedBy}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Delivery Date</label>
                                            <input
                                                type="date"
                                                name="deliveryDate"
                                                value={formData.deliveryDate}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                            {errors.deliveryDate && <span className="text-danger">{errors.deliveryDate}</span>}
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: "20px" }}>Save Project</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {confirmationModal && (
                <>
                    <div
                        className="modal-backdrop fade show"
                        style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
                    ></div>
                    <div
                        className="modal fade show"
                        style={{ display: 'block' }}
                        tabIndex="-1"
                        role="dialog"
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                        >
                            <div
                                className="modal-content"
                            >
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Submission</h5>
                                    <button style={{ border: "none" }} type="button" className="close" onClick={handleCloseConfirmation}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to submit the project with the following details?</p>
                                    <ul>
                                        <li>Project Name: {formData.projectName}</li>
                                        <li>Start Date: {formData.startDate}</li>
                                        <li>Deadline: {formData.deadline}</li>
                                        <li>Project Manager: {selectedManager ? selectedManager.label : 'Not selected'}</li>
                                        <li>Assigned By: {formData.assignedBy}</li>
                                        <li>Delivery Date: {formData.deliveryDate}</li>
                                    </ul>
                                    <button className="btn btn-danger" onClick={handleCloseConfirmation}>Cancel</button>
                                    <button className="btn btn-success" onClick={handleConfirmSubmit} style={{ marginLeft: '10px' }}>Confirm</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
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
};

export default Project;

