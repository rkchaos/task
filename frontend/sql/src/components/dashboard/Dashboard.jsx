import React, { useEffect, useState } from "react";
import "./DashboardContent.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({})


  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
      setLoading(false);
    }, 2000);
  };
  useEffect(() => {
    async function data() {
      const token = localStorage.getItem("token")
      let res = await axios.get("https://task-orcin-nu.vercel.app/user", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      try {
        setUser(res.data.current)
      }
      catch (err) {
        console.log(err)
      }
    }
    data()
  }, [])
  const token = localStorage.getItem("token")
  function handleclick() {
    localStorage.removeItem("token")
    navigate("/login")
    window.location.reload()

  }
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Toggle button */}
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "❮" : "❯"}
      </button>

      {/* Sidebar content */}
      <div className="sidebar-content">
        <div className="sidebar-header">
          {isOpen && <h2>Dashboard</h2>}
        </div>
        <ul className="sidebar-menu">
          <li className="menu-item">
            <div
              className="sidebar-link"
              onClick={() => handleMenuClick("/tasks")}
            >
              <i className="icon fas fa-tasks"></i>
              {isOpen && <span className="pointer">Tasks</span>}
            </div>
          </li>
          <li className="menu-item">
            <div
              className="sidebar-link"
              onClick={() => handleMenuClick("/team")}
            >
              <i className="icon fas fa-users"></i>
              {isOpen && <span className="pointer">My Team</span>}
            </div>
          </li>
          <li className="menu-item">
            <div
              className="sidebar-link"
              onClick={() => handleMenuClick("/project")}
            >
              <i className="icon fas fa-project-diagram"></i>
              {isOpen && <span className="pointer">Project</span>}
            </div>
          </li>
          {(user.designation === 'admin' || user.designation === 'owner') && (
            <li className="menu-item">
              <div
                className="sidebar-link"
                onClick={() => handleMenuClick("/employeeManagement")}
              >
                <i className="icon fas fa-user-cog"></i>
                {isOpen && <span className="pointer">Employment Management</span>}
              </div>
            </li>
          )}
          <li className="menu-item">
            <button
              type="button"
              style={{ border: "none", background: "none", color: "white" }}
              onClick={handleclick}
            >
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </li>


        </ul>
      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
