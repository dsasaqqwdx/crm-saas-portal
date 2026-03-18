import React, { useState } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Shield, Building, Users, Settings } from "lucide-react";
import axios from "axios";

const SuperadminDashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0,
    totalUsers: 0,
    activeLicenses: 0,
    systemAlerts: 0
  });
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };
        
        const [companiesRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5001/api/saas/companies", { headers }),
          axios.get("http://localhost:5001/api/saas/global-summary", { headers })
        ]);
        
        if (companiesRes.data.success) {
          setCompanies(companiesRes.data.data);
        }
        if (statsRes.data.success) {
          setGlobalStats(statsRes.data.data);
        }
      } catch (err) {
        console.error("Error fetching superadmin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Companies", val: globalStats.totalCompanies, icon: <Building size={20}/>, color: "primary" },
    { title: "Active Licenses", val: globalStats.activeLicenses, icon: <Shield size={20}/>, color: "success" },
    { title: "Total Users", val: globalStats.totalUsers, icon: <Users size={20}/>, color: "info" },
    { title: "System Alerts", val: globalStats.systemAlerts, icon: <Settings size={20}/>, color: "warning" }
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
        
        <div className="mb-4">
          <h2 className="fw-bold text-danger">Superadmin Control Panel</h2>
          <p className="text-muted">Global oversight of all companies and system-wide configurations.</p>
        </div>

        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex align-items-center">
                  <div className={`bg-${stat.color} text-white p-3 rounded me-3`}>
                  {stat.icon}
                  </div>
                  <div>
                    <p className="text-muted small mb-1">{stat.title}</p>
                <h5 className="fw-bold mb-0">{stat.val}</h5>
                </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card shadow-sm border-0">
          <div className="card-body">
          <h5 className="fw-bold mb-3">Company Management</h5>
            <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                  <tr>
                    <th>Company Name</th>
                    <th>Subscribed On</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5">Loading companies...</td></tr>
                  ) : companies.map((company) => (
                    <tr key={company.company_id}>
                      <td>{company.company_name}</td>
                      <td>{new Date(company.created_at).toLocaleDateString()}</td>
                      <td>{company.pricing_plan || 'Pro'}</td>
                      <td><span className="badge bg-success">Active</span></td>
                      <td><button className="btn btn-sm btn-outline-primary">Manage</button></td>
                    </tr>
                  ))}
            </tbody>
            </table>
            </div>
            </div>
          </div>

        </div>
    </div>
  );
};

export default SuperadminDashboardPage;
