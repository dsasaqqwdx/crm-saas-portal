import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (err) {

      alert(err.response?.data?.message || "Invalid Credentials");

    }
  };

  return (

    <div className="container-fluid vh-100">

      <div className="row h-100">

        {/* Left Login Form */}

        <div className="col-lg-4 d-flex align-items-center justify-content-center bg-white shadow">

          <div style={{ width: "100%", maxWidth: "350px" }}>

            <div className="text-center mb-4">

              <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "60px", height: "60px" }}>

                <span className="fw-bold fs-4">S</span>

              </div>

              <h4 className="fw-bold">
                Shnoor International LLC
              </h4>

            </div>


            <form onSubmit={loginUser}>

              <div className="mb-3">

                <label className="form-label">
                  Email or Phone
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="lakshman.b@shnoor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>


              <div className="mb-3 position-relative">

                <label className="form-label">
                  Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn position-absolute"
                  style={{ right: "10px", top: "38px" }}
                >

                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}

                </button>

              </div>


              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

            </form>


            <p className="text-center mt-3 text-muted">

              Don't have an account?{" "}

              <Link to="/register">
                Register here
              </Link>

            </p>

          </div>

        </div>


        {/* Right Banner */}

        <div className="col-lg-8 d-none d-lg-flex align-items-center justify-content-center bg-dark text-white">

          <div className="text-center p-5">

            <h1 className="fw-bold mb-3">
              Software As A Service
            </h1>

            <h3 className="text-info mb-4">
              in Cloud Computing
            </h3>

            <p className="text-light">
              The Revolution of Technology
            </p>

            <p className="text-muted">
              Stay ahead of the curve with our innovative SaaS solutions.
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Login;