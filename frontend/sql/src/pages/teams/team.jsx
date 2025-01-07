import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import "./team.css";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Team() {
    let [allEmployees, setAllEmployees] = useState([]);
    let [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [userLength, setUserLength] = useState(0)
    useEffect(() => {
        async function fetchData() {
            const token = localStorage.getItem("token");
            try {
                let res = await axios.get("https://task-orcin-nu.vercel.app/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setAllEmployees(res.data.data);
                setUser(res.data.current);
                setUserLength(res.data.data.length)
              
            } catch (err) {
                console.log(err);
            }
        }
        const loadData = async () => {
            await fetchData();
            setTimeout(() => {
                setLoading(false); 
            }, 2000); 
        };

        loadData();
    }, []);
    
    let [managerId, setManagerID] = useState([])
    useEffect(() => {
        async function fetchManager() {
            const token = localStorage.getItem("token");
            try {
                let res = await axios.get("https://task-orcin-nu.vercel.app/with", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setManagerID(res.data.team)

            }
            catch (err) {
                toast.error("Token expire please login again")
                console.log(err)
                
            }
        }
        fetchManager()
    }, [])
    let [employeeProjects, setEmployeeprojects] = useState([])
    useEffect(() => {
        async function fetchEmployeeproject() {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("https://task-orcin-nu.vercel.app/employee", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setEmployeeprojects(res.data.team)
                // console.log(res.data.team)
            }
            catch (err) {
                toast.error("Token expire please login again")
                console.error(err)
            }
        }
        fetchEmployeeproject()
    }, [])


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
                                MY Team
                            </h1>
                        </div>
                        {loading ? (
                            <Skeleton count={userLength} height={30} /> 
                        ) : (
                            <>
                             {user.designation === "admin" || user.designation === "owner" ? (
                            <table className="table colored-header datatable project-list table table-hover" style={{ marginTop: "30px" ,position:"sticky"}}>
                                <thead>
                                    <tr>
                                        {/* <th>Project Name</th> */}
                                        {/* <th>Project</th> */}
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Mobile Number</th>
                                        <th>Email</th>
                                        <th>Manager ID</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allEmployees.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.employee_id}</td>
                                            <td>{item.name}</td>
                                            <td>{item.mobile_number}</td>
                                            <td>
                                                <span className="label label-warning">{item.email}</span>
                                            </td>
                                            <td>
                                                <img
                                                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                    alt="Avatar"
                                                    className="avatar img-circle"
                                                />{" "}
                                                <a href="#">{item.manager_id}</a>
                                            </td>
                                            <td>
                                                <span className="label label-success">{item.department}</span>
                                            </td>
                                            <td>
                                                <span className="label label-success">{item.designation}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) :
                            user.designation === "manager" ? (
                                <table className="table colored-header datatable project-list" style={{ marginTop: "30px" }}>
                                    <thead>
                                        <tr>
                                            <th>Project Name</th>
                                            <th>Employee ID</th>
                                            <th>Employee Name</th>
                                            <th>Mobile Number</th>
                                            <th>Email</th>
                                            <th>Manager ID</th>
                                            <th>Department</th>
                                            <th>Designation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {managerId.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.project}</td>
                                                <td>{item.employee_id}</td>

                                                <td>{item.name}</td>
                                                <td>{item.mobile_number}</td>
                                                <td>
                                                    <span className="label label-warning">{item.email}</span>
                                                </td>
                                                <td>
                                                    <img
                                                        src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                        alt="Avatar"
                                                        className="avatar img-circle"
                                                    />{" "}
                                                    <a href="#">{item.manager_id}</a>
                                                </td>
                                                <td>
                                                    <span className="label label-success">{item.department}</span>
                                                </td>
                                                <td>
                                                    <span className="label label-success">{item.designation}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) :
                                user.designation === "employee" ? (
                                    <table className="table colored-header datatable project-list" style={{ marginTop: "30px" }}>
                                        <thead>
                                            <tr>
                                                <th>Project Name</th>
                                                <th>Employee ID</th>
                                                <th>Employee Name</th>
                                                <th>Mobile Number</th>
                                                <th>Email</th>
                                                <th>Manager ID</th>
                                                <th>Department</th>
                                                <th>Designation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                employeeProjects.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{item.project_name}</td>
                                                            <td>{item.employee_id}</td>

                                                            <td>{item.name}</td>
                                                            <td>{item.mobile_number}</td>
                                                            <td>
                                                                <span className="label label-warning">{item.email}</span>
                                                            </td>
                                                            <td>
                                                                <img
                                                                    src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                                    alt="Avatar"
                                                                    className="avatar img-circle"
                                                                />{" "}
                                                                <a href="#">{item.manager_id}</a>
                                                            </td>
                                                            <td>
                                                                <span className="label label-success">{item.department}</span>
                                                            </td>
                                                            <td>
                                                                <span className="label label-success">{item.designation}</span>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                ) : (
                                    <>
                                    </>
                                )
                        }
                            </>
                        )
                    }
                       
                       
                    </div>
                </div>
            </div>
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

export default Team;
