import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Calendar, Clock, CheckCircle, Send, Filter } from "lucide-react";

const Leaves = () => {

  const [leaveRequests] = useState([
    { id: 1, type: "Casual Leave", start: "Mar 15, 2026", end: "Mar 16, 2026", days: 2, status: "Pending" },
    { id: 2, type: "Sick Leave", start: "Feb 10, 2026", end: "Feb 11, 2026", days: 1, status: "Approved" },
    { id: 3, type: "Annual Leave", start: "Jan 05, 2026", end: "Jan 10, 2026", days: 5, status: "Approved" }
  ]);

  const balances = [
    { name: "Annual Leave", total: 20, used: 5, color: "primary" },
    { name: "Sick Leave", total: 12, used: 1, color: "danger" },
    { name: "Casual Leave", total: 10, used: 2, color: "success" }
  ];

  return (

    <div className="d-flex bg-light min-vh-100">

      <Sidebar />

      <div className="container-fluid p-4">

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h2 className="fw-bold">Leave Management</h2>
            <p className="text-muted">Request time off and track your balances</p>
          </div>

          <button className="btn btn-primary d-flex align-items-center">
            <Send size={18} className="me-2" />
            Apply for Leave
          </button>

        </div>


        {/* Leave Balance Cards */}

        <div className="row mb-4">

          {balances.map((leave, idx) => (

            <div key={idx} className="col-md-4">

              <div className="card shadow-sm p-3">

                <div className="d-flex justify-content-between mb-3">

                  <div className={`bg-${leave.color} bg-opacity-10 p-2 rounded`}>
                    <Calendar size={20} />
                  </div>

                  <span className="small text-muted">Balance</span>

                </div>

                <h6 className="text-muted">{leave.name}</h6>

                <h3 className="fw-bold">
                  {leave.total - leave.used}
                  <span className="text-muted fs-6"> / {leave.total} Days</span>
                </h3>

              </div>

            </div>

          ))}

        </div>


        {/* Leave History */}

        <div className="card shadow-sm">

          <div className="card-header d-flex justify-content-between align-items-center">

            <h6 className="fw-bold mb-0">My Leave History</h6>

            <button className="btn btn-sm btn-outline-secondary">
              <Filter size={16} className="me-1" />
              Filter
            </button>

          </div>


          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">

                <tr>
                  <th>Leave Type</th>
                  <th>Period</th>
                  <th>Days</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {leaveRequests.map((req) => (

                  <tr key={req.id}>

                    <td className="fw-semibold">{req.type}</td>

                    <td>
                      <Clock size={14} className="me-1 text-muted" />
                      {req.start} - {req.end}
                    </td>

                    <td>{req.days} Days</td>

                    <td>

                      <span
                        className={`badge ${
                          req.status === "Approved"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >

                        {req.status === "Approved" && (
                          <CheckCircle size={12} className="me-1" />
                        )}

                        {req.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Leaves;