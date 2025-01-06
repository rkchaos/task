import React, { useEffect, useState } from "react";
import Dashboard from "../../components/dashboard/Dashboard";
// import Select from "react-select";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
// import SkeletonLoader from "../Skeleton/skeleton";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import {
  MDBAccordion, MDBAccordionItem, MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardSubTitle,
  MDBCardText,
  MDBCardLink,
  MDBCol
} from 'mdb-react-ui-kit';
import "./allTasks.css"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

function AllTask() {
  let navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [projectOptions, setProjectOptions] = useState([]);
  const [user, setUser] = useState({})

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8080/projectManager", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.data) {
          const projectOptions = res.data.data.map((project) => ({
            value: project.project_id, // Use project_id
            label: project.project_name, // Use project_name
          }));
          setProjectOptions(projectOptions);
        }
      } catch (err) {
        toast.error("Token expire please login again")
        console.error("Error fetching projects:", err);
      }
    };

    if (userRole === "manager") {
      fetchProjects();
    }

  }, [userRole]);
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8080/AllProject", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.data) {
          const projectOptions = res.data.data.map((project) => ({
            value: project.project_id, // Use project_id
            label: project.project_name, // Use project_name
          }));
          setProjectOptions(projectOptions);
        }
      } catch (err) {
        toast.error("Something went wrong login again")
        console.error("Error fetching projects:", err);
      }
    };

    if (userRole === "owner" || userRole === "admin") {
      fetchProjects();
    }

  }, [userRole]);
  const [users, setUsers] = useState([]);

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
        setUser(res.data.current)
      } catch (err) {
        toast.error("Token expire please login again")
        console.error(err);
      }
    }
    fetchUserData();
  }, []);



  useEffect(() => {
    async function fetchUserData() {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8080/user", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        // setUserRole(res.data.current.designation);
        if (res.data.current.designation === "admin" || res.data.current.designation === "owner") {
          const userRes = await axios.get("http://localhost:8080/user", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          setUsers(userRes.data.data);
        } else if (res.data.current.designation === "manager") {
          const userRes = await axios.get("http://localhost:8080/particular_manager_employee", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          setUsers(userRes.data.data);
        }
      } catch (err) {
        toast.error("Token expire please login again")
        console.error(err);
      }
    }
    fetchUserData();
  }, []);

  // console.log(users)
  const [formData, setFormData] = useState({
    projectName: "",
    projectId: "",
    taskName: "",
    priority: "",
    taskOwner: "",
    status: "",
    startDate: "",
    deadline: "",
    Assign: "",
    // AssignId :"",
    // deliverable: "",
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
    Assign: false,
    // AssignId:false,
    // deliverable: false,
    employees: false,
  });


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


    setErrors(formErrors);

    console.log(formErrors)
    if (Object.keys(formErrors).length === 0) {
      setShowModal(false);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmYes = async () => {
    const token = localStorage.getItem("token");

    const dataToSend = {
      projectId: formData.projectId,         // project_id in SQL
      taskName: formData.taskName,           // task_name in SQL
      priority: formData.priority,           // priority in SQL
      status: formData.status,               // status in SQL
      startDate: formData.startDate,         // start_date in SQL
      deadline: formData.deadline,           // deadline in SQL
      taskOwner: formData.Assign,         // task_manager_id in SQL
      assignedEmployeeId: formData.taskOwner,   // assigned_employee_id in SQL (assuming it's a user ID)
      createdBy: formData.taskOwner,         // created_by in SQL
      progressPercentage: 0,                 // progress_percentage in SQL (assuming default 0)
      updatedAt: new Date().toISOString(),   // updated_at in SQL
      notes: formData.notes                  // notes in SQL
    };
    console.log(dataToSend)
    try {
      const res = await axios.post("http://localhost:8080/api/tasks", dataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          // "Content-Type": "application/json"
        }
      });
      setShowConfirmModal(false);
      setErrors({});
      location.reload()
      console.log("Task created successfully:");
    } catch (error) {
      console.error("Error creating task:", error);
    }


  };


  const handleInputChange = (e) => {
    const { id, value } = e.target;


    setFormData((prev) => {
      if (id === "projectName") {

        const selectedProject = projectOptions.find(

          (project) => project.value == value
        );

        return {
          ...prev,
          projectName: value,
          projectId: selectedProject ? selectedProject.value : "",
        };
      }

      return {
        ...prev,
        [id]: value,
      };
    });
  };

  useEffect(() => {
    if (user && user.name) {
      setFormData((prev) => ({
        ...prev,
        Assign: user.employee_id,
      }));
    }
  }, [user]);

  let [useTasks, setTasks] = useState([])
  useEffect(() => {
    async function alltask() {
      let token = localStorage.getItem("token")
      try {
        let res = await axios.get("http://localhost:8080/tasks", {
          headers: {
            "Authorization": `Bearer ${token}`,
          }
        })
        const formattedTasks = res.data.tasks.map((item) => ({
          ...item,
          start_date: moment(item.start_date).format('MM/DD/YYYY hh:mm A'),
          deadline: moment(item.start_date).format('MM/DD/YYYY hh:mm A'),

        }));

        setTasks(formattedTasks);
        setTimeout(() => {
          setLoading(false);
        }, 2000)
      }

      catch (err) {
        console.log(err)
        setTimeout(() => {
          setLoading(false);
        }, 2000)
      }

    }
    if (userRole == "owner" || userRole == "admin" || userRole == "employee" || userRole == "manager") {
      alltask()
    }

  }, [userRole])
  // console.log(user.designation)
  const [active, setActive] = useState(0);
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
            loading ? (
              <Skeleton  height={50} />
            ) : (
              userRole !== "employee" && (
                <button type="button" className="btn btn-success me-2" onClick={handleAddTaskClick}>
                  +Add Task
                </button>
              )
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
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="projectName" className="form-label">
                      Project Name
                    </label>
                    <select
                      className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
                      id="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a project</option>
                      {projectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.projectName && (
                      <div className="invalid-feedback">This field is required.</div>
                    )}
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
                      readOnly
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
                  {/* <div className="col-md-6">
                    <label htmlFor="taskOwner" className="form-label">
                      Task Owner
                    </label>
                    <select
                      className={`form-control ${errors.taskOwner ? "is-invalid" : ""}`}
                      id="taskOwner"
                      value={formData.taskOwner}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Task Owner</option>
                      {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.name}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users available</option>
                      )}
                    </select>

                    {errors.taskOwner && <div className="invalid-feedback">This field is required.</div>}
                  </div> */}

                  <div className="col-md-6">
                    <label htmlFor="priority" className="form-label">
                      Priority
                    </label>
                    <select
                      className={`form-control ${errors.priority ? "is-invalid" : ""}`}
                      id="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Priority</option>
                      <option value="P3">Low</option>
                      <option value="P2">Medium</option>
                      <option value="P1">High</option>
                    </select>

                    {errors.priority && <div className="invalid-feedback">This field is required.</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="taskOwner" className="form-label">
                      Task Owner
                    </label>
                    <select
                      className={`form-control ${errors.taskOwner ? "is-invalid" : ""}`}
                      id="taskOwner"
                      value={formData.taskOwner}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Task Owner</option>
                      {Array.isArray(users) && users.length > 0 ? (
                        users.map((user) => (
                          <option key={user.employee_id} value={user.employee_id}>  {/* Only employee_id is used as the value */}
                            {user.employee_id} - {user.name}  {/* Display employee_id and name */}
                          </option>
                        ))
                      ) : (
                        <option disabled>No users available</option>
                      )}
                    </select>

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
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
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

                  {/* <div className="col-md-6">
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
                  </div> */}
                  <div className="col-md-12">
                    <label htmlFor="employeeSelect" className="form-label">
                      Assign By({user.name})
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.Assign ? "is-invalid" : ""}`}
                      id="Assign"
                      value={formData.Assign}  // Display user.name here
                      onChange={handleInputChange}
                      readOnly
                    />
                    {errors.Assign && <div className="invalid-feedback">Please select at least one employee.</div>}
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


      <>
        <>
          <div style={{ marginTop: "70px", width: "100rem", marginLeft: "300px" }}>
            {loading ? (

              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} style={{ marginBottom: "20px" }}>
                  <Skeleton height={30} width={"80%"} style={{ marginBottom: "10px" }} />
                  <Skeleton count={4} height={20} width={"90%"} style={{ marginBottom: "10px" }} />
                </div>
              ))
            ) : (

              useTasks.map((item, index) => (
                <MDBAccordion active={active} onChange={(itemId) => setActive(itemId)} key={index}>
                  <MDBAccordionItem collapseId={index} headerTitle={`Task name ->  ${item.task_name}`}>
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle>{`Task name : ${item.task_name}`}</MDBCardTitle>
                        <MDBCardSubTitle>{`Task ID : ${item.task_id}`}</MDBCardSubTitle>
                        <MDBCardText>{`Start Date : ${item.start_date}`}</MDBCardText>
                        <MDBCardText>{`Deadline : ${item.deadline}`}</MDBCardText>
                        {item.priority === "P1" ? (
                          <MDBCardText className="text">{`Priority : ${item.priority}`}</MDBCardText>
                        ) : item.priority === "P3" ? (
                          <MDBCardText className="text2">{`Priority : ${item.priority}`}</MDBCardText>
                        ) : item.priority === "P2" ? (
                          <MDBCardText className="text3">{`Priority : ${item.priority}`}</MDBCardText>
                        ) : (
                          <h1>"Not Specified"</h1>
                        )}
                        <MDBCardText>{`Notes : ${item.notes}`}</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBAccordionItem>
                </MDBAccordion>
              ))
            )}
          </div>
        </>

      </>
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

export default AllTask;