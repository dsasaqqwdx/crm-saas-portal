import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatbotWidget from "../../../components/ChatbotWidget";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    attendanceToday: "Loading...",
    leaveBalance: "12 Days",
    upcomingHolidays: "0",
    payslipsCount: "0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };

        const summaryRes = await axios.get(
          "http://localhost:5001/api/dashboard/summary",
          { headers }
        );

        if (summaryRes.data.success) {
          const s = summaryRes.data.data;
          setStatsData({
            attendanceToday: s.attendanceToday || "Not Marked",
            leaveBalance: `${s.leaveBalance ?? 12} Days`,
            upcomingHolidays: String(s.upcomingHolidays || 0),
            payslipsCount: String(s.payslipsCount || 0)
          });
        }
      } catch (error) {
        console.error("Error fetching employee dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
    { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
    { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
    { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
  ];

  if (loading) {
    return (
      <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
          <p className="text-muted fw-bold">Syncing your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          <div className="mb-4 pt-2">
            <h2 className="fw-bold fs-2 mb-1" style={{ color: "#0f172a", letterSpacing: "-1px" }}>
              Welcome back, {localStorage.getItem("name") || "Employee"}! 👋
            </h2>
            <p className="text-muted">
              Here's a quick overview of your profile and performance for today.
            </p>
          </div>

          <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-xl-3">
                <div 
                  className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
                  onClick={() => navigate(stat.link)}
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                >
                  <div className="card-body d-flex align-items-center">
                    <div 
                      className="rounded-3 d-flex align-items-center justify-content-center me-3" 
                      style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
                      <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <UserCheck size={20} className="text-primary" /> Quick Actions
                </h5>
                <div className="row g-3">
                  <div className="col-6 col-md-4">
                    <button 
                      className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
                      onClick={() => navigate("/employee/attendance")}
                      style={{ background: "#f8fafc" }}
                    >
                      <Clock className="text-success" />
                      <span className="small fw-bold">Clock In/Out</span>
                    </button>
                  </div>
                  <div className="col-6 col-md-4">
                    <button 
                      className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
                      onClick={() => navigate("/employee/leaves")}
                      style={{ background: "#f8fafc" }}
                    >
                      <Calendar className="text-primary" />
                      <span className="small fw-bold">Request Leave</span>
                    </button>
                  </div>
                  <div className="col-12 col-md-4">
                    <button 
                      className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
                      onClick={() => navigate("/employee/payroll")}
                      style={{ background: "#f8fafc" }}
                    >
                      <FileText className="text-info" />
                      <span className="small fw-bold">View Payslips</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
                <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
                  <Coffee size={120} />
                </div>
                <h5 className="fw-bold mb-3">Holiday Spirit</h5>
                <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
                <button 
                  className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
                  onClick={() => navigate("/employee/holidays")}
                >
                  View Calendar <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </PageContent>
      <ChatbotWidget />

      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
        }
        .btn-white:hover {
          background: #fff !important;
          color: #4f46e5 !important;
        }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;