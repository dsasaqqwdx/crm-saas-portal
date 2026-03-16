 
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "company_admin",
        company_id: 1
      });

      alert("User Registered Successfully!");
      navigate("/login");

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(
        error.response?.data?.error ||
        error.response?.data?.msg ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center bg-light">

      <div className="row w-100">

        
        <div className="col-lg-4 col-md-6 mx-auto bg-white p-5 shadow rounded">

          <div className="text-center mb-4">
            <h3>Register</h3>
            <p className="text-muted">Create your admin account</p>
          </div>

          <form onSubmit={registerUser}>

            
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text">
                  <User size={16}/>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  onChange={(e)=>setName(e.target.value)}
                  required
                />
              </div>
            </div>

            
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Mail size={16}/>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text">
                  <Lock size={16}/>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  onChange={(e)=>setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button className="btn btn-success w-100 mt-3">
              Register
            </button>

          </form>

          <p className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>

        </div>


        
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">

          <div className="text-center">

            <h1 className="display-5 fw-bold text-primary">
              Shnoor SaaS HR System
            </h1>

            <p className="lead">
              Manage employees, attendance, payroll and leave
              with a modern HR platform.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;