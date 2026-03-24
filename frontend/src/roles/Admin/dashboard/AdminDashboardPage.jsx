import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { 
Users, Building2, CheckCircle, CalendarRange, 
TrendingUp, ArrowUpRight, Clock, Bell, Mail, ShieldCheck 
} from "lucide-react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const Dashboard = () => {
const [statsData, setStatsData] = useState({
totalEmployees: 0,
presentToday: 0,
pendingLeaves: 0,
totalCompanies: 0,
});
const [employees, setEmployees] = useState([]);
const [loading, setLoading] = useState(true);
const [adminName, setAdminName] = useState("Admin");

useEffect(() => {
const fetchAll = async () => {
try {
const token = localStorage.getItem("token");
const headers = { "x-auth-token": token };

try {
const payload = JSON.parse(atob(token.split(".")[1]));
if (payload.name) setAdminName(payload.name.split(" ")[0]);
} catch {}

const [sumRes, empRes] = await Promise.all([
axios.get(`${API}/api/dashboard/summary`, { headers }),
axios.get(`${API}/api/employees`, { headers }),
]);
setStatsData(sumRes.data.data || {});
setEmployees(empRes.data.data || []);
} catch (err) {
console.error("Dashboard fetch error:", err);
} finally {
setLoading(false);
}
};
fetchAll();
}, []);

const getTimeGreeting = () => {
const hours = new Date().getHours();
if (hours < 12) return "Good Morning";
if (hours < 17) return "Good Afternoon";
return "Good Evening";
};

const stats = [
{ title: "Total Talent", value: statsData.totalEmployees, icon: Users, color: "#6366f1", bg: "#f5f3ff" },
{ title: "Active Today", value: statsData.presentToday, icon: CheckCircle, color: "#10b981", bg: "#f0fdf4" },
{ title: "Pending Requests", value: statsData.pendingLeaves, icon: CalendarRange, color: "#f59e0b", bg: "#fffbeb" },
{ title: "Partner Entities", value: statsData.totalCompanies, icon: Building2, color: "#3b82f6", bg: "#eff6ff" },
];

const styles = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px" },
contentBox: { background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(0,0,0,0.02)", overflow: "hidden", minHeight: "calc(100vh - 60px)" },
topSection: { padding: "40px 40px 20px", borderBottom: "1px solid #f1f5f9" },
greeting: { fontFamily: "'Syne', sans-serif", fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.8px" },
subText: { color: "#64748b", fontSize: "15px", marginTop: "6px" },
innerPadding: { padding: "30px 40px" },
grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" },
statCard: { background: "#fff", padding: "24px", borderRadius: "18px", border: "1px solid #f1f5f9", transition: "transform 0.2s" },
iconBox: (bg, color) => ({ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: bg, color: color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }),
directoryHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
tableWrapper: { borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" },
th: { padding: "16px 20px", background: "#f8fafc", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
td: { padding: "16px 20px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f8fafc" },
avatar: { width: "36px", height: "36px", borderRadius: "10px", background: "#6366f1", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", marginRight: "12px", fontWeight: "700", fontSize: "14px" }
};

return (
<div style={styles.root}>
<Sidebar />
<main style={styles.main}>
<div style={styles.contentBox}>
<header style={styles.topSection}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
<div>
<h1 style={styles.greeting}>{getTimeGreeting()}, {adminName}</h1>
<p style={styles.subText}>Operational summary for Shnoor International portal.</p>
</div>
<button style={{ padding: "12px 24px", borderRadius: "12px", background: "#0f172a", color: "#fff", fontSize: "14px", fontWeight: "600", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
<Bell size={18} />
System Alerts
</button>
</div>
</header>

<div style={styles.innerPadding}>
<div style={styles.grid}>
{stats.map((stat, i) => (
<div key={i} style={styles.statCard}>
<div style={styles.iconBox(stat.bg, stat.color)}>
<stat.icon size={20} />
</div>
<span style={{ fontSize: "14px", fontWeight: "600", color: "#94a3b8" }}>{stat.title}</span>
<div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "4px" }}>
<h3 style={{ fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 }}>{stat.value || 0}</h3>
<div style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "#10b981", fontWeight: "700", background: "#f0fdf4", padding: "2px 6px", borderRadius: "6px" }}>
<ArrowUpRight size={14} /> 8%
</div>
</div>
</div>
))}
</div>

<div style={styles.directoryHeader}>
<h3 style={{ fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0, fontFamily: "Syne" }}>Talent Directory</h3>
<div style={{ display: "flex", gap: "10px" }}>
<input type="text" placeholder="Search employees..." style={{ padding: "8px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px", outline: "none" }} />
</div>
</div>

<div style={styles.tableWrapper}>
<table style={{ width: "100%", borderCollapse: "collapse" }}>
<thead>
<tr>
<th style={styles.th}>Employee Identity</th>
<th style={styles.th}>Digital Contact</th>
<th style={styles.th}>Department</th>
<th style={styles.th}>Availability</th>
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan="4" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Synchronizing database...</td></tr>
) : employees.length > 0 ? (
employees.map((emp, i) => (
<tr key={i} style={{ transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
<td style={styles.td}>
<div style={{ display: "flex", alignItems: "center" }}>
<div style={styles.avatar}>{emp.name.charAt(0)}</div>
<span style={{ fontWeight: "700", color: "#1e293b" }}>{emp.name}</span>
</div>
</td>
<td style={styles.td}>{emp.email}</td>
<td style={styles.td}>
<span style={{ color: "#64748b", fontWeight: "500" }}>Operations</span>
</td>
<td style={styles.td}>
<div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981", fontWeight: "700", fontSize: "12px" }}>
<div style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }}></div>
On Duty
</div>
</td>
</tr>
))
) : (
<tr><td colSpan="4" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>No records found in the directory.</td></tr>
)}
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>
);
};

export default Dashboard;
