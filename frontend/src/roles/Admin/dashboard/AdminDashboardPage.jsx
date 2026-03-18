import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Users, Building2, CheckCircle, CalendarRange, Mail, ShieldCheck } from "lucide-react";
import axios from "axios";
import ChatbotWidget from "../../../components/ChatbotWidget";

import AdminAttendancePage from "../attendance/AdminAttendancePage";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    pendingLeaves: 0,
    totalCompanies: 0
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "x-auth-token": token };

        const [sumRes, empRes] = await Promise.all([
          axios.get("http://localhost:5001/api/dashboard/summary", { headers }),
          axios.get("http://localhost:5001/api/employees", { headers })
        ]);

        setStatsData(sumRes.data.data);
        setEmployees(empRes.data.data || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Total Employees", count: statsData.totalEmployees, icon: <Users />, color: "primary" },
    { title: "Present Today", count: statsData.presentToday, icon: <CheckCircle />, color: "success" },
    { title: "Pending Leaves", count: statsData.pendingLeaves, icon: <CalendarRange />, color: "warning" },
    { title: "Companies", count: statsData.totalCompanies, icon: <Building2 />, color: "info" },
  ];

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />

      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        <div className="mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Metric overview for Shnoor International</p>
        </div>

        <div className="row g-3 mb-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex align-items-center">
                  <div className={`bg-${stat.color} text-white p-3 rounded-3 me-3`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-muted small mb-0">{stat.title}</p>
                    <h3 className="fw-bold mb-0">{stat.count || 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Employee Directory</h5>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {employees.map((emp, i) => (
                  <tr key={i}>
                    <td>{emp.name}</td>
                    <td>{emp.email}</td>
                    <td>{emp.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

    
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Employee Attendance</h5>
            <AdminAttendancePage />
          </div>
        </div>

      </div>
      <ChatbotWidget />
    </div>
    
  );
};

export default Dashboard;