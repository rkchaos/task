import React, { useEffect, useState } from "react";
import Dashboard from "../../components/dashboard/Dashboard";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from "axios";

function AllTask() {
  let navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
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

  const [formData, setFormData] = useState({
    projectName: "",
    projectId: "",
    taskName: "",
    priority: "",
    taskOwner: "",
    status: "",
    startDate: "",
    deadline: "",
    completionDate: "",
    deliverable: "",
    notes: "",
  });
  const [errors, setErrors] = useState({
    projectName: false,
    projectId: false,
    taskName: false,
    priority: false,
    taskOwner: false,
    status: false,
    startDate: false,
    deadline: false,
    completionDate: false,
    deliverable: false,
    employees: false,
  });

  const employeeOptions = [
    { value: "emp1", label: "Employee 1" },
    { value: "emp2", label: "Employee 2" },
    { value: "emp3", label: "Employee 3" },
    { value: "emp4", label: "Employee 4" },
  ];
  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
    marginLeft: "250px"
  };


  const handleAddTaskClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleSubmit = () => {
    let formErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        formErrors[key] = true;
      }
    });
    if (new Date(formData.deadline) < new Date(formData.startDate)) {
      formErrors["deadline"] = "Deadline cannot be earlier than start date.";
    }
    if (!selectedEmployees.length) {
      formErrors["employees"] = true;
    }

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setShowModal(false);
      setShowConfirmModal(true);
    }
  };


  const handleConfirmYes = () => {
    setShowConfirmModal(false);
    alert("Task added successfully!");


    setFormData({
      projectName: "",
      projectId: "",
      taskName: "",
      priority: "",
      taskOwner: "",
      status: "",
      startDate: "",
      deadline: "",
      completionDate: "",
      deliverable: "",
      notes: "",
    });
    setSelectedEmployees([]);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  

  return (
    <ProtectedRoute>
      <div>
        <Dashboard />
      </div>

      <div
        className="heading"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontFamily: "sans-serif", fontSize: "60px", fontWeight: "900" }}>
          All Tasks
        </h1>
      </div>

      <div className="position-relative">
        <div className="position-absolute top-0 end-0 d-flex align-items-center">
          {
            userRole !== "employee" && (
              <button type="button" className="btn btn-success me-2" onClick={handleAddTaskClick}>
                +Add Task
              </button>
            )
          }

          
        </div>
      </div>


      <div className={`modal ${showModal ? "d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Task</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="projectName" className="form-label">
                      Project Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
                      id="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                    />
                    {errors.projectName && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="projectId" className="form-label">
                      Project ID
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.projectId ? "is-invalid" : ""}`}
                      id="projectId"
                      value={formData.projectId}
                      onChange={handleInputChange}
                    />
                    {errors.projectId && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="taskName" className="form-label">
                      Task Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.taskName ? "is-invalid" : ""}`}
                      id="taskName"
                      value={formData.taskName}
                      onChange={handleInputChange}
                    />
                    {errors.taskName && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      className={`form-select ${errors.priority ? "is-invalid" : ""}`}
                      id="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    {errors.priority && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="taskOwner" className="form-label">
                      Task Owner
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.taskOwner ? "is-invalid" : ""}`}
                      id="taskOwner"
                      value={formData.taskOwner}
                      onChange={handleInputChange}
                    />
                    {errors.taskOwner && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className={`form-select ${errors.status ? "is-invalid" : ""}`}
                      id="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    {errors.status && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="startDate" className="form-label">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                      id="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                    />
                    {errors.startDate && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="deadline" className="form-label">
                      Deadline
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.deadline ? "is-invalid" : ""}`}
                      id="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                    />
                    {errors.deadline && <div className="invalid-feedback">Deadline cannot be earlier than start date.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="completionDate" className="form-label">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.completionDate ? "is-invalid" : ""}`}
                      id="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                    />
                    {errors.completionDate && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="deliverable" className="form-label">
                      Deliverable
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.deliverable ? "is-invalid" : ""}`}
                      id="deliverable"
                      value={formData.deliverable}
                      onChange={handleInputChange}
                    />
                    {errors.deliverable && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="employeeSelect" className="form-label">
                      Assign Employees
                    </label>
                    <Select
                      id="employeeSelect"
                      isMulti
                      options={employeeOptions}
                      value={selectedEmployees}
                      onChange={setSelectedEmployees}
                    />
                    {errors.employees && <div className="invalid-feedback">Please select at least one employee.</div>}
                  </div>
                  <div className="col-md-12">
                    <label htmlFor="notes" className="form-label">
                      Notes
                    </label>
                    <textarea
                      className={`form-control ${errors.notes ? "is-invalid" : ""}`}
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                    />
                    {errors.notes && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className={`modal ${showConfirmModal ? "d-block" : "d-none"}`} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmation</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowConfirmModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to add this task?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                No
              </button>
              <button type="button" className="btn btn-success" onClick={handleConfirmYes}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>


      <div class="album py-5 bg-body-tertiary">
        <div class="container">

          <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card shadow-sm">
                <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>
                <div class="card-body">
                  <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                      <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                      <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                    </div>
                    <small class="text-body-secondary">9 mins</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </ProtectedRoute>
  );
}

export default AllTask;
