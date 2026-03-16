
import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { UserPlus, Mail, Phone, Calendar, Briefcase } from "lucide-react";

function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department_id: 1,
    designation_id: 1,
    joining_date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/employees/add",
        formData,
        {
          headers: { "x-auth-token": token },
        }
      );

      alert("Employee Added Successfully!");

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to add employee");
    }
  };

  return (
    <div className="d-flex">

      

      <div className="container-fluid" style={{ marginLeft: "250px" }}>
        <div className="container mt-4">

          
          <div className="mb-4">
            <h3 className="fw-bold d-flex align-items-center">
              <UserPlus className="me-2 text-primary" size={24} />
              Add New Employee
            </h3>
            <p className="text-muted">
              Enter the details to onboard a new team member.
            </p>
          </div>


          
          <div className="card shadow">
            <div className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="row">

                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <UserPlus size={16} />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>


                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <Mail size={16} />
                      </span>

                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@company.com"
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>


                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <Phone size={16} />
                      </span>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="+91 9876543210"
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>


                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Joining Date</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <Calendar size={16} />
                      </span>

                      <input
                        type="date"
                        className="form-control"
                        value={formData.joining_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joining_date: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>


                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department</label>

                    <div className="input-group">
                      <span className="input-group-text">
                        <Briefcase size={16} />
                      </span>

                      <select
                        className="form-select"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            department_id: e.target.value,
                          })
                        }
                      >
                        <option value="1">IT Department</option>
                        <option value="2">Human Resources</option>
                        <option value="3">Sales</option>
                      </select>
                    </div>
                  </div>


                  
                  <div className="col-12 mt-3">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                    >
                      Confirm Registration
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