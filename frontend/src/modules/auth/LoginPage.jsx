
// // import React, { useState } from "react";
// // import axios from "axios";
// // import { useNavigate, Link } from "react-router-dom";
// // import { Eye, EyeOff, Loader2 } from "lucide-react";
// // import logo from "../../assets/logo.png";

// // function Login() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [loading, setLoading] = useState(false);

// //   const navigate = useNavigate();

// //   const loginUser = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       localStorage.clear();
// //       const normalizedEmail = email.toLowerCase().trim();

// //       const res = await axios.post(
// //         "http://localhost:5001/api/auth/login",
// //         { email: normalizedEmail, password }
// //       );

// //       if (res.data.success && res.data.user) {
// //         const { token } = res.data;
// //         const { role, name } = res.data.user;

// //         localStorage.setItem("token", token);
// //         localStorage.setItem("role", role);
// //         localStorage.setItem("name", name);

// //         switch (role) {
// //           case "employee":
// //             navigate("/employee-dashboard");
// //             break;
// //           case "company_admin":
// //             navigate("/dashboard");
// //             break;
// //           case "super_admin":
// //           case "software_owner":
// //             navigate("/superadmin-dashboard");
// //             break;
// //           default:
// //             navigate("/dashboard");
// //         }
// //       }
// //     } catch (err) {
// //       if (!err.response) {
// //         alert("Server is offline.");
// //       } else {
// //         alert(err.response?.data?.message || "Invalid Credentials");
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-vh-100 d-flex">
      
      
// //       <div className="col-lg-5 d-flex align-items-center justify-content-center bg-white">
// //         <div
// //           className="p-4 shadow rounded-4"
// //           style={{ width: "100%", maxWidth: "400px" }}
// //         >
          
// //           <div className="text-center mb-4">
// //             <img src={logo} alt="logo" style={{ width: "70px" }} />
// //             <h4 className="fw-bold mt-3">Shnoor International</h4>
// //             <p className="text-muted small">Welcome back 👋</p>
// //           </div>

// //           <form onSubmit={loginUser}>
            
// //             <div className="mb-3">
// //               <label className="form-label small fw-semibold">Email</label>
// //               <input
// //                 type="email"
// //                 className="form-control form-control-lg rounded-3"
// //                 placeholder="Enter your email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 disabled={loading}
// //                 required
// //               />
// //             </div>

// //             <div className="mb-4 position-relative">
// //               <label className="form-label small fw-semibold">Password</label>
// //               <input
// //                 type={showPassword ? "text" : "password"}
// //                 className="form-control form-control-lg rounded-3 pe-5"
// //                 placeholder="Enter password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 disabled={loading}
// //                 required
// //               />
// //               <button
// //                 type="button"
// //                 onClick={() => setShowPassword(!showPassword)}
// //                 className="btn position-absolute border-0"
// //                 style={{ right: "10px", top: "38px" }}
// //               >
// //                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
// //               </button>
// //             </div>

            
// //             <button
// //               type="submit"
// //               className="btn w-100 py-2 fw-bold text-white"
// //               style={{
// //                 background: "linear-gradient(135deg, #3b82f6, #6366f1)",
// //                 borderRadius: "10px",
// //               }}
// //               disabled={loading}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 className="me-2 animate-spin" size={18} />
// //                   Signing in...
// //                 </>
// //               ) : (
// //                 "Sign In"
// //               )}
// //             </button>
// //           </form>

// //           <p className="text-center mt-4 small">
// //             Don’t have an account?{" "}
// //             <Link to="/register" className="fw-bold text-decoration-none">
// //               Register
// //             </Link>
// //           </p>
// //         </div>
// //       </div>

      
// //       <div
// //         className="col-lg-7 d-none d-lg-flex align-items-center justify-content-center text-white position-relative overflow-hidden"
// //         style={{
// //           background: "linear-gradient(135deg, #0f172a, #1e293b)",
// //         }}
// //       >
        
// //         <div
// //           className="position-absolute w-100 h-100"
// //           style={{
// //             background:
// //               "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.3), transparent 40%)",
// //             opacity: 0.6,
// //           }}
// //         ></div>

// //         <div className="text-center px-5 position-relative">
          
          
// //           <h1 className="fw-bold display-5 mb-3">
// //             Smart CRM for Modern Businesses 
// //           </h1>

// //           <p className="text-light mb-4 fs-6">
// //             Streamline operations, manage clients effortlessly, and unlock powerful insights —
// //             all in one intelligent platform.
// //           </p>

          
// //           <div className="row mt-4 g-3">
            
// //             <div className="col-4">
// //               <div className="p-3 rounded-3 bg-white bg-opacity-10 text-center">
// //                 <h5 className="fw-bold mb-1">📊</h5>
// //                 <small>Analytics</small>
// //               </div>
// //             </div>

// //             <div className="col-4">
// //               <div className="p-3 rounded-3 bg-white bg-opacity-10 text-center">
// //                 <h5 className="fw-bold mb-1">👥</h5>
// //                 <small>Client Management</small>
// //               </div>
// //             </div>

// //             <div className="col-4">
// //               <div className="p-3 rounded-3 bg-white bg-opacity-10 text-center">
// //                 <h5 className="fw-bold mb-1">⚡</h5>
// //                 <small>Automation</small>
// //               </div>
// //             </div>

// //           </div>

// //           <div className="mt-5 px-4 py-3 rounded-3 bg-white bg-opacity-10">
// //             <p className="mb-0 small">
// //               "Empowering businesses with intelligent CRM solutions."
// //             </p>
// //           </div>

// //         </div>
// //       </div>

// //     </div>
// //   );
// // }

// // export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import "../../index.css";
import Logo from "../../assets/logo.png";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      localStorage.clear();
      const normalizedEmail = email.toLowerCase().trim();

      const res = await axios.post("http://localhost:5001/api/auth/login", {
        email: normalizedEmail,
        password,
      });

      if (res.data.success && res.data.user) {
        const { token } = res.data;
        const { role, name } = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("name", name);

        switch (role) {
          case "employee":
            navigate("/employee-dashboard");
            break;
          case "company_admin":
            navigate("/dashboard");
            break;
          case "super_admin":
          case "software_owner":
            navigate("/superadmin-dashboard");
            break;
          default:
            navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);
      if (!err.response) {
        alert("Server is offline. Please check if your backend is running.");
      } else {
        const errorMsg =
          err.response?.data?.msg ||
          err.response?.data?.message ||
          "Invalid Credentials";
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid vh-100"
      style={{ backgroundColor: "#6366F1" ,fontFamily: "Ubuntu', sans-serif" }}
    >
      <div className="row h-100">
        <div
          className="col-lg-4 d-flex align-items-center justify-content-center shadow-sm"
          style={{ backgroundColor: "#0F172A" }}
        >
          <div style={{ width: "100%", maxWidth: "400px", border: "2px solid #1E293B",borderRadius:"10px" }} className="p-4">
          <div className="text-center mb-5">
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

          <h3
          className="fw-bold fs-1 mb-3"
          style={{ color: "#E2E8F0", fontFamily: "'Ubuntu', sans-serif" }}
          >
          Shnoor International
          </h3>

          <p
          className="small"
          style={{ color: "#94A3B8", fontFamily: "'Ubuntu', sans-serif" }}
          >
          Enter your credentials to access your account
          </p>
          </div>

            <form onSubmit={loginUser}>
              <div className="mb-4">
                
                <label className="form-label " style={{ color: "#E2E8F0" ,fontFamily: "'Ubuntu', sans-serif",}}>
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control form-control-lg fs-6"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  style={{ backgroundColor: "#1E293B", color: "#E2E8F0", borderColor: "#6366F1"}}/>
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label" style={{  color: "#E2E8F0" ,fontFamily: "'Ubuntu', sans-serif"}}>
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg fs-6"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ backgroundColor: "#1E293B", color: "#E2E8F0", borderColor: "#6366F1" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn position-absolute border-0"
                  style={{ right: "8px", top: "35px", color:"#E2E8F0" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-lg w-100 py-2 fs-6 fw-bold d-flex align-items-center justify-content-center"
                style={{
                  backgroundColor: "#6366F1",
                  color: "#E2E8F0",
                  borderColor:"#6366F1",
                  fontFamily: "'Ubuntu', sans-serif",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="me-2 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <p className="small mb-0" style={{ color: "#E2E8F0",fontFamily: "'Ubuntu', sans-serif" }}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: "#22C55E", margin:"1px", textDecoration: "none",fontFamily: "'Ubuntu', sans-serif", }}
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>


        <div
          className="col-lg-8 d-none d-lg-flex align-items-center justify-content-center position-relative overflow-hidden"
          style={{ backgroundColor:"#0F172A", color: "#E2E8F0" }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{
              opacity: 0.1,
              background: `radial-gradient(circle, ${"#6366F1"} 0%, transparent 70%)`,
            }}
          ></div>
          <div className="text-center p-5 z-1">
              <img
                src={Logo}   // put your logo path here
                alt="CRM Logo"
                className="mb-4"
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "contain",
                  filter: "drop-shadow(0px 6px 15px rgba(99,102,241,0.5))"
                }}
              />
            <h1 className="display-4 fw-bold mb-3" style={{ color: "#E2E8F0" ,fontFamily: "'Ubuntu', sans-serif"}}>
              CRM SAAS
            </h1>
            <h3 className="mb-4" style={{ color: "#E2E8F0",fontFamily: "'Ubuntu', sans-serif" }}>
              Enterprise Cloud Computing
            </h3>
            <div
              className="p-4 rounded-3"
              style={{ backgroundColor: "#0F172A" }}
            >
              <p className="mb-0" style={{fontFamily: "'Ubuntu', sans-serif", color: "#E2E8F0" }}>
                "Stay ahead of the curve with our innovative trade management solutions."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Login;