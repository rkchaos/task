import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { motion } from 'framer-motion'
import "./login.css"
export default function Login() {
  let navigate = useNavigate()
  let [formdata, setFormdata] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState({})

  function validform() {
    let formIsValid = true;
    let error = {};
    if (!formdata.email) {
      formIsValid = false;
      error["email"] = "email is required";
    }
    if (!formdata.password) {
      formIsValid = false;
      error["password"] = "password is required";
    }

    setError(error);
    return formIsValid;
  }

  async function handleClick(e) {
    e.preventDefault()
    if (validform()) {
      try {
        let res = await axios.post("https://task-mmnrpiyxn-rajs-projects-bbd5b6a9.vercel.app/login", formdata)
        localStorage.setItem("token", res.data.token)

        navigate("/tasks")
        window.location.reload()
      }
      catch (err) {
        toast.error("Your credential is wrong")
      }
    }
  }

  return (
    <>
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
            <div className="d-table-cell align-middle">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mt-4"
              >
                <p className="lead">Login to your account to continue</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card"
              >
                <div className="card-body">
                  <div className="m-sm-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="text-center"
                    >
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar6.png"
                        alt="User Avatar"
                        className="img-fluid rounded-circle"
                        width={132}
                        height={132}
                      />
                    </motion.div>
                    <form>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="form-group"
                      >
                        <label>Email</label>
                        <input
                          className="form-control form-control-lg"
                          type="email"
                          name="email"
                          value={formdata.email}
                          onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                         {error.email && <div className="text-danger">{error.email}</div>}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="form-group"
                      >
                        <label>Password</label>
                        <input
                          className="form-control form-control-lg"
                          type="password"
                          name="password"
                          value={formdata.password}
                          onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                          placeholder="Enter your password"
                        />
                        {error.password && <div className="text-danger">{error.password}</div>}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 }}
                        className="text-center mt-3"
                      >
                        <button onClick={handleClick} className="btn btn-lg btn-primary">
                          Sign in
                        </button>
                      </motion.div>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
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
    </>
  )
}

