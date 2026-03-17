import React, { useState, useEffect } from "react";
import Sidebar from "../../layouts/Sidebar";
import { Building, Shield, Users, Settings } from "lucide-react";
import axios from "axios";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    activeLicenses: 0,
    systemAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  // NEW STATE (Form)
  const [formData, setFormData] = useState({
    company_name: "",
    pricing_plan: ""
  });

  const [showModal, setShowModal] = useState(false);

  // FETCH DATA
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "x-auth-token": token };

      const [companiesRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/saas/companies", { headers }),
        axios.get("http://localhost:5001/api/saas/global-summary", { headers })
      ]);

      if (companiesRes.data.success) setCompanies(companiesRes.data.data);
      if (statsRes.data.success) setGlobalStats(statsRes.data.data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // CREATE COMPANY
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5001/api/saas/create",
        formData,
        { headers: { "x-auth-token": token } }
      );

      alert("Company Added Successfully ✅");

      setShowModal(false);
      setFormData({ company_name: "", pricing_plan: "" });

      fetchDashboardData(); // refresh table

    } catch (err) {
      console.error(err);
      alert("Error adding company ❌");
    }
  };

return (
  <div className="d-flex bg-light min-vh-100">
    <Sidebar />

    <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
      
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-danger">Companies</h2>
          <p className="text-muted">Manage all companies</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add Company
        </button>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Companies List</h5>

          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Plan</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="3">Loading...</td></tr>
              ) : companies.map((c) => (
                <tr key={c.company_id}>
                  <td>{c.company_name}</td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td>{c.pricing_plan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Add Company</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">

                  <input
                    type="text"
                    name="company_name"
                    placeholder="Company Name"
                    className="form-control mb-3"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="text"
                    name="pricing_plan"
                    placeholder="Pricing Plan"
                    className="form-control"
                    value={formData.pricing_plan}
                    onChange={handleChange}
                  />

                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  </div>
);
};

export default CompaniesPage;