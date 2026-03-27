
import React, { useState, useEffect } from "react";
import { Users, Building2, CheckCircle, CalendarRange, ArrowUpRight } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar"; 
import { PageContent } from "../../../layouts/usePageLayout";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, totalCompanies: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.name) setAdminName(payload.name.split(" ")[0]);
        } catch {}
        
        const [sumRes, empRes] = await Promise.all([
          axios.get(`${API}/api/dashboard/summary`, { headers }),
          axios.get(`${API}/api/employees`, { headers }),
        ]);
        setStatsData(sumRes.data.data || {});
        setEmployees(empRes.data.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getTimeGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { title: "Total Talent", value: statsData.totalEmployees, icon: Users, color: "#6366f1", bg: "#f5f3ff" },
    { title: "Active Today", value: statsData.presentToday, icon: CheckCircle, color: "#10b981", bg: "#f0fdf4" },
    { title: "Pending Requests", value: statsData.pendingLeaves, icon: CalendarRange, color: "#f59e0b", bg: "#fffbeb" },
    { title: "Partner Entities", value: statsData.totalCompanies, icon: Building2, color: "#3b82f6", bg: "#eff6ff" },
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header Section */}
          <div className="mb-4">
            <h1 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
              {getTimeGreeting()}, {adminName}
            </h1>
            <p className="text-muted small">Here's what's happening with your workspace today.</p>
          </div>

          {/* Stats Grid */}
          <div className="row g-3 mb-4">
            {stats.map((stat, i) => (
              <div key={i} className="col-12 col-sm-6 col-xl-3">
                <div className="p-4 h-100" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #f1f5f9" }}>
                  <div style={{ 
                    width: "44px", height: "44px", borderRadius: "12px", 
                    backgroundColor: stat.bg, color: stat.color, 
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" 
                  }}>
                    <stat.icon size={20} />
                  </div>
                  <span className="text-muted fw-semibold" style={{ fontSize: "14px" }}>{stat.title}</span>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <h3 className="fw-bold mb-0" style={{ fontSize: "28px", color: "#1e293b" }}>{stat.value || 0}</h3>
                    <div className="d-flex align-items-center px-2 py-1 rounded-2" style={{ fontSize: "12px", color: "#10b981", fontWeight: "700", background: "#f0fdf4" }}>
                      <ArrowUpRight size={14} /> 8%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table Section */}
          <div className="p-3 p-md-4" style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold mb-0" style={{ fontSize: "20px", color: "#1e293b" }}>Employee Directory</h3>
            </div>

            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    <th className="border-0 pb-3">Employee Identity</th>
                    <th className="border-0 pb-3">Digital Contact</th>
                    <th className="border-0 pb-3">Department</th>
                    <th className="border-0 pb-3">Availability</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-5 text-muted">Synchronizing database...</td></tr>
                  ) : employees.length > 0 ? (
                    employees.map((emp, i) => (
                      <tr key={i} style={{ cursor: "pointer" }}>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div style={{ 
                              width: "36px", height: "36px", borderRadius: "10px", 
                              background: "#6366f1", color: "#fff", 
                              display: "inline-flex", alignItems: "center", justifyContent: "center", 
                              marginRight: "12px", fontWeight: "700" 
                            }}>
                              {emp.name.charAt(0)}
                            </div>
                            <span className="fw-bold" style={{ color: "#1e293b" }}>{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-3" style={{ fontSize: "14px" }}>{emp.email}</td>
                        <td className="py-3">
                          <span className="fw-medium" style={{ color: "#64748b", fontSize: "14px" }}>Operations</span>
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2" style={{ color: "#10b981", fontWeight: "700", fontSize: "12px" }}>
                            <div style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }}></div>
                            On Duty
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center py-5 text-muted">No records found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default Dashboard;
