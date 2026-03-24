// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { DollarSign, CheckCircle2, Download, Loader2 } from "lucide-react";
// import axios from "axios";

// function Payroll() {
//   const [payrollData, setPayrollData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);

  
//   const [selectedEmp, setSelectedEmp] = useState("");
//   const [salary, setSalary] = useState("");
//   const [deductions, setDeductions] = useState("0");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const fetchPayroll = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5001/api/payroll", {
//         headers: { "x-auth-token": token }
//       });
//       setPayrollData(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching payroll:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPayroll();
//   }, []);

//   // --- DOWNLOAD LOGIC ---
//   const handleDownload = async (payrollId, employeeName) => {
//     if (!payrollId) {
//       alert("No payment record found to download.");
//       return;
//     }
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(`http://localhost:5001/api/payroll/download/${payrollId}`, {
//         headers: { "x-auth-token": token }
//       });

//       const data = res.data.data;

//       const content = `
// -----------------------------------------
// PAYSLIP: ${data.company_name || 'Shnoor International'}
// -----------------------------------------
// Employee Name : ${data.name}
// Reference ID  : EMP-${data.employee_id}
// Payment Date  : ${new Date(data.pay_date).toLocaleDateString()}
// Department    : ${data.department_name || 'General'}
// -----------------------------------------
// Earnings:
// Base Salary   : ₹${parseFloat(data.salary).toLocaleString()}
// Bonus         : ₹${parseFloat(data.bonus || 0).toLocaleString()}

// Deductions:
// Total Deduct. : ₹${parseFloat(data.deductions || 0).toLocaleString()}
// -----------------------------------------
// NET SALARY    : ₹${parseFloat(data.net_salary).toLocaleString()}
// -----------------------------------------
// This is a computer-generated document.
//       `;

//       const element = document.createElement("a");
//       const file = new Blob([content], { type: 'text/plain' });
//       element.href = URL.createObjectURL(file);
//       element.download = `Payslip_${employeeName.replace(/\s+/g, "_")}.txt`;
//       document.body.appendChild(element);
//       element.click();
//       document.body.removeChild(element);
//     } catch (err) {
//       console.error("Download error:", err);
//       alert(err.response?.data?.error || "Could not download payslip");
//     }
//   };

//   const handleRunPayroll = async (e) => {
//     e.preventDefault();
//     if (!selectedEmp) return;

//     setIsSubmitting(true);
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5001/api/payroll/generate", {
//         employee_id: parseInt(selectedEmp),
//         salary: parseFloat(salary),
//         deductions: parseFloat(deductions)
//       }, { headers: { "x-auth-token": token } });

//       alert("Payroll Generated Successfully!");
//       setShowModal(false);
//       setSelectedEmp("");
//       setSalary("");
//       setDeductions("0");
//       fetchPayroll();
//     } catch (err) {
//       alert(err.response?.data?.error || "Error generating payroll");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const totalPayout = payrollData.reduce((acc, curr) => acc + (parseFloat(curr.last_net_salary) || 0), 0);

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
//         <div className="container-fluid p-4">

//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <div>
//               <h2 className="fw-bold text-dark">Payroll Management</h2>
//               <p className="text-muted small">Financial records and salary processing</p>
//             </div>
//             <button className="btn btn-primary d-flex align-items-center shadow-sm px-4" onClick={() => setShowModal(true)}>
//               <DollarSign size={18} className="me-2" />
//               Process Payment
//             </button>
//           </div>

//           <div className="row g-3 mb-4">
//             <div className="col-md-4">
//               <div className="card p-3 shadow-sm border-0">
//                 <p className="text-muted small mb-1">Total Payout (Current Cycle)</p>
//                 <h4 className="fw-bold mb-1 text-primary">₹{totalPayout.toLocaleString()}</h4>
//                 <div className="text-success small d-flex align-items-center">
//                   <CheckCircle2 size={14} className="me-1" /> Cycle Active
//                 </div>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="card p-3 shadow-sm border-0">
//                 <p className="text-muted small mb-1">Total Employees</p>
//                 <h4 className="fw-bold mb-1">{payrollData.length}</h4>
//                 <span className="text-muted small">Staff on record</span>
//               </div>
//             </div>
//             <div className="col-md-4">
//               <div className="card p-3 shadow-sm border-0 text-center">
//                 <p className="text-muted small mb-1">Status</p>
//                 <div className="badge bg-primary bg-opacity-10 text-primary py-2 px-3">Live Records</div>
//               </div>
//             </div>
//           </div>

//           <div className="card shadow-sm border-0 overflow-hidden">
//             <div className="table-responsive">
//               <table className="table table-hover mb-0 align-middle">
//                 <thead className="table-light">
//                   <tr>
//                     <th className="ps-4">Employee</th>
//                     <th>Net Salary</th>
//                     <th>Status</th>
//                     <th>Payment Date</th>
//                     <th className="text-end pe-4">Payslip</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr><td colSpan="5" className="text-center py-5"><Loader2 className="animate-spin mx-auto" /></td></tr>
//                   ) : payrollData.length > 0 ? payrollData.map((pay) => (
//                     <tr key={pay.employee_id}>
//                       <td className="ps-4 fw-semibold text-dark">{pay.name}</td>
//                       <td className="fw-bold">₹{parseFloat(pay.last_net_salary || 0).toLocaleString()}</td>
//                       <td>
//                         <span className={`badge ${pay.pay_date ? "bg-success" : "bg-warning text-dark"} bg-opacity-10 text-${pay.pay_date ? "success" : "warning"} border`}>
//                           {pay.pay_date ? "Paid" : "Pending"}
//                         </span>
//                       </td>
//                       <td>{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "No record"}</td>
//                       <td className="text-end pe-4">
//                         <button
//                           className={`btn btn-sm ${pay.pay_date ? "btn-outline-primary" : "btn-outline-secondary disabled border-0"}`}
//                           onClick={() => handleDownload(pay.payroll_id, pay.name)}
//                         >
//                           <Download size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   )) : (
//                     <tr><td colSpan="5" className="text-center py-5 text-muted">No records found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* MODAL (Unchanged) */}
//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content shadow-lg border-0">
//               <div className="modal-header border-bottom-0 pb-0">
//                 <h5 className="modal-title fw-bold">Process Payment</h5>
//                 <button className="btn-close" onClick={() => setShowModal(false)}></button>
//               </div>
//               <form onSubmit={handleRunPayroll}>
//                 <div className="modal-body p-4">
//                   <div className="mb-3">
//                     <label className="form-label small fw-bold">Select Staff Member</label>
//                     <select
//                       className="form-select border-2"
//                       value={selectedEmp}
//                       onChange={(e) => setSelectedEmp(e.target.value)}
//                       required
//                     >
//                       <option value="">-- Choose Employee --</option>
//                       {payrollData.map(emp => (
//                         <option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="row g-3">
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label small fw-bold">Base Salary (₹)</label>
//                       <input
//                         type="number"
//                         className="form-control border-2"
//                         placeholder="0.00"
//                         value={salary}
//                         onChange={(e) => setSalary(e.target.value)}
//                         required
//                       />
//                     </div>
//                     <div className="col-md-6 mb-3">
//                       <label className="form-label small fw-bold">Deductions (₹)</label>
//                       <input
//                         type="number"
//                         className="form-control border-2"
//                         value={deductions}
//                         onChange={(e) => setDeductions(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="modal-footer border-top-0 pt-0">
//                   <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
//                   <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold" disabled={isSubmitting}>
//                     {isSubmitting ? "Processing..." : "Confirm & Pay"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Payroll;


import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { DollarSign, CheckCircle2, Download, Loader2, Wallet, Users, Activity, X, Clock } from "lucide-react";
import axios from "axios";

function Payroll() {
const [payrollData, setPayrollData] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);

const [selectedEmp, setSelectedEmp] = useState("");
const [salary, setSalary] = useState("");
const [deductions, setDeductions] = useState("0");
const [isSubmitting, setIsSubmitting] = useState(false);

const fetchPayroll = async () => {
try {
setLoading(true);
const token = localStorage.getItem("token");
const res = await axios.get("http://localhost:5001/api/payroll", {
headers: { "x-auth-token": token }
});
setPayrollData(res.data.data || []);
} catch (err) {
console.error("Error fetching payroll:", err);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchPayroll();
}, []);

const handleDownload = async (payrollId, employeeName) => {
if (!payrollId) {
alert("No payment record found to download.");
return;
}
try {
const token = localStorage.getItem("token");
const res = await axios.get(`http://localhost:5001/api/payroll/download/${payrollId}`, {
headers: { "x-auth-token": token }
});

const data = res.data.data;

const content = `
-----------------------------------------
PAYSLIP: ${data.company_name || 'Shnoor International'}
-----------------------------------------
Employee Name : ${data.name}
Reference ID  : EMP-${data.employee_id}
Payment Date  : ${new Date(data.pay_date).toLocaleDateString()}
Department    : ${data.department_name || 'General'}
-----------------------------------------
Earnings:
Base Salary   : ₹${parseFloat(data.salary).toLocaleString()}
Bonus         : ₹${parseFloat(data.bonus || 0).toLocaleString()}

Deductions:
Total Deduct. : ₹${parseFloat(data.deductions || 0).toLocaleString()}
-----------------------------------------
NET SALARY    : ₹${parseFloat(data.net_salary).toLocaleString()}
-----------------------------------------
This is a computer-generated document.
`;

const element = document.createElement("a");
const file = new Blob([content], { type: 'text/plain' });
element.href = URL.createObjectURL(file);
element.download = `Payslip_${employeeName.replace(/\s+/g, "_")}.txt`;
document.body.appendChild(element);
element.click();
document.body.removeChild(element);
} catch (err) {
console.error("Download error:", err);
alert(err.response?.data?.error || "Could not download payslip");
}
};

const handleRunPayroll = async (e) => {
e.preventDefault();
if (!selectedEmp) return;

setIsSubmitting(true);
try {
const token = localStorage.getItem("token");
await axios.post("http://localhost:5001/api/payroll/generate", {
employee_id: parseInt(selectedEmp),
salary: parseFloat(salary),
deductions: parseFloat(deductions)
}, { headers: { "x-auth-token": token } });

alert("Payroll Generated Successfully!");
setShowModal(false);
setSelectedEmp("");
setSalary("");
setDeductions("0");
fetchPayroll();
} catch (err) {
alert(err.response?.data?.error || "Error generating payroll");
} finally {
setIsSubmitting(false);
}
};

const totalPayout = payrollData.reduce((acc, curr) => acc + (parseFloat(curr.last_net_salary) || 0), 0);

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1150px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" },
header: { padding: "40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
statsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", padding: "30px 40px", background: "#fafbfc" },
statCard: { background: "#fff", padding: "20px", borderRadius: "16px", border: "1px solid #eef2f6", display: "flex", alignItems: "center", gap: "16px" },
table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
th: { padding: "16px 24px", background: "#f8fafc", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #f1f5f9" },
td: { padding: "20px 24px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
badge: (paid) => ({
padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
backgroundColor: paid ? "#dcfce7" : "#fffbeb",
color: paid ? "#15803d" : "#92400e",
display: "inline-flex", alignItems: "center", gap: "6px", border: "1px solid transparent"
}),
modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
modalContent: { background: "#fff", width: "480px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "8px", outline: "none", fontSize: "14px" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.header}>
<div>
<h2 style={s.title}>Payroll Management</h2>
<p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Financial records and salary processing for the current cycle.</p>
</div>
<button 
style={{ padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)" }}
onClick={() => setShowModal(true)}
>
<DollarSign size={18} /> Process Payment
</button>
</header>

<div style={s.statsGrid}>
<div style={s.statCard}>
<div style={{ padding: "12px", background: "#eef2ff", color: "#4f46e5", borderRadius: "12px" }}><Wallet size={24} /></div>
<div>
<div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Total Payout</div>
<div style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>₹{totalPayout.toLocaleString()}</div>
</div>
</div>
<div style={s.statCard}>
<div style={{ padding: "12px", background: "#f0fdf4", color: "#16a34a", borderRadius: "12px" }}><Users size={24} /></div>
<div>
<div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>Staff Count</div>
<div style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b" }}>{payrollData.length}</div>
</div>
</div>
<div style={s.statCard}>
<div style={{ padding: "12px", background: "#fff7ed", color: "#ea580c", borderRadius: "12px" }}><Activity size={24} /></div>
<div>
<div style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>System Status</div>
<div style={{ fontSize: "14px", fontWeight: "700", color: "#16a34a" }}>Active Cycle</div>
</div>
</div>
</div>

<div style={{ overflowX: "auto" }}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Employee Name</th>
<th style={s.th}>Net Disbursement</th>
<th style={s.th}>Payment Status</th>
<th style={s.th}>Settlement Date</th>
<th style={{ ...s.th, textAlign: "right" }}>Documentation</th>
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan="5" style={{ textAlign: "center", padding: "80px" }}><Loader2 size={32} style={{ animation: "spin 2s linear infinite", color: "#cbd5e1" }} /></td></tr>
) : payrollData.length > 0 ? (
payrollData.map((pay) => (
<tr key={pay.employee_id} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
<td style={{ ...s.td, fontWeight: "700", color: "#1e293b" }}>{pay.name}</td>
<td style={{ ...s.td, fontWeight: "800", color: "#0f172a" }}>₹{parseFloat(pay.last_net_salary || 0).toLocaleString()}</td>
<td style={s.td}>
<span style={s.badge(pay.pay_date)}>
{pay.pay_date ? <CheckCircle2 size={14} /> : <Clock size={14} />}
{pay.pay_date ? "Paid" : "Pending"}
</span>
</td>
<td style={{ ...s.td, color: "#64748b" }}>{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "Pending Cycle"}</td>
<td style={{ ...s.td, textAlign: "right" }}>
<button
style={{ padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0", background: pay.pay_date ? "#fff" : "#f8fafc", cursor: pay.pay_date ? "pointer" : "not-allowed", color: pay.pay_date ? "#4f46e5" : "#cbd5e1" }}
onClick={() => handleDownload(pay.payroll_id, pay.name)}
disabled={!pay.pay_date}
title="Download Payslip"
>
<Download size={18} />
</button>
</td>
</tr>
))
) : (
<tr><td colSpan="5" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>No payroll records discovered for this cycle.</td></tr>
)}
</tbody>
</table>
</div>
</div>
</main>

{showModal && (
<div style={s.modalOverlay}>
<div style={s.modalContent}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
<h3 style={{ margin: 0, fontWeight: "800", fontSize: "20px", fontFamily: "Syne" }}>Process Payment</h3>
<X size={20} style={{ cursor: "pointer", color: "#94a3b8" }} onClick={() => setShowModal(false)} />
</div>
<form onSubmit={handleRunPayroll}>
<div style={{ marginBottom: "20px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Select Employee</label>
<select style={s.input} value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)} required>
<option value="">Choose employee...</option>
{payrollData.map(emp => (
<option key={emp.employee_id} value={emp.employee_id}>{emp.name}</option>
))}
</select>
</div>
<div style={{ marginBottom: "20px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Base Salary (₹)</label>
<input type="number" style={s.input} placeholder="0.00" value={salary} onChange={(e) => setSalary(e.target.value)} required />
</div>
<div style={{ marginBottom: "32px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Total Deductions (₹)</label>
<input type="number" style={s.input} value={deductions} onChange={(e) => setDeductions(e.target.value)} required />
</div>
<div style={{ display: "flex", gap: "12px" }}>
<button type="button" style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer" }} onClick={() => setShowModal(false)}>Cancel</button>
<button type="submit" disabled={isSubmitting} style={{ flex: 2, padding: "12px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "700", cursor: "pointer" }}>
{isSubmitting ? "Processing..." : "Generate Payslip"}
</button>
</div>
</form>
</div>
</div>
)}
</div>
);
}

export default Payroll;
