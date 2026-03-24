// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { Plus, CalendarDays } from "lucide-react";
// import axios from "axios";

// function Holidays() {
//   const [holidays, setHolidays] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [description, setDescription] = useState("");
//   const [holidayDate, setHolidayDate] = useState("");

//   const role = localStorage.getItem("role");
//   const isAdmin = role === "company_admin" || role === "super_admin";

//   const fetchHolidays = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get("http://localhost:5001/api/holidays", {
//         headers: { "x-auth-token": token }
//       });
//       setHolidays(res.data.data);
//     } catch (err) {
//       console.error("Error fetching holidays:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHolidays();
//   }, []);

//   const handleAddHoliday = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post("http://localhost:5001/api/holidays/add", {
//         description,
//         holiday_date: holidayDate
//       }, { headers: { "x-auth-token": token } });

//       alert("Holiday Added Successfully!");
//       setShowModal(false);
//       setDescription("");
//       setHolidayDate("");
//       fetchHolidays();
//     } catch (err) {
//       alert(err.response?.data?.error || "Error adding holiday");
//     }
//   };

//   const nextHoliday = holidays.find(h => new Date(h.holiday_date) >= new Date());

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2 className="fw-bold">Holiday Calendar 2026</h2>
//             <p className="text-muted">View upcoming public and company holidays</p>
//           </div>
//           {isAdmin && (
//             <button className="btn btn-primary d-flex align-items-center shadow-sm" onClick={() => setShowModal(true)}>
//               <Plus size={18} className="me-2" />
//               Add Holiday
//             </button>
//           )}
//         </div>

//         {nextHoliday && (
//           <div className="card bg-primary text-white mb-4 shadow border-0 overflow-hidden">
//             <div className="card-body p-4 d-flex justify-content-between align-items-center">
//               <div>
//                 <span className="badge bg-white text-primary mb-2 px-3 py-2 rounded-pill fw-bold">
//                   Next Holiday
//                 </span>
//                 <h2 className="fw-bold mb-1">{nextHoliday.description}</h2>
//                 <p className="mb-0 opacity-75 fs-5">
//                   {new Date(nextHoliday.holiday_date).toLocaleDateString(undefined, {
//                     weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
//                   })}
//                 </p>
//               </div>
//               <div className="text-center bg-white bg-opacity-25 p-3 rounded-3" style={{ minWidth: '120px' }}>
//                 <p className="small mb-1 text-uppercase tracking-wider opacity-75">Days Away</p>
//                 <h1 className="fw-bold mb-0">
//                   {Math.ceil((new Date(nextHoliday.holiday_date) - new Date()) / (1000 * 60 * 60 * 24))}
//                 </h1>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="row g-4">
//           {loading ? (
//             <div className="col-12 text-center py-5">
//               <div className="spinner-border text-primary" role="status"></div>
//             </div>
//           ) : holidays.length > 0 ? holidays.map((holiday) => (
//             <div key={holiday.holiday_id} className="col-md-6 col-xl-4">
//               <div className="card shadow-sm border-0 h-100 hover-shadow transition">
//                 <div className="card-body d-flex align-items-center p-3">
//                   <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-3 me-3">
//                     <CalendarDays size={24} />
//                   </div>
//                   <div className="flex-grow-1">
//                     <h6 className="fw-bold mb-1 text-dark">
//                       {holiday.description || "Company Holiday"}
//                     </h6>
//                     <p className="text-muted small mb-0 fw-semibold">
//                       {new Date(holiday.holiday_date).toLocaleDateString(undefined, {
//                         month: 'short', day: 'numeric', year: 'numeric'
//                       })}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )) : (
//             <div className="col-12 text-center py-5">
//               <p className="text-muted">No holidays marked for this company yet.</p>
//             </div>
//           )}
//         </div>

//         <div className="alert border-0 shadow-sm bg-white mt-5 p-4 rounded-3">
//           <div className="d-flex align-items-center text-info mb-2">
//             <CalendarDays size={20} className="me-2" />
//             <h6 className="mb-0 fw-bold">Branch Specific Holidays</h6>
//           </div>
//           <p className="text-muted small mb-0">
//             Holidays listed here apply to all employees in your organization. Regional public holidays may be added by local admins.
//           </p>
//         </div>
//       </div>

      
//       {showModal && (
//         <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content shadow border-0">
//               <div className="modal-header border-0 pb-0">
//                 <h5 className="modal-title fw-bold">Add Company Holiday</h5>
//                 <button className="btn-close" onClick={() => setShowModal(false)}></button>
//               </div>
//               <form onSubmit={handleAddHoliday}>
//                 <div className="modal-body p-4">
//                   <div className="mb-3">
//                     <label className="form-label small fw-bold">Holiday Description</label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       placeholder="e.g. Independence Day"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                       required
//                     />
//                   </div>
//                   <div className="mb-3">
//                     <label className="form-label small fw-bold">Holiday Date</label>
//                     <input
//                       type="date"
//                       className="form-control"
//                       value={holidayDate}
//                       onChange={(e) => setHolidayDate(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div className="modal-footer border-0">
//                   <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowModal(false)}>Cancel</button>
//                   <button type="submit" className="btn btn-primary rounded-pill px-4 fw-bold">Save Holiday</button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Holidays;
import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { Plus, CalendarDays, X, Clock, MapPin } from "lucide-react";
import axios from "axios";

function Holidays() {
const [holidays, setHolidays] = useState([]);
const [loading, setLoading] = useState(true);
const [showModal, setShowModal] = useState(false);
const [description, setDescription] = useState("");
const [holidayDate, setHolidayDate] = useState("");

const role = localStorage.getItem("role");
const isAdmin = role === "company_admin" || role === "super_admin";

const fetchHolidays = async () => {
try {
const token = localStorage.getItem("token");
const res = await axios.get("http://localhost:5001/api/holidays", {
headers: { "x-auth-token": token }
});
setHolidays(res.data.data);
} catch (err) {
console.error("Error fetching holidays:", err);
} finally {
setLoading(false);
}
};

useEffect(() => {
fetchHolidays();
}, []);

const handleAddHoliday = async (e) => {
e.preventDefault();
try {
const token = localStorage.getItem("token");
await axios.post("http://localhost:5001/api/holidays/add", {
description,
holiday_date: holidayDate
}, { headers: { "x-auth-token": token } });

setShowModal(false);
setDescription("");
setHolidayDate("");
fetchHolidays();
} catch (err) {
alert(err.response?.data?.error || "Error adding holiday");
}
};

const nextHoliday = holidays.find(h => new Date(h.holiday_date) >= new Date());

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1100px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden" },
boxHeader: { padding: "40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
heroCard: { margin: "0 40px 40px", padding: "32px", borderRadius: "20px", background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff", position: "relative", overflow: "hidden" },
grid: { padding: "0 40px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
holidayCard: { padding: "20px", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "16px", transition: "transform 0.2s, box-shadow 0.2s" },
modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
modalContent: { background: "#fff", width: "450px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" },
input: { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "8px", outline: "none", fontSize: "14px" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.boxHeader}>
<div>
<h2 style={s.title}>Holiday Calendar 2026</h2>
<p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Organization-wide public and observed holidays.</p>
</div>
{isAdmin && (
<button 
style={{ padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
onClick={() => setShowModal(true)}
>
<Plus size={18} /> Add Holiday
</button>
)}
</header>

{nextHoliday && (
<div style={s.heroCard}>
<div style={{ position: "relative", zIndex: 2 }}>
<span style={{ background: "rgba(255,255,255,0.2)", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" }}>Upcoming Celebration</span>
<h2 style={{ fontSize: "32px", fontWeight: "800", margin: "16px 0 8px" }}>{nextHoliday.description}</h2>
<div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
<div style={{ display: "flex", alignItems: "center", gap: "8px", opacity: 0.9 }}>
<Clock size={18} /> 
{new Date(nextHoliday.holiday_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
</div>
<div style={{ height: "20px", width: "1px", background: "rgba(255,255,255,0.3)" }}></div>
<div style={{ fontWeight: "700" }}>{Math.ceil((new Date(nextHoliday.holiday_date) - new Date()) / (1000 * 60 * 60 * 24))} Days Left</div>
</div>
</div>
<CalendarDays size={180} style={{ position: "absolute", right: "-20px", bottom: "-40px", opacity: 0.1, transform: "rotate(-15deg)" }} />
</div>
)}

<div style={s.grid}>
{loading ? (
<div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px" }}>
<div className="spinner-border text-primary"></div>
</div>
) : holidays.length > 0 ? (
holidays.map((holiday) => (
<div key={holiday.holiday_id} style={s.holidayCard} onMouseOver={(e) => { e.currentTarget.style.borderColor = "#4f46e5"; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = "#f1f5f9"; e.currentTarget.style.transform = "translateY(0)"; }}>
<div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "#f5f3ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center" }}>
<CalendarDays size={24} />
</div>
<div>
<div style={{ fontWeight: "700", color: "#1e293b", fontSize: "15px" }}>{holiday.description || "Holiday"}</div>
<div style={{ color: "#64748b", fontSize: "13px", marginTop: "2px" }}>
{new Date(holiday.holiday_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
</div>
</div>
</div>
))
) : (
<div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "#94a3b8" }}>No holiday data synchronized.</div>
)}
</div>

<div style={{ margin: "0 40px 40px", padding: "20px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", gap: "12px", alignItems: "center" }}>
<MapPin size={20} color="#6366f1" />
<p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>
<strong>Note:</strong> These are corporate-level holidays. Regional or branch-specific observances may be managed by local administrators.
</p>
</div>
</div>
</main>

{showModal && (
<div style={s.modalOverlay}>
<div style={s.modalContent}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
<h3 style={{ margin: 0, fontWeight: "800", fontSize: "20px", fontFamily: "Syne" }}>Add New Holiday</h3>
<X size={20} style={{ cursor: "pointer", color: "#64748b" }} onClick={() => setShowModal(false)} />
</div>
<form onSubmit={handleAddHoliday}>
<div style={{ marginBottom: "20px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Holiday Description</label>
<input type="text" style={s.input} placeholder="e.g. Annual Company Retreat" value={description} onChange={(e) => setDescription(e.target.value)} required />
</div>
<div style={{ marginBottom: "32px" }}>
<label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>Observation Date</label>
<input type="date" style={s.input} value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} required />
</div>
<div style={{ display: "flex", gap: "12px" }}>
<button type="button" style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "600", cursor: "pointer" }} onClick={() => setShowModal(false)}>Cancel</button>
<button type="submit" style={{ flex: 2, padding: "12px", borderRadius: "12px", border: "none", background: "#4f46e5", color: "#fff", fontWeight: "600", cursor: "pointer" }}>Save to Calendar</button>
</div>
</form>
</div>
</div>
)}
</div>
);
}

export default Holidays;
