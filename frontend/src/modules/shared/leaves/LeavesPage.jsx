import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Send, Loader2, Check, XCircle, Calendar, AlertCircle } from "lucide-react";
import axios from "axios";

const Leaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = role === "company_admin" || role === "super_admin";

  const fetchLeaves = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/leaves", {
        headers: { "x-auth-token": token }
      });
      // The backend returns results in res.data.data
      setLeaveRequests(res.data.data || []);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5001/api/leaves/approve/${id}`,
        { status },
        { headers: { "x-auth-token": token } }
      );
      await fetchLeaves(true); // Refresh data in background
    } catch (err) {
      console.error("Error updating leave:", err);
      alert(err.response?.data?.error || "Failed to update leave");
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5001/api/leaves/apply", {
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      }, { headers: { "x-auth-token": token } });

      setShowModal(false);
      setReason("");
      setStartDate("");
      setEndDate("");
      await fetchLeaves(true);
      alert("Leave application submitted!");
    } catch (err) {
      alert(err.response?.data?.error || "Error applying for leave");
    }
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold d-flex align-items-center">
              Leave Management
              {isRefreshing && <Loader2 size={18} className="ms-3 animate-spin text-primary" />}
            </h2>
            <p className="text-muted small">{isAdmin ? "Review and manage team leave requests" : "Track your leave history"}</p>
          </div>
          {!isAdmin && (
            <button className="btn btn-primary d-flex align-items-center shadow-sm px-4" onClick={() => setShowModal(true)}>
              <Send size={18} className="me-2" />
              Apply for Leave
            </button>
          )}
        </div>

        <div className="card shadow-sm border-0 overflow-hidden">
          <div className="card-header bg-white border-0 py-3">
            <h6 className="fw-bold mb-0">{isAdmin ? "All Applications" : "My History"}</h6>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0 align-middle">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  {isAdmin && <th className="ps-4">Employee</th>}
                  <th>Type</th>
                  <th>Period</th>
                  <th>Status</th>
                  {isAdmin && <th className="text-end pe-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
                      <Loader2 className="animate-spin mx-auto text-primary" />
                    </td>
                  </tr>
                ) : leaveRequests.length > 0 ? (
                  leaveRequests.map((req) => (
                    <tr key={req.leave_id}>
                      {isAdmin && (
                        <td className="ps-4">
                          <div className="fw-bold">{req.employee_name || "Unknown"}</div>
                          <small className="text-muted">ID: #{req.leave_id}</small>
                        </td>
                      )}
                      <td className="fw-semibold">{req.leave_type}</td>
                      <td>
                        <div className="small fw-bold">
                          {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
                        </div>
                        <small className="text-muted">
                          {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                        </small>
                      </td>
                      <td>
                        <span className={`badge bg-${req.status === "Approved" ? "success" : req.status === "Rejected" ? "danger" : "warning"} bg-opacity-10 text-${req.status === "Approved" ? "success" : req.status === "Rejected" ? "danger" : "warning"} border px-3`}>
                          {req.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="text-end pe-4">
                          {req.status === "Pending" ? (
                            <div className="d-flex justify-content-end gap-2">
                              <button className="btn btn-sm btn-success px-3" onClick={() => handleStatusChange(req.leave_id, "Approved")}>
                                <Check size={14} className="me-1" /> Approve
                              </button>
                              <button className="btn btn-sm btn-outline-danger px-3" onClick={() => handleStatusChange(req.leave_id, "Rejected")}>
                                <XCircle size={14} className="me-1" /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-muted small fst-italic">Processed</span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5 text-muted">
                      <AlertCircle className="mx-auto mb-2 opacity-50" size={30} />
                      <p className="mb-0">No leave requests found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL IMPLEMENTATION */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Apply for Leave</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleApplyLeave}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Leave Type</label>
                    <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                      <option value="Annual">Annual Leave</option>
                      <option value="Sick">Sick Leave</option>
                      <option value="Casual">Casual Leave</option>
                      <option value="Maternity/Paternity">Maternity/Paternity</option>
                    </select>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">Start Date</label>
                      <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label small fw-bold">End Date</label>
                      <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Reason</label>
                    <textarea className="form-control" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly explain the reason for leave..." required></textarea>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary px-4 fw-bold">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaves;