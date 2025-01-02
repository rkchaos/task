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
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, []);

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
                                        <th>Project Name</th>
                                        <th>Employee ID</th>
                                        <th>Name</th>
                                        <th>Mobile Number</th>
                                        <th>Email</th>
                                        <th>Manager Name</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allEmployees.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <a href="#">Spot Media</a>
                                            </td>
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
                        ) : (
                            <table className="table colored-header datatable project-list" style={{ marginTop: "30px" }}>
                                <thead>
                                    <tr>
                                        <th>Project Name</th>
                                        <th>Start Date</th>
                                        <th>Duration</th>
                                        <th>Progress</th>
                                        <th>Priority</th>
                                        <th>Manager</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <a href="#">Spot Media</a>
                                        </td>
                                        <td>18-05-2014</td>
                                        <td>12 days</td>
                                        <td>
                                            <div className="progress">
                                                <div
                                                    className="progress-bar"
                                                    data-transitiongoal={95}
                                                    aria-valuenow={95}
                                                    style={{ width: "95%" }}
                                                >
                                                    95%
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="label label-warning">MEDIUM</span>
                                        </td>
                                        <td>
                                            <img
                                                src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                                alt="Avatar"
                                                className="avatar img-circle"
                                            />{" "}
                                            <a href="#">Michael</a>
                                        </td>
                                        <td>
                                            <span className="label label-success">ACTIVE</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

export default Team;
