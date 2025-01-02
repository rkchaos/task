import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import "./project.css";
import Select from "react-select";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const Project = () => {
    const [showModal, setShowModal] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [user, setUser] = useState({});
    const [managerOptions, setManagerOptions] = useState([]);
    const [selectedManager, setSelectedManager] = useState(null);
    const [useAllproject, setAllproject] = useState([])
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
        if (!selectedEmployees.length) validationErrors.projectManager = 'At least one project manager must be selected';


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
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length === 0) {
            setConfirmationModal(true);
        } else {
            setErrors(validationErrors);
        }
    };

    const handleConfirmSubmit = () => {

        console.log(formData);
        setShowModal(false); // Close the modal after submission
        setConfirmationModal(false); // Close the confirmation modal
        setErrors({}); // Clear errors on successful submission
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
                // console.log(res.data.current)


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
        }
        fetchData();
    }, []);
    const [useProject, setUseProject] = useState([]); // For manager-specific projects
    const [allProject, setAllProject] = useState([]); // For all projects

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
                    setUseProject(res.data.data); // Set manager-specific projects
                } else if (user.designation === "admin" || user.designation === "owner") {
                    const res = await axios.get("http://localhost:8080/AllProject", {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setAllProject(res.data.data); // Set all projects for admin/owner
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, [user.designation]);
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
                                {userRole !== "employee" && (
                                    <button type="button" className="btn btn-success" onClick={handleAddTaskClick}>
                                        + Add Projects
                                    </button>
                                )}
                            </div>
                        </div>

                        <table className="table colored-header datatable project-list" style={{ marginTop: "80px" }}>
                            <thead>
                                <tr>
                                    <th>Project ID </th>
                                    <th>Project Name </th>
                                    <th>Start Date </th>
                                    <th>Deadline</th>
                                    <th>Project progress</th>
                                    <th>Completion date</th>
                                    <th>Project Manager </th>
                                    <th>Assigned by(ID)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(user.designation === "manager" && useProject.length > 0) ? (
                                    useProject.map((item) => (
                                        <tr key={item.project_id}>
                                            <td>{item.project_id}</td>
                                            <td>{item.project_name}</td>
                                            <td>{item.start_date}</td>
                                            <td>{item.end_date}</td>
                                            <td>{item.project_pregress}</td>
                                            <td>{item.comp_date}</td>
                                            <td>{user.name}</td>
                                            <td>{item.owner_id}</td>
                                        </tr>
                                    ))
                                ) : (user.designation === "admin" || user.designation === "owner") && allProject.length > 0 ? (
                                    allProject.map((item) => (
                                        <tr key={item.project_id}>
                                            <td>{item.project_id}</td>
                                            <td>{item.project_name}</td>
                                            <td>{item.start_date}</td>
                                            <td>{item.end_date}</td>
                                            <td>{item.project_pregress}</td>
                                            <td>{item.comp_date}</td>
                                            <td>{user.name}</td>
                                            <td>{item.owner_id}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center">No projects available for your role.</td>
                                    </tr>
                                )}
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
                                <h5 className="modal-title">Add New Project</h5>
                                <button style={{ border: "none", marginLeft: "50px" }} type="button" className="close" onClick={handleCloseModal}>
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
                                            value={formData.dateOrder}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
                                        />
                                        {errors.dateOrder && <span className="text-danger">{errors.dateOrder}</span>}
                                    </div>
                                    {/* <div className="form-group">
                                        <label>Completion Date</label>
                                        <input
                                            type="date"
                                            name="completionDate"
                                            value={formData.completionDate}
                                            onChange={handleInputChange}
                                            className="form-control"
                                        />
                                        {errors.completionDateOrder && <span className="text-danger">{errors.completionDateOrder}</span>}
                                    </div> */}
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
                                            value={formData.assignedBy}
                                            onChange={handleInputChange}
                                            className="form-control"
                                            required
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
            )}

            {confirmationModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Submission</h5>
                                <button style={{ border: "none", marginLeft: "50px" }} type="button" className="close" onClick={handleCloseConfirmation}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to submit the project with the following details?</p>
                                <ul>
                                    <li>Project Name: {formData.projectName}</li>
                                    <li>Start Date: {formData.startDate}</li>
                                    <li>Deadline: {formData.deadline}</li>
                                    <li>Completion Date: {formData.completionDate}</li>
                                    <li>Project Manager: {formData.projectManager}</li>
                                    <li>Assigned By: {formData.assignedBy}</li>
                                    <li>Delivery Date: {formData.deliveryDate}</li>
                                </ul>
                                <button className="btn btn-danger" onClick={handleCloseConfirmation}>Cancel</button>
                                <button className="btn btn-success" onClick={handleConfirmSubmit} style={{ marginLeft: '10px' }}>Confirm</button>
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
};

export default Project;
