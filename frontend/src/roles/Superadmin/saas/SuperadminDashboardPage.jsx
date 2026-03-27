import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Shield, Building, Users, Settings } from "lucide-react";
import axios from "axios";

const SuperadminDashboardPage = () => {
  const [companies, setCompanies] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    totalCompanies: 0, totalUsers: 0, activeLicenses: 0, systemAlerts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };
        const [companiesRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5001/api/saas/companies", { headers }),
          axios.get("http://localhost:5001/api/saas/global-summary", { headers }),
        ]);
        if (companiesRes.data.success) setCompanies(companiesRes.data.data);
        if (statsRes.data.success) setGlobalStats(statsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Total Companies",  val: globalStats.totalCompanies,  icon: <Building size={20} />, color: "primary" },
    { title: "Active Licenses",  val: globalStats.activeLicenses,  icon: <Shield size={20} />,   color: "success" },
    { title: "Total Users",      val: globalStats.totalUsers,      icon: <Users size={20} />,    color: "info" },
    { title: "System Alerts",    val: globalStats.systemAlerts,    icon: <Settings size={20} />, color: "warning" },
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid p-3 p-md-4">
          <div className="mb-4">
            <h2 className="fw-bold text-dark fs-4 fs-md-2">Superadmin Control Panel</h2>
            <p className="text-muted small">Global oversight of all companies and system-wide configurations.</p>
          </div>

          <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-6 col-lg-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body d-flex align-items-center p-3">
                    <div className={`bg-${stat.color} text-white p-2 p-md-3 rounded me-3 flex-shrink-0`}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>{stat.title}</p>
                      <h5 className="fw-bold mb-0">{stat.val}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-3 p-md-4">
              <h5 className="fw-bold mb-3 fs-6 fs-md-5">Company Management</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle" style={{ minWidth: "500px" }}>
                  <thead className="table-light">
                    <tr>
                      <th>Company Name</th>
                      <th className="d-none d-sm-table-cell">Subscribed On</th>
                      <th>Plan</th>
                      <th>Status</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4">Loading companies...</td></tr>
                    ) : companies.map((company) => (
                      <tr key={company.company_id}>
                        <td style={{ fontSize: "0.9rem" }}>{company.company_name}</td>
                        <td className="d-none d-sm-table-cell" style={{ fontSize: "0.85rem" }}>
                          {new Date(company.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ fontSize: "0.85rem" }}>{company.pricing_plan || "Pro"}</td>
                        <td><span className="badge bg-success">Active</span></td>
                        
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default SuperadminDashboardPage;