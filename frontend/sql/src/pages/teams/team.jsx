import React, { useEffect, useState } from 'react';
import Dashboard from "../../components/dashboard/Dashboard";
import "./team.css";
import ProtectedRoute from '../../components/protectedRoute/protectedRoute';
import axios from 'axios';

function Team() {
    let [allEmployees, setAllEmployees] = useState([]);
    let [user, setUser] = useState({});

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
                setUser(res.data.current);
                // console.log(res.data.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);
    let [managerId, setManagerID] = useState([])
    useEffect(() => {
        async function fetchManager() {
            const token = localStorage.getItem("token");
            try {
                let res = await axios.get("http://localhost:8080/with", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setManagerID(res.data.team)

            }
            catch (err) {
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
                const res = await axios.get("http://localhost:8080/employee", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                setEmployeeprojects(res.data.team)
                // console.log(res.data.team)
            }
            catch (err) {
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

                        {/* Conditional Rendering */}
                        {user.designation === "admin" || user.designation === "owner" ? (
                            <table className="table colored-header datatable project-list" style={{ marginTop: "30px" }}>
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
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default Team;
