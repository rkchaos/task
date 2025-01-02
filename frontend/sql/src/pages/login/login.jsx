import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
export default function login() {
  let naigate = useNavigate()
  let [formdata, setFormdata] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState({})
  function validform() {
    let formIsValid = true;
    let error = {};


    if (!formdata.password) {
      formIsValid = false;
      error["password"] = "password is required";
    }

    setError(error);
    return formIsValid;
  }
  async function handleClick(e){
    e.preventDefault()
    if (validform()) {
      try {
        let res = await axios.post("http://localhost:8080/login", formdata)
        let token=localStorage.setItem("token",res.data.token)
        
        naigate("/tasks")
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
            <div className="text-center mt-4">
              <h1 className="h2">Welcome back, Dey</h1>
              <p className="lead">Login in to your account to continue</p>
            </div>
            <div className="card">
              <div className="card-body">
                <div className="m-sm-4">
                  <div className="text-center">
                    <img
                      src="https://bootdey.com/img/Content/avatar/avatar6.png"
                      alt="Andrew Jones"
                      className="img-fluid rounded-circle"
                      width={132}
                      height={132}
                    />
                  </div>
                  <form>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="form-control form-control-lg"
                        type="email"
                        name="email"
                        value={formdata.email}
                        onChange={(e) => setFormdata({ ...formdata, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label>Password</label>
                      <input
                        className="form-control form-control-lg"
                        type="password"
                        name="password"
                        value={formdata.password}
                        onChange={(e) => setFormdata({ ...formdata, password: e.target.value })}
                        placeholder="Enter your password"
                      />
                    </div>
                    <div>
                    </div>
                    <div className="text-center mt-3">
                      <button onClick={handleClick} className="btn btn-lg btn-primary">
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
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
