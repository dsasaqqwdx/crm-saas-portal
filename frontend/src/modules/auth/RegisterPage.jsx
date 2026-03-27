
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import Logo from "../../assets/logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("company_admin");

  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5001/api/auth/register", {
        name,
        email,
        password,
        role,
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
    <div
      className="container-fluid vh-100"
      style={{ backgroundColor: "#6366F1", fontFamily: "'Ubuntu', sans-serif" }}
    >
      <div className="row h-100">
        <div
          className="col-lg-4 col-md-6 d-flex align-items-center justify-content-center shadow-sm"
          style={{ backgroundColor: "#0F172A" }}
        >
          <div
            className="p-4"
            style={{
              width: "100%",
              maxWidth: "420px",
              border: "2px solid #1E293B",
              borderRadius: "10px"
              
            }}
          >
            <div className="text-center mb-4">

                     <div
                     className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                     >
                     <img
                     src={Logo}
                     alt="Shnoor Logo"
                     style={{
                     width: "30%",
                     height: "30%",
                     objectFit: "contain"
                     }}
                     />
                     </div>

              <h3 className="fw-bold mb-2" style={{ color: "#E2E8F0" }}>
                Create Account
              </h3>

              <p className="small" style={{ color: "#94A3B8" }}>
                Join Shnoor CRM Platform
              </p>
            </div>

            <form onSubmit={registerUser}>
              <div className="mb-3 ">
                <label className="form-label" style={{ color: "#E2E8F0" }}>
                  Full Name
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1E293B",
                      color: "#E2E8F0",
                      borderColor: "#6366F1"
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "#E2E8F0" }}>
                  Email Address
                </label>
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1E293B",
                      color: "#E2E8F0",
                      borderColor: "#6366F1"
                    }}
                  />
                </div>
              </div>


              <div className="mb-3">
                <label className="form-label" style={{ color: "#E2E8F0" }}>
                  Password
                </label>
                <div className="input-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      backgroundColor: "#1E293B",
                      color: "#E2E8F0",
                      borderColor: "#6366F1"
                    }}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ color: "#E2E8F0" }}>
                  Role
                </label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    backgroundColor: "#1E293B",
                    color: "#E2E8F0",
                    borderColor: "#6366F1"
                  }}
                >
                  <option value="company_admin">Company Administrator</option>
                  <option value="employee">Employee</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <button
                className="btn btn-lg w-100 mt-3 fw-bold"
                style={{
                  backgroundColor: "#6366F1",
                  color: "#E2E8F0",
                  borderColor: "#6366F1"
                }}
              >
                Register
              </button>

            </form>

            <div className="text-center mt-4">
              <p style={{ color: "#E2E8F0" }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#22C55E", textDecoration: "none" }}>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div
          className="col-lg-8 d-none d-lg-flex  d-md-flex col-md-6  align-items-center justify-content-center position-relative overflow-hidden"
          style={{ backgroundColor: "#0F172A", color: "#E2E8F0" }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              opacity: 0.1,
              background: `radial-gradient(circle, #6366F1 0%, transparent 70%)`,
            }}
          ></div>

          <div className="text-center p-5 z-1">
            <img
              src={Logo}
              alt="CRM Logo"
              className="mb-4"
              style={{
                width: "300px",
                height: "300px",
                objectFit: "contain",
                filter: "drop-shadow(0px 6px 15px rgba(99,102,241,0.5))"
              }}
            />

            <h1 className="display-4 fw-bold mb-3">
               Shnoor SaaS HR System
            </h1>
            <div
              className="p-4 rounded-3"
              style={{ backgroundColor: "#0F172A" }}
            >
              <p className="mb-0">
                 Manage employees, attendance, payroll and leave
              with a modern HR platform.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;