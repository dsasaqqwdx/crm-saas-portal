import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Clock, Calendar, FileText, Star } from "lucide-react";
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
    { title: "Attendance Today", val: statsData.attendanceToday, icon: <Clock size={20} />, color: "success" },
    { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={20} />, color: "primary" },
    { title: "Upcoming Holidays", val: statsData.upcomingHolidays, icon: <Star size={20} />, color: "warning" },
    {
      title: "Payslips available",
      val: statsData.payslipsCount,
      icon: <FileText size={20} />,
      color: "info",
      isClickable: true
    }
  ];

  if (loading) {
    return (
      <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2"></div>
          <p className="text-muted fw-bold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>
        
        <div className="mb-4">
          <h2 className="fw-bold">
            Welcome back, {localStorage.getItem("name") || "Employee"}!
          </h2>
          <p className="text-muted">
            Here's what's happening with your profile today.
          </p>
        </div>
        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div
                className={`card shadow-sm border-0 h-100 ${stat.isClickable ? 'cursor-pointer' : ''}`}
                onClick={() => stat.isClickable && navigate("/employee/payroll")}
                style={{ cursor: stat.isClickable ? 'pointer' : 'default' }}
              >
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

      </div>
      <ChatbotWidget />
    </div>
  );
};

export default EmployeeDashboard;