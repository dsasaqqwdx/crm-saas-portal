// import React, { useState, useEffect, useCallback } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { Send, Loader2, Check, XCircle, Calendar, AlertCircle } from "lucide-react";
// import axios from "axios";

// const Leaves = () => {
//   const [leaveRequests, setLeaveRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   // Form State
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
//       console.error("Error updating leave:", err);
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
//       alert("Leave application submitted!");
//     } catch (err) {
//       alert(err.response?.data?.error || "Error applying for leave");
//     }
//   };

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>

//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2 className="fw-bold d-flex align-items-center">
//               Leave Management
//               {isRefreshing && <Loader2 size={18} className="ms-3 animate-spin text-primary" />}
//             </h2>
//             <p className="text-muted small">{isAdmin ? "Review and manage team leave requests" : "Track your leave history"}</p>
//           </div>
//           {!isAdmin && (
//             <button className="btn btn-primary d-flex align-items-center shadow-sm px-4" onClick={() => setShowModal(true)}>
//               <Send size={18} className="me-2" />
//               Apply for Leave
//             </button>
//           )}
//         </div>

//         <div className="card shadow-sm border-0 overflow-hidden">
//           <div className="card-header bg-white border-0 py-3">
//             <h6 className="fw-bold mb-0">{isAdmin ? "All Applications" : "My History"}</h6>
//           </div>
//           <div className="table-responsive">
//             <table className="table table-hover mb-0 align-middle">
//               <thead className="table-light text-muted small text-uppercase">
//                 <tr>
//                   {isAdmin && <th className="ps-4">Employee</th>}
//                   <th>Type</th>
//                   <th>Period</th>
//                   <th>Status</th>
//                   {isAdmin && <th className="text-end pe-4">Actions</th>}
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5">
//                       <Loader2 className="animate-spin mx-auto text-primary" />
//                     </td>
//                   </tr>
//                 ) : leaveRequests.length > 0 ? (
//                   leaveRequests.map((req) => (
//                     <tr key={req.leave_id}>
//                       {isAdmin && (
//                         <td className="ps-4">
//                           <div className="fw-bold">{req.employee_name || "Unknown"}</div>
//                           <small className="text-muted">ID: #{req.leave_id}</small>
//                         </td>
//                       )}
//                       <td className="fw-semibold">{req.leave_type}</td>
//                       <td>
//                         <div className="small fw-bold">
//                           {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}
//                         </div>
//                         <small className="text-muted">
//                           {Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
//                         </small>
//                       </td>
//                       <td>
//                         <span className={`badge bg-${req.status === "Approved" ? "success" : req.status === "Rejected" ? "danger" : "warning"} bg-opacity-10 text-${req.status === "Approved" ? "success" : req.status === "Rejected" ? "danger" : "warning"} border px-3`}>
//                           {req.status}
//                         </span>
//                       </td>
//                       {isAdmin && (
//                         <td className="text-end pe-4">
//                           {req.status === "Pending" ? (
//                             <div className="d-flex justify-content-end gap-2">
//                               <button className="btn btn-sm btn-success px-3" onClick={() => handleStatusChange(req.leave_id, "Approved")}>
//                                 <Check size={14} className="me-1" /> Approve
//                               </button>
//                               <button className="btn btn-sm btn-outline-danger px-3" onClick={() => handleStatusChange(req.leave_id, "Rejected")}>
//                                 <XCircle size={14} className="me-1" /> Reject
//                               </button>
//                             </div>
//                           ) : (
//                             <span className="text-muted small fst-italic">Processed</span>
//                           )}
//                         </td>
//                       )}
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={isAdmin ? "5" : "3"} className="text-center py-5 text-muted">
//                       <AlertCircle className="mx-auto mb-2 opacity-50" size={30} />
//                       <p className="mb-0">No leave requests found.</p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

      
//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content border-0 shadow-lg">
//               <div className="modal-header">
//                 <h5 className="modal-title fw-bold">Apply for Leave</h5>
//                 <button className="btn-close" onClick={() => setShowModal(false)}></button>
//               </div>
//               <form onSubmit={handleApplyLeave}>
//                 <div className="modal-body p-4">
//                   <div className="mb-3">
//                     <label className="form-label small fw-bold">Leave Type</label>
//                     <select className="form-select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//                       <option value="Annual">Annual Leave</option>
//                       <option value="Sick">Sick Leave</option>
//                       <option value="Casual">Casual Leave</option>
//                       <option value="Maternity/Paternity">Maternity/Paternity</option>
//                     </select>
//                   </div>
//                   <div className="row g-3">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label small fw-bold">Start Date</label>
//                       <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label small fw-bold">End Date</label>
//                       <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
//                     </div>
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label small fw-bold">Reason</label>
//                     <textarea className="form-control" rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly explain the reason for leave..." required></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0">
//                   <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Cancel</button>
//                   <button type="submit" className="btn btn-primary px-4 fw-bold">Submit Request</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaves;
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Send, Loader2, Check, XCircle, Calendar, AlertCircle, Clock, User, FileText, X } from "lucide-react";
import axios from "axios";

const Leaves = () => {
const [leaveRequests, setLeaveRequests] = useState([]);
const [loading, setLoading] = useState(true);
const [isRefreshing, setIsRefreshing] = useState(false);
const [showModal, setShowModal] = useState(false);

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
} catch (err) {
alert(err.response?.data?.error || "Error applying for leave");
}
};

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1150px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" },
header: { padding: "40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
th: { padding: "16px 24px", background: "#f8fafc", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #f1f5f9" },
td: { padding: "20px 24px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
statusBadge: (status) => ({
padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
backgroundColor: status === "Approved" ? "#dcfce7" : status === "Rejected" ? "#fee2e2" : "#fef9c3",
color: status === "Approved" ? "#15803d" : status === "Rejected" ? "#b91c1c" : "#a16207",
display: "inline-flex", alignItems: "center", gap: "6px"
}),
btnApprove: { padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
btnReject: { padding: "8px 16px", background: "#fff", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer" },
modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
modalContent: { background: "#fff", width: "500px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "8px", outline: "none", fontSize: "14px" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.header}>
<div>
<h2 style={s.title}>
Leave Management
{isRefreshing && <Loader2 size={20} style={{ marginLeft: "15px", animation: "spin 1s linear infinite", color: "#6366f1" }} />}
</h2>
<p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>{isAdmin ? "Centralized processing of organization-wide time-off requests." : "Maintain and track your personal leave history."}</p>
</div>
{!isAdmin && (
<button 
style={{ padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
onClick={() => setShowModal(true)}
>
<Send size={18} /> Apply for Leave
</button>
)}
</header>

<div style={{ overflowX: "auto" }}>
<table style={s.table}>
<thead>
<tr>
{isAdmin && <th style={s.th}>Employee Asset</th>}
<th style={s.th}>Classification</th>
<th style={s.th}>Duration & Period</th>
<th style={s.th}>Current Status</th>
{isAdmin && <th style={{ ...s.th, textAlign: "right" }}>Review Actions</th>}
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan={isAdmin ? "5" : "3"} style={{ textAlign: "center", padding: "80px" }}>
<Loader2 size={40} style={{ animation: "spin 2s linear infinite", color: "#e2e8f0" }} />
</td></tr>
) : leaveRequests.length > 0 ? (
leaveRequests.map((req) => (
<tr key={req.leave_id} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
{isAdmin && (
<td style={s.td}>
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
<div style={{ width: "36px", height: "36px", background: "#eef2ff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: "700" }}>{req.employee_name?.charAt(0)}</div>
<div>
<div style={{ fontWeight: "700", color: "#1e293b" }}>{req.employee_name || "Guest"}</div>
<div style={{ fontSize: "11px", color: "#94a3b8" }}>REF: #{req.leave_id}</div>
</div>
</div>
</td>
)}
<td style={{ ...s.td, fontWeight: "600" }}>{req.leave_type}</td>
<td style={s.td}>
<div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", color: "#475569" }}>
<Calendar size={14} color="#94a3b8" />
{new Date(req.start_date).toLocaleDateString()} — {new Date(req.endDate || req.end_date).toLocaleDateString()}
</div>
<div style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "22px", marginTop: "2px" }}>
{Math.ceil((new Date(req.end_date) - new Date(req.start_date)) / (1000 * 60 * 60 * 24)) + 1} Business Days
</div>
</td>
<td style={s.td}>
<span style={s.statusBadge(req.status)}>
<div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "currentColor" }}></div>
{req.status}
</span>
</td>
{isAdmin && (
<td style={{ ...s.td, textAlign: "right" }}>
{req.status === "Pending" ? (
<div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
<button style={s.btnApprove} onClick={() => handleStatusChange(req.leave_id, "Approved")}>Approve</button>
<button style={s.btnReject} onClick={() => handleStatusChange(req.leave_id, "Rejected")}>Reject</button>
</div>
) : (
<span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500", fontStyle: "italic" }}>Processed</span>
)}
</td>
)}
</tr>
))
) : (
<tr><td colSpan={isAdmin ? "5" : "3"} style={{ textAlign: "center", padding: "100px" }}>
<AlertCircle size={40} color="#e2e8f0" style={{ marginBottom: "16px" }} />
<p style={{ color: "#94a3b8", fontSize: "15px", margin: 0 }}>No pending leave applications detected.</p>
</td></tr>
)}
</tbody>
</table>
</div>
</div>
</main>

{showModal && (
<div style={s.modalOverlay}>
<div style={s.modalContent}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
<h3 style={{ margin: 0, fontWeight: "800", fontSize: "22px", fontFamily: "Syne" }}>Apply for Leave</h3>
<X size={20} style={{ cursor: "pointer", color: "#94a3b8" }} onClick={() => setShowModal(false)} />
</div>
<form onSubmit={handleApplyLeave}>
<div style={{ marginBottom: "20px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Leave Category</label>
<select style={s.input} value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
<option value="Annual">Annual Leave</option>
<option value="Sick">Medical / Sick Leave</option>
<option value="Casual">Casual Leave</option>
<option value="Maternity">Maternity/Paternity</option>
</select>
</div>
<div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
<div style={{ flex: 1 }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Start Date</label>
<input type="date" style={s.input} value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
</div>
<div style={{ flex: 1 }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>End Date</label>
<input type="date" style={s.input} value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
</div>
</div>
<div style={{ marginBottom: "32px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Primary Reason</label>
<textarea style={{ ...s.input, minHeight: "100px", resize: "none" }} placeholder="Briefly describe the purpose of your absence..." value={reason} onChange={(e) => setReason(e.target.value)} required />
</div>
<div style={{ display: "flex", gap: "12px" }}>
<button type="button" style={{ flex: 1, padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }} onClick={() => setShowModal(false)}>Discard</button>
<button type="submit" style={{ flex: 2, padding: "14px", borderRadius: "14px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
<Send size={18} /> Submit Application
</button>
</div>
</form>
</div>
</div>
)}
</div>
);
};

export default Leaves;
