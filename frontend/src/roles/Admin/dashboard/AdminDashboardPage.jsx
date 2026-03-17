import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Users, Building2, CheckCircle, CalendarRange, Mail, ShieldCheck } from "lucide-react";
import axios from "axios";

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

        {/* Header - Button Removed */}
        <div className="mb-4">
          <h2 className="fw-bold">Admin Dashboard</h2>
          <p className="text-muted">Metric overview for Shnoor International</p>
        </div>

        {/* Stats Cards */}
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

        {/* Employee List Table - Status Column Removed */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Employee Directory</h5>
              <span className="badge bg-light text-dark border">Total: {employees.length}</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Employee Name</th>
                    <th>Email Address</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="3" className="text-center py-5">Loading employees...</td></tr>
                  ) : employees.length > 0 ? (
                    employees.map((emp, i) => (
                      <tr key={i}>
                        <td className="fw-semibold">{emp.name}</td>
                        <td className="text-muted">
                          <Mail size={14} className="me-2" />
                          {emp.email}
                        </td>
                        <td>
                          <span className="badge bg-info bg-opacity-10 text-info px-3">
                            <ShieldCheck size={12} className="me-1" />
                            {emp.role || 'Employee'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        No employees found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;