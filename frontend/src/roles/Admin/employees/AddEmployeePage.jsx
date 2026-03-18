import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { UserPlus, Mail, Phone, Calendar, Briefcase, Lock } from "lucide-react";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    department_id: "",
    joining_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5001/api/employees/add",
        formData,
        {
          headers: { "x-auth-token": token },
        }
      );
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
      alert(error.response?.data?.error || "Failed to add employee. Please check all fields.");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <div className="container-fluid p-4">
          <div className="mb-4">
            <h3 className="fw-bold d-flex align-items-center text-dark">
              <UserPlus className="me-2 text-primary" size={24} />
              Employee Onboarding
            </h3>
            <p className="text-muted small">
              Please fill out all fields. Fields marked with <span className="text-danger">*</span> are mandatory.
            </p>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row">

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small text-secondary">Full Name *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <UserPlus size={16} />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small text-secondary">Work Email *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        className="form-control border-start-0 ps-0"
                        placeholder="email@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small text-secondary">Initial Password *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Lock size={16} />
                      </span>
                      <input
                        type="password"
                        className="form-control border-start-0 ps-0"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small text-secondary">Phone Number *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Phone size={16} />
                      </span>
                      <input
                        type="tel"
                        className="form-control border-start-0 ps-0"
                        placeholder="Enter contact number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold small text-secondary">Official Joining Date *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Calendar size={16} />
                      </span>
                      <input
                        type="date"
                        className="form-control border-start-0 ps-0"
                        value={formData.joining_date}
                        onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                 
                  <div className="col-md-6 mb-4">
                    <label className="form-label fw-semibold small text-secondary">Assigned Department *</label>
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0 text-muted">
                        <Briefcase size={16} />
                      </span>
                      <select
                        className="form-select border-start-0 ps-0"
                        required
                        value={formData.department_id}
                        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                      >
                        <option value="" disabled>Select from list</option>
                        <option value="1">Engineering</option>
                        <option value="2">Human Resources</option>
                        <option value="3">Sales & Marketing</option>
                        <option value="4">Operations</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 pt-3 border-top">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm">
                      Add Employee
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;