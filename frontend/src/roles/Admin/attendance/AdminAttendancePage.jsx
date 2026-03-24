
// import React, { useEffect, useState } from "react";
// import API from "../../../api/api";
// import Sidebar from "../../../layouts/Sidebar";
// const AdminAttendancePage = () => {
// const [attendance, setAttendance] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState("");

// useEffect(() => {
// fetchAttendance();
// }, []);

// const fetchAttendance = async () => {
// try {
// const res = await API.get("/attendance/all");
// setAttendance(res.data);
// setError("");
// } catch (err) {
// console.error("Error fetching attendance", err);
// setError("Failed to load attendance");
// } finally {
// setLoading(false);
// }
// };

// const styles = {
// wrapper: { marginLeft: "260px", padding: "40px", backgroundColor: "#f8f9fa", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif" },
// headerSection: { marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
// title: { fontSize: "24px", fontWeight: "700", color: "#1a1d23", letterSpacing: "-0.02em" },
// card: { backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #edf2f7", overflow: "hidden" },
// table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
// thead: { backgroundColor: "#f1f4f8" },
// th: { padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#64748b", borderBottom: "1px solid #edf2f7" },
// td: { padding: "18px 24px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
// badge: (status) => ({
// padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600",
// backgroundColor: status === "Present" ? "#ecfdf5" : "#fffbeb",
// color: status === "Present" ? "#059669" : "#d97706"
// }),
// nameCell: { fontWeight: "600", color: "#1e293b" },
// timeCell: { fontVariantNumeric: "tabular-nums", color: "#64748b" }
// };

// return (
//   <div style={styles.root}>
//     <Sidebar />
// <div style={styles.wrapper}>
  
// <div style={styles.headerSection}>
// <h2 style={styles.title}>Attendance Overview</h2>
// <div style={{ color: "#64748b", fontSize: "14px" }}>{attendance.length} Records Found</div>
// </div>

// {error && (
// <div style={{ padding: "16px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: "8px", marginBottom: "20px", border: "1px solid #fee2e2" }}>
// {error}
// </div>
// )}

// <div style={styles.card}>
// {loading ? (
// <div style={{ padding: "60px", textAlign: "center" }}>
// <div className="spinner-border text-primary" style={{ width: "2rem", height: "2rem" }}></div>
// <p style={{ marginTop: "16px", color: "#64748b" }}>Syncing records...</p>
// </div>
// ) : (
// <div style={{ overflowX: "auto" }}>
// <table style={styles.table}>
// <thead style={styles.thead}>
// <tr>
// <th style={styles.th}>Employee</th>
// <th style={styles.th}>Date</th>
// <th style={styles.th}>Status</th>
// <th style={styles.th}>Check In</th>
// <th style={styles.th}>Check Out</th>
// </tr>
// </thead>
// <tbody>
// {attendance.length > 0 ? (
// attendance.map((item, index) => (
// <tr key={index} style={{ transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
// <td style={{ ...styles.td, ...styles.nameCell }}>{item.name}</td>
// <td style={styles.td}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
// <td style={styles.td}>
// <span style={styles.badge(item.status)}>{item.status}</span>
// </td>
// <td style={{ ...styles.td, ...styles.timeCell }}>{item.check_in || "—"}</td>
// <td style={{ ...styles.td, ...styles.timeCell }}>{item.check_out || "—"}</td>
// </tr>
// ))
// ) : (
// <tr>
// <td colSpan="5" style={{ ...styles.td, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
// No attendance records discovered for this period.
// </td>
// </tr>
// )}
// </tbody>
// </table>
// </div>
// )}
// </div>
// </div>
// </div>
// );
// };

// export default AdminAttendancePage;
import React, { useEffect, useState } from "react";
import API from "../../../api/api";
import Sidebar from "../../../layouts/Sidebar";

const AdminAttendancePage = () => {
const [attendance, setAttendance] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
fetchAttendance();
}, []);

const fetchAttendance = async () => {
try {
const res = await API.get("/attendance/all");
setAttendance(res.data);
setError("");
} catch (err) {
console.error("Error fetching attendance", err);
setError("Failed to load attendance");
} finally {
setLoading(false);
}
};

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1100px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" },
boxHeader: { padding: "40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
subText: { color: "#64748b", fontSize: "14px", marginTop: "4px" },
tableContainer: { padding: "0 40px 40px" },
table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
thead: { position: "sticky", top: 0, zIndex: 10 },
th: { padding: "16px 20px", background: "#f8fafc", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #f1f5f9" },
td: { padding: "20px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
badge: (status) => ({
padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
backgroundColor: status === "Present" ? "#dcfce7" : "#fef9c3",
color: status === "Present" ? "#15803d" : "#a16207",
display: "inline-flex", alignItems: "center", gap: "6px"
}),
nameCell: { fontWeight: "700", color: "#1e293b", fontSize: "15px" },
timeText: { fontVariantNumeric: "tabular-nums", color: "#64748b", fontWeight: "500" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.boxHeader}>
<div>
<h2 style={s.title}>Attendance Registry</h2>
<p style={s.subText}>Real-time monitoring of workplace presence and clock-in metrics.</p>
</div>
<div style={{ textAlign: "right" }}>
<span style={{ fontSize: "24px", fontWeight: "800", color: "#4f46e5" }}>{attendance.length}</span>
<div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" }}>Total Entries</div>
</div>
</header>

<div style={s.tableContainer}>
{error && (
<div style={{ margin: "20px 0", padding: "16px", backgroundColor: "#fff1f2", color: "#e11d48", borderRadius: "12px", fontSize: "14px", fontWeight: "500", border: "1px solid #ffe4e6" }}>
{error}
</div>
)}

{loading ? (
<div style={{ padding: "80px 0", textAlign: "center" }}>
<div className="spinner-border text-primary" style={{ width: "2.5rem", height: "2.5rem", borderWidth: "3px" }}></div>
<p style={{ marginTop: "20px", color: "#94a3b8", fontWeight: "500" }}>Fetching secure records...</p>
</div>
) : (
<div style={{ overflowX: "auto" }}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Employee Name</th>
<th style={s.th}>Calendar Date</th>
<th style={s.th}>Current Status</th>
<th style={s.th}>Entry Time</th>
<th style={s.th}>Exit Time</th>
</tr>
</thead>
<tbody>
{attendance.length > 0 ? (
attendance.map((item, index) => (
<tr key={index} style={{ transition: "all 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
<td style={{ ...s.td, ...s.nameCell }}>{item.name}</td>
<td style={s.td}>
{new Date(item.date).toLocaleDateString('en-US', { 
month: 'short', 
day: 'numeric', 
year: 'numeric' 
})}
</td>
<td style={s.td}>
<span style={s.badge(item.status)}>
<div style={{ width: "6px", height: "6px", borderRadius: "50%", background: item.status === "Present" ? "#15803d" : "#a16207" }}></div>
{item.status}
</span>
</td>
<td style={{ ...s.td, ...s.timeText }}>{item.check_in || "—"}</td>
<td style={{ ...s.td, ...s.timeText }}>{item.check_out || "—"}</td>
</tr>
))
) : (
<tr>
<td colSpan="5" style={{ ...s.td, textAlign: "center", padding: "60px", color: "#94a3b8" }}>
No attendance records found for this department.
</td>
</tr>
)}
</tbody>
</table>
</div>
)}
</div>
</div>
</main>
</div>
);
};

export default AdminAttendancePage;
