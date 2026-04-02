import React, { useState } from "react";
import axios from "axios";
import { UserPlus, Mail, Phone, Calendar, Briefcase, Lock, ArrowRight } from "lucide-react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department_id: "",
    joining_date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:5001/api/employees/add", formData, {
        headers: { "x-auth-token": token },
      });
      alert("Employee added successfully!");
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        department_id: "",
        joining_date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to add employee.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px 11px 44px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    color: "#1e293b",
    backgroundColor: "#fff",
    transition: "border-color 0.2s ease",
  };

  const iconStyle = {
    position: "absolute",
    left: "14px",
    top: "12px",
    color: "#94a3b8",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          
          <div className="mb-4">
            <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              Add Employee
            </h2>
            <p className="text-muted small">Register new talent into the ecosystem.</p>
          </div>

          
          <div className="bg-white rounded-4 border shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-3 p-md-4">
                <div className="row g-4">
                  
                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Full Name <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <UserPlus size={17} style={iconStyle} />
                      <input
                        type="text"
                        style={inputStyle}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Work Email <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Mail size={17} style={iconStyle} />
                      <input
                        type="email"
                        style={inputStyle}
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Access Password <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Lock size={17} style={iconStyle} />
                      <input
                        type="password"
                        style={inputStyle}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength="6"
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                 
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Contact Number <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Phone size={17} style={iconStyle} />
                      <input
                        type="tel"
                        style={inputStyle}
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                  
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Joining Date <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Calendar size={17} style={iconStyle} />
                      <input
                        type="date"
                        style={inputStyle}
                        value={formData.joining_date}
                        onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      />
                    </div>
                  </div>

                 
                  <div className="col-12 col-md-6 col-lg-4">
                    <label style={labelStyle}>Department <span className="text-danger">*</span></label>
                    <div className="position-relative">
                      <Briefcase size={17} style={iconStyle} />
                      <select
                        style={{ ...inputStyle, appearance: "none" }}
                        value={formData.department_id}
                        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                        required
                        onFocus={(e) => (e.target.style.borderColor = "#4f46e5")}
                        onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                      >
                        <option value="" disabled>Select Department</option>
                        <option value="1">Engineering</option>
                        <option value="2">Human Resources</option>
                        <option value="3">Sales & Marketing</option>
                        <option value="4">Operations</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>

              
              <div className="p-3 p-md-4 bg-light border-top d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn d-flex align-items-center gap-2 px-4 py-2"
                  style={{
                    background: "#4f46e5",
                    color: "#fff",
                    borderRadius: "12px",
                    fontWeight: "700",
                    boxShadow: "0 4px 12px rgba(79,70,229,0.25)",
                    border: "none"
                  }}
                >
                  {loading ? "Onboarding..." : "Complete Onboarding"} <ArrowRight size={17} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </PageContent>
    </div>
  );
}

export default AddEmployee;