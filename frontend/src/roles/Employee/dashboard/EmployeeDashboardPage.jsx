import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Clock, Calendar, FileText, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    attendanceToday: "Loading...",
    leaveBalance: "12 Days",
    upcomingHolidays: "0",
    payslipsCount: "0"
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };

        const [summaryRes, activityRes] = await Promise.all([
          axios.get("http://localhost:5001/api/dashboard/summary", { headers }),
          axios.get("http://localhost:5001/api/dashboard/activities", { headers })
        ]);

        if (summaryRes.data.success) {
          const s = summaryRes.data.data;
          setStatsData({
            attendanceToday: s.attendanceToday || "Not Marked",
            leaveBalance: `${s.leaveBalance ?? 12} Days`,
            upcomingHolidays: String(s.upcomingHolidays || 0),
            payslipsCount: String(s.payslipsCount || 0)
          });
        }

        if (activityRes.data.success) {
          setActivities(activityRes.data.data);
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

  // 1. Resolve ESLint Error: Properly using the 'loading' state
  if (loading) {
    return (
      <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
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
          <h2 className="fw-bold">Welcome back, {localStorage.getItem("name") || "Employee"}!</h2>
          <p className="text-muted">Here's what's happening with your profile today.</p>
        </div>

        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div
                className={`card shadow-sm border-0 h-100 ${stat.isClickable ? 'cursor-pointer hover-shadow' : ''}`}
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

        <div className="row">
          {/* 2. Expanded Recent Activity (Removed empty announcement card) */}
          <div className="col-12">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Recent Activity</h5>
                <ul className="list-group list-group-flush">
                  {activities.length > 0 ? (
                    activities.map((act, i) => (
                      <li key={i} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <div className="bg-light p-2 rounded-circle me-3">
                            <Clock size={16} className="text-primary" />
                          </div>
                          <span><strong>{act.type}:</strong> {act.detail}</span>
                        </div>
                        <small className="text-muted bg-light px-2 py-1 rounded">
                          {new Date(act.date).toLocaleDateString()}
                        </small>
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item px-0 text-muted text-center py-4">
                      No recent activities found
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;