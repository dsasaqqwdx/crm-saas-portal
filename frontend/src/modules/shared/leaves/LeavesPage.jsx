
// import React, { useState, useEffect, useCallback } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { PageContent } from "../../../layouts/usePageLayout";
// import { Send, Loader2, Calendar, AlertCircle, Check, XCircle, User } from "lucide-react";
// import axios from "axios";

// const Leaves = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [leaveType, setLeaveType] = useState("Annual");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");

//   const role = localStorage.getItem("role");
//   const isAdmin = role === "company_admin" || role === "super_admin";

//   const fetchLeaves = useCallback(async (isBackground = false) => {
//     if (!isBackground) setLoading(true);
//     else setIsRefreshing(true);

//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5001/api/leaves", {
//         headers: { "x-auth-token": token }
//       });
//       setLeaveRequests(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching leaves:", err);
//     } finally {
//       setLoading(false);
//       setIsRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchLeaves();
//   }, [fetchLeaves]);

//   const handleStatusChange = async (id, status) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(`http://localhost:5001/api/leaves/approve/${id}`,
//         { status },
//         { headers: { "x-auth-token": token } }
//       );
//       await fetchLeaves(true);
//     } catch (err) {
//       alert(err.response?.data?.error || "Failed to update leave");
//     }
//   };

//   const handleApplyLeave = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5001/api/leaves/apply", {
//         leave_type: leaveType,
//         start_date: startDate,
//         end_date: endDate,
//         reason: reason
//       }, { headers: { "x-auth-token": token } });

//       setShowModal(false);
//       setReason("");
//       setStartDate("");
//       setEndDate("");
//       await fetchLeaves(true);
//     } catch (err) {
//       alert(err.response?.data?.error || "Error applying for leave");
//     }
//   };

//   const getStatusBadge = (status) => {
//     const configs = {
//       Approved: { bg: "#dcfce7", color: "#16a34a", icon: <Check size={12} /> },
//       Rejected: { bg: "#fee2e2", color: "#ef4444", icon: <XCircle size={12} /> },
//       Pending: { bg: "#fef3c7", color: "#d97706", icon: <AlertCircle size={12} /> },
//     };
//     const style = configs[status] || configs.Pending;
//     return (
//       <span className="badge d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2" 
//             style={{ backgroundColor: style.bg, color: style.color, fontSize: "12px", fontWeight: "600" }}>
//         {style.icon} {status}
//       </span>
//     );
//   };

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <PageContent>
//         <div className="container-fluid px-3 px-md-4 py-4">
          
//           {/* Header */}
//           <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
//             <div>
//               <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
//                 Leave Requests
//                 {isRefreshing && <Loader2 size={20} className="ms-2 text-primary animate-spin" style={{ display: 'inline-block' }} />}
//               </h2>
//               <p className="text-muted small mb-0">
//                 {isAdmin ? "Manage and review team absence requests." : "Keep track of your time-off history."}
//               </p>
//             </div>
//             {!isAdmin && (
//               <button
//                 className="btn text-white px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0"
//                 style={{ background: "#4f46e5", borderRadius: "10px", fontWeight: "600" }}
//                 onClick={() => setShowModal(true)}
//               >
//                 <Send size={18} /> Apply for Leave
//               </button>
//             )}
//           </div>

//           {/* Table Card */}
//           <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
//             <div className="table-responsive">
//               <table className="table align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                     {isAdmin && <th className="px-4 py-3">Employee</th>}
//                     <th className="px-4 py-3">Leave Type</th>
//                     <th className="px-4 py-3">Date Range</th>
//                     <th className="px-4 py-3">Status</th>
//                     {isAdmin && <th className="px-4 py-3 text-end">Action</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
//                         <div className="spinner-border text-primary" role="status"></div>
//                         <p className="mt-2 text-muted small">Fetching data...</p>
//                       </td>
//                     </tr>
//                   ) : leaveRequests.length > 0 ? (
//                     leaveRequests.map((req) => (
//                       <tr key={req.leave_id} className="hover-bg">
//                         {isAdmin && (
//                           <td className="px-4 py-3">
//                             <div className="d-flex align-items-center gap-2">
//                               <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
//                                 <User size={16} />
//                               </div>
//                               <span className="fw-bold text-dark small">{req.employee_name || "Employee"}</span>
//                             </div>
//                           </td>
//                         )}
//                         <td className="px-4 py-3 fw-semibold text-secondary small">{req.leave_type}</td>
//                         <td className="px-4 py-3">
//                           <div className="d-flex flex-column">
//                             <span className="small fw-bold text-dark">
//                               {new Date(req.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(req.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
//                             </span>
//                             <span className="text-muted" style={{ fontSize: "11px" }}>
//                               {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
//                         {isAdmin && (
//                           <td className="px-4 py-3 text-end">
//                             {req.status === "Pending" ? (
//                               <div className="d-flex justify-content-end gap-2">
//                                 <button className="btn btn-sm btn-success rounded-3 px-3 fw-bold" onClick={() => handleStatusChange(req.leave_id, "Approved")}>Approve</button>
//                                 <button className="btn btn-sm btn-outline-danger rounded-3 px-3 fw-bold" onClick={() => handleStatusChange(req.leave_id, "Rejected")}>Reject</button>
//                               </div>
//                             ) : (
//                               <span className="text-muted small fst-italic">No actions</span>
//                             )}
//                           </td>
//                         )}
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
//                         <AlertCircle size={32} className="text-muted mb-2 opacity-50" />
//                         <p className="text-muted mb-0">No records found.</p>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* Apply Leave Modal */}
//         {showModal && (
//           <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
//             <div className="modal-dialog modal-dialog-centered">
//               <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
//                 <div className="modal-header border-0 p-4 pb-0">
//                   <h5 className="fw-bold fs-4 m-0">Apply for Absence</h5>
//                   <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
//                 </div>
//                 <form onSubmit={handleApplyLeave}>
//                   <div className="modal-body p-4">
//                     <div className="mb-3">
//                       <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Leave Category</label>
//                       <select className="form-select rounded-3 p-2 shadow-none border-2" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//                         <option value="Annual">Annual Leave</option>
//                         <option value="Sick">Sick / Medical Leave</option>
//                         <option value="Casual">Casual Leave</option>
//                         <option value="Maternity/Paternity">Maternity/Paternity</option>
//                       </select>
//                     </div>
//                     <div className="row g-3 mb-3">
//                       <div className="col-6">
//                         <label className="form-label small fw-bold text-uppercase text-muted">Start Date</label>
//                         <input type="date" className="form-control rounded-3 p-2 shadow-none border-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
//                       </div>
//                       <div className="col-6">
//                         <label className="form-label small fw-bold text-uppercase text-muted">End Date</label>
//                         <input type="date" className="form-control rounded-3 p-2 shadow-none border-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
//                       </div>
//                     </div>
//                     <div className="mb-0">
//                       <label className="form-label small fw-bold text-uppercase text-muted">Reason for Request</label>
//                       <textarea className="form-control rounded-3 p-2 shadow-none border-2" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide context for your absence..." required></textarea>
//                     </div>
//                   </div>
//                   <div className="modal-footer border-0 p-4 pt-0 gap-2">
//                     <button type="button" className="btn btn-light rounded-3 px-4 flex-grow-1 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
//                     <button type="submit" className="btn text-white rounded-3 px-4 flex-grow-1 fw-bold" style={{ background: "#4f46e5" }}>Submit Request</button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         )}

//         <style>{`
//           .animate-spin { animation: spin 1s linear infinite; }
//           @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
//           .hover-bg:hover { background-color: #f8fafc; }
//         `}</style>
//       </PageContent>
//     </div>
//   );
// };

// export default Leaves;
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Send, Loader2, Calendar, AlertCircle, Check, XCircle, User } from "lucide-react";
import axios from "axios";

const Leaves = ({ selfView }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const role = localStorage.getItem("role");
  const isAdmin = !selfView && (role === "company_admin" || role === "super_admin");

  const fetchLeaves = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    else setIsRefreshing(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/leaves", {
        headers: { "x-auth-token": token }
      });
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
      await fetchLeaves(true);
    } catch (err) {
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
    } catch (err) {
      alert(err.response?.data?.error || "Error applying for leave");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      Approved: { bg: "#dcfce7", color: "#16a34a", icon: <Check size={12} /> },
      Rejected: { bg: "#fee2e2", color: "#ef4444", icon: <XCircle size={12} /> },
      Pending: { bg: "#fef3c7", color: "#d97706", icon: <AlertCircle size={12} /> },
    };
    const style = configs[status] || configs.Pending;
    return (
      <span className="badge d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2" 
            style={{ backgroundColor: style.bg, color: style.color, fontSize: "12px", fontWeight: "600" }}>
        {style.icon} {status}
      </span>
    );
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
                Leave Requests
                {isRefreshing && <Loader2 size={20} className="ms-2 text-primary animate-spin" style={{ display: 'inline-block' }} />}
              </h2>
              <p className="text-muted small mb-0">
                {isAdmin ? "Manage and review team absence requests." : "Keep track of your time-off history."}
              </p>
            </div>
            {!isAdmin && (
              <button
                className="btn text-white px-4 py-2 d-flex align-items-center gap-2 shadow-sm border-0"
                style={{ background: "#4f46e5", borderRadius: "10px", fontWeight: "600" }}
                onClick={() => setShowModal(true)}
              >
                <Send size={18} /> Apply for Leave
              </button>
            )}
          </div>

          {/* Table Card */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="bg-light">
                  <tr style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {isAdmin && <th className="px-4 py-3">Employee</th>}
                    <th className="px-4 py-3">Leave Type</th>
                    <th className="px-4 py-3">Date Range</th>
                    <th className="px-4 py-3">Status</th>
                    {isAdmin && <th className="px-4 py-3 text-end">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted small">Fetching data...</p>
                      </td>
                    </tr>
                  ) : leaveRequests.length > 0 ? (
                    leaveRequests.map((req) => (
                      <tr key={req.leave_id} className="hover-bg">
                        {isAdmin && (
                          <td className="px-4 py-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
                                <User size={16} />
                              </div>
                              <span className="fw-bold text-dark small">{req.employee_name || "Employee"}</span>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 fw-semibold text-secondary small">{req.leave_type}</td>
                        <td className="px-4 py-3">
                          <div className="d-flex flex-column">
                            <span className="small fw-bold text-dark">
                              {new Date(req.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} - {new Date(req.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-muted" style={{ fontSize: "11px" }}>
                              {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                        {isAdmin && (
                          <td className="px-4 py-3 text-end">
                            {req.status === "Pending" ? (
                              <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-success rounded-3 px-3 fw-bold" onClick={() => handleStatusChange(req.leave_id, "Approved")}>Approve</button>
                                <button className="btn btn-sm btn-outline-danger rounded-3 px-3 fw-bold" onClick={() => handleStatusChange(req.leave_id, "Rejected")}>Reject</button>
                              </div>
                            ) : (
                              <span className="text-muted small fst-italic">No actions</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
                        <AlertCircle size={32} className="text-muted mb-2 opacity-50" />
                        <p className="text-muted mb-0">No records found.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Apply Leave Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
                <div className="modal-header border-0 p-4 pb-0">
                  <h5 className="fw-bold fs-4 m-0">Apply for Absence</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleApplyLeave}>
                  <div className="modal-body p-4">
                    <div className="mb-3">
                      <label className="form-label small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.5px' }}>Leave Category</label>
                      <select className="form-select rounded-3 p-2 shadow-none border-2" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                        <option value="Annual">Annual Leave</option>
                        <option value="Sick">Sick / Medical Leave</option>
                        <option value="Casual">Casual Leave</option>
                        <option value="Maternity/Paternity">Maternity/Paternity</option>
                      </select>
                    </div>
                    <div className="row g-3 mb-3">
                      <div className="col-6">
                        <label className="form-label small fw-bold text-uppercase text-muted">Start Date</label>
                        <input type="date" className="form-control rounded-3 p-2 shadow-none border-2" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                      </div>
                      <div className="col-6">
                        <label className="form-label small fw-bold text-uppercase text-muted">End Date</label>
                        <input type="date" className="form-control rounded-3 p-2 shadow-none border-2" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                      </div>
                    </div>
                    <div className="mb-0">
                      <label className="form-label small fw-bold text-uppercase text-muted">Reason for Request</label>
                      <textarea className="form-control rounded-3 p-2 shadow-none border-2" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Provide context for your absence..." required></textarea>
                    </div>
                  </div>
                  <div className="modal-footer border-0 p-4 pt-0 gap-2">
                    <button type="button" className="btn btn-light rounded-3 px-4 flex-grow-1 fw-bold" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn text-white rounded-3 px-4 flex-grow-1 fw-bold" style={{ background: "#4f46e5" }}>Submit Request</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <style>{`
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .hover-bg:hover { background-color: #f8fafc; }
        `}</style>
      </PageContent>
    </div>
  );
};

export default Leaves;