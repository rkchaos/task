import React from 'react'
import{Routes,Route} from "react-router-dom"
import Login from "./pages/login/login"
// import Dashboard from "./components/dashboard/Dashboard"
import Team from "./pages/teams/team"
import Project from "./pages/project/project"
import Nopage from "./pages/nopage/Nopage"
import Task from "./pages/alltask/alltask"
import Employee from "./pages/employee_management/employee"
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
  <Routes>
<Route element={<Login/>} path='login'/>
{/* <Route element={<Dashboard/>} path='dashboard'/> */}
<Route element={<Team/>} path='team'/>
<Route element={<Project/>} path='project'/>
<Route path ="tasks" element={<Task/>}/>
<Route path ="employeeManagement" element={<Employee/>}/>
<Route path='*' element={<Nopage/>}/>
  </Routes>
  )
}

export default App