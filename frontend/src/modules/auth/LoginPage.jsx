import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

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

      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email: normalizedEmail, password }
      );

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
            console.warn("Role not specifically mapped, falling back to default dashboard");
            navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login Error:", err);

      if (!err.response) {
        alert("Server is offline. Please check if your backend is running.");
      } else {
        const errorMsg = err.response?.data?.msg || err.response?.data?.message || "Invalid Credentials";
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100">
       
        <div className="col-lg-4 d-flex align-items-center justify-content-center bg-white shadow-sm">
          <div style={{ width: "100%", maxWidth: "380px" }} className="p-4">
            <div className="text-center mb-5">
              <div
                className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <span className="fw-bold fs-3">S</span>
              </div>
              <h3 className="fw-bold mb-1">Shnoor International</h3>
              <p className="text-muted small">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={loginUser}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-lg fs-6"
                  placeholder="name@shnoor.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-4 position-relative">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control form-control-lg fs-6"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn position-absolute border-0 text-muted"
                  style={{ right: "8px", top: "35px" }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 py-2 fs-6 fw-bold shadow-sm d-flex align-items-center justify-content-center"
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
              <p className="small text-muted mb-0">
                Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Create one</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-8 d-none d-lg-flex align-items-center justify-content-center bg-dark text-white position-relative overflow-hidden">
          <div
            className="position-absolute w-100 h-100"
            style={{ opacity: 0.1, background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
          ></div>
          <div className="text-center p-5 z-1">
            <h1 className="display-4 fw-bold mb-3">CRM SAAS</h1>
            <h3 className="text-info mb-4">Enterprise Cloud Computing</h3>
            <div className="bg-white/10 p-4 rounded-3 backdrop-blur-md">
              <p className="text-light mb-0 italic">"Stay ahead of the curve with our innovative trade management solutions."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;