import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Download, Search, Filter, CheckCircle2, Clock, DollarSign } from "lucide-react";

function Payroll() {

  const [payrollData] = useState([
    { id: "PAY-991", name: "Abhi", salary: "₹85,000", status: "Paid", date: "Mar 01, 2026" },
    { id: "PAY-992", name: "Sneha", salary: "₹72,000", status: "Paid", date: "Mar 01, 2026" },
    { id: "PAY-993", name: "Rahul", salary: "₹65,000", status: "Pending", date: "Pending" },
    { id: "PAY-994", name: "Priya", salary: "₹90,000", status: "Paid", date: "Mar 01, 2026" }
  ]);

  return (
    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Payroll Management</h2>
            <p className="text-muted">Review and process employee salaries</p>
          </div>

          <button className="btn btn-primary d-flex align-items-center">
            <DollarSign size={18} className="me-2" />
            Run Payroll
          </button>

        </div>

        {/* Metrics */}
        <div className="row mb-4">

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <p className="text-muted small mb-1">Total Payout</p>
              <h4 className="fw-bold">₹3,12,000</h4>
              <span className="text-success small">
                <CheckCircle2 size={14} className="me-1" />
                All clear for March
              </span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <p className="text-muted small mb-1">Pending Approvals</p>
              <h4 className="fw-bold">01</h4>
              <span className="text-warning small">
                <Clock size={14} className="me-1" />
                Action required
              </span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 shadow-sm">
              <p className="text-muted small mb-1">Next Pay Date</p>
              <h4 className="fw-bold">April 01</h4>
              <span className="text-muted small">Monthly Cycle</span>
            </div>
          </div>

        </div>

        {/* Search */}
        <div className="card p-3 mb-3">

          <div className="row align-items-center">

            <div className="col-md-6">

              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search employee..."
                />
              </div>

            </div>

            <div className="col-md-6 text-end">

              <button className="btn btn-outline-secondary">
                <Filter size={16} className="me-2" />
                Filter
              </button>

            </div>

          </div>

        </div>

        {/* Payroll Table */}

        <div className="card shadow-sm">

          <table className="table table-hover mb-0">

            <thead className="table-light">
              <tr>
                <th>Ref ID</th>
                <th>Employee</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Pay Date</th>
                <th className="text-end">Payslip</th>
              </tr>
            </thead>

            <tbody>

              {payrollData.map((pay) => (

                <tr key={pay.id}>

                  <td className="fw-bold text-primary">{pay.id}</td>

                  <td>{pay.name}</td>

                  <td className="fw-bold">{pay.salary}</td>

                  <td>

                    <span className={`badge ${
                      pay.status === "Paid"
                      ? "bg-success"
                      : "bg-warning text-dark"
                    }`}>

                      {pay.status}

                    </span>

                  </td>

                  <td>{pay.date}</td>

                  <td className="text-end">

                    <button
                      className={`btn btn-sm ${
                        pay.status === "Paid"
                        ? "btn-outline-primary"
                        : "btn-outline-secondary disabled"
                      }`}
                    >

                      <Download size={16} />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Payroll;