
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { LogIn, LogOut, MapPin, Clock, Coffee } from "lucide-react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";
const authHeaders = () => ({
  "x-auth-token": localStorage.getItem("token"),
});

const fmtTime = (t) => {
if (!t) return "—";
const [h, m] = t.split(":");
const hr = parseInt(h);
return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const fmtDuration = (mins) => {
if (!mins || mins <= 0) return null;
const h = Math.floor(mins / 60);
const m = mins % 60;
return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const totalWorked = (sessions) =>
(sessions || []).reduce((acc, s) => acc + (s.duration_mins || 0), 0);

const statusConfig = {
checked_in: { label: "Working", dot: "#22c55e" },
checked_out: { label: "On Break", dot: "#f59e0b" },
completed: { label: "Day Complete", dot: "#6366f1" },
not_marked: { label: "Not Started", dot: "#94a3b8" },
};

export default function MarkAttendance() {
const [now, setNow] = useState(new Date());
const [loading, setLoading] = useState(false);
const [fetching, setFetching] = useState(true);
const [sessions, setSessions] = useState([]);
const [hasOpenSession, setHasOpenSession] = useState(false);
const [marked, setMarked] = useState(false);
const [dayStatus, setDayStatus] = useState("not_marked");

useEffect(() => {
const t = setInterval(() => setNow(new Date()), 1000);
return () => clearInterval(t);
}, []);

useEffect(() => { fetchToday(); }, []);

const fetchToday = async () => {
setFetching(true);
try {
const res = await axios.get(`${API_BASE}/api/attendance/today`, { headers: authHeaders() });
const d = res.data;
if (d.marked) {
setMarked(true);
setSessions(d.sessions || []);
setHasOpenSession(d.hasOpenSession || false);
setDayStatus(d.hasOpenSession ? "checked_in" : "checked_out");
} else {
setMarked(false);
setSessions([]);
setHasOpenSession(false);
setDayStatus("not_marked");
}
} catch (err) {
console.error(err);
} finally {
setFetching(false);
}
};

const handleMark = async () => {
setLoading(true);
try {
const res = await axios.post(
`${API_BASE}/api/attendance/mark`,
{ status: "present" },
{ headers: authHeaders() }
);
if (res.data.success) {
await fetchToday();
}
} catch (error) {
alert(error.response?.data?.msg || "Something went wrong");
} finally {
setLoading(false);
}
};

const canCheckIn = !hasOpenSession;
const canCheckOut = hasOpenSession;
const workedMins = totalWorked(sessions);
const sc = statusConfig[dayStatus] || statusConfig.not_marked;

const fmtDate = (d) =>
d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

return (
<div className="d-flex bg-light min-vh-100">
<Sidebar />
<PageContent>
<div
className="container-fluid d-flex flex-column align-items-center py-5"
style={{ minHeight: "85vh", justifyContent: "center" }}
>
<div
className="bg-white rounded-4 shadow-sm border text-center w-100"
style={{ maxWidth: 480, padding: "36px 32px 28px" }}
>
<p style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#94a3b8", marginBottom: 4 }}>
Work Shift Clock
</p>
<h1
style={{ fontSize: "clamp(44px, 10vw, 64px)", fontWeight: 800, color: "#4f46e5", letterSpacing: "-3px", lineHeight: 1, margin: "0 0 4px" }}
>
{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
</h1>
<p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>{fmtDate(now)}</p>
<div style={{ marginBottom: 24 }}>
<span
style={{
display: "inline-flex",
alignItems: "center",
gap: 7,
background: "#f8fafc",
border: "1.5px solid #e2e8f0",
borderRadius: 20,
padding: "6px 16px",
fontSize: 12,
fontWeight: 700,
color: "#1e293b",
letterSpacing: 0.3,
}}
>
<span style={{ width: 8, height: 8, borderRadius: "50%", background: sc.dot, boxShadow: `0 0 0 3px ${sc.dot}33` }} />
{sc.label}
{workedMins > 0 && (
<span style={{ color: "#94a3b8", fontWeight: 500 }}>· {fmtDuration(workedMins)} worked</span>
)}
</span>
</div>
<div style={{ display: "flex", gap: 10 }}>
<ActionBtn
icon={<LogIn size={17} />}
label={loading && canCheckIn ? "Checking in…" : "Check In"}
color="#22c55e"
disabled={loading || !canCheckIn}
onClick={handleMark}
/>
<ActionBtn
icon={<LogOut size={17} />}
label={loading && canCheckOut ? "Checking out…" : "Check Out"}
color="#ef4444"
disabled={loading || !canCheckOut}
onClick={handleMark}
/>
</div>
<div style={{ marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#94a3b8", fontSize: 11 }}>
<span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
<MapPin size={12} />
Location Verified & Secure
</div>
</div>

{!fetching && marked && sessions.length > 0 && (
<div
className="bg-white rounded-4 shadow-sm border w-100 mt-3"
style={{ maxWidth: 480, padding: "22px 28px" }}
>
<p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#94a3b8", marginBottom: 16 }}>
Today's Breaks
</p>

<div style={{ position: "relative" }}>
<div style={{ position: "absolute", left: 13, top: 6, bottom: 6, width: 2, background: "#e2e8f0", borderRadius: 2 }} />

{sessions.map((s, i) => (
<div key={s.session_id} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: i < sessions.length - 1 ? 18 : 0 }}>
<div style={{
width: 28, height: 28, borderRadius: "50%",
background: s.check_out ? "#f0fdf4" : "#fef9c3",
border: `2px solid ${s.check_out ? "#22c55e" : "#f59e0b"}`,
display: "flex", alignItems: "center", justifyContent: "center",
flexShrink: 0, position: "relative", zIndex: 1,
}}>
{s.check_out
? <Coffee size={13} color="#22c55e" />
: <LogIn size={13} color="#f59e0b" />}
</div>
<div style={{ flex: 1, paddingBottom: 2 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
Break {i + 1}
</span>
{fmtDuration(s.duration_mins) && (
<span style={{ fontSize: 11, fontWeight: 600, color: "#22c55e", background: "#f0fdf4", padding: "2px 8px", borderRadius: 6 }}>
{fmtDuration(s.duration_mins)}
</span>
)}
</div>
<div style={{ display: "flex", gap: 16, marginTop: 4, fontSize: 12, color: "#64748b" }}>
<span>
<span style={{ fontWeight: 600, color: "#22c55e" }}>IN&nbsp;</span>
{fmtTime(s.check_in)}
</span>
<span>
<span style={{ fontWeight: 600, color: s.check_out ? "#ef4444" : "#94a3b8" }}>OUT&nbsp;</span>
{s.check_out ? fmtTime(s.check_out) : <em style={{ color: "#f59e0b" }}>Active</em>}
</span>
</div>
</div>
</div>
))}
</div>

{workedMins > 0 && (
<div style={{
marginTop: 18, paddingTop: 14,
borderTop: "1px solid #f1f5f9",
display: "flex", justifyContent: "space-between", alignItems: "center",
}}>
<span style={{ fontSize: 12, color: "#64748b", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
<Clock size={13} /> Total worked today
</span>
<span style={{ fontSize: 14, fontWeight: 800, color: "#4f46e5" }}>
{fmtDuration(workedMins)}
</span>
</div>
)}
</div>
)}

<p className="text-muted mt-3" style={{ fontSize: 12, textAlign: "center" }}>
<Clock size={13} className="me-1" />
Please ensure you are within the office perimeter to mark your presence.
</p>
</div>

<style>{`
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
`}</style>
</PageContent>
</div>
);
}

function ActionBtn({ icon, label, color, disabled, onClick }) {
return (
<button
onClick={onClick}
disabled={disabled}
style={{
flex: 1,
display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
background: disabled ? "#f1f5f9" : color,
color: disabled ? "#94a3b8" : "#fff",
border: "none",
borderRadius: 12,
padding: "13px 0",
fontWeight: 700,
fontSize: 14,
cursor: disabled ? "not-allowed" : "pointer",
transition: "all 0.15s ease",
boxShadow: disabled ? "none" : `0 4px 14px ${color}55`,
}}
onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = "translateY(-2px)"; }}
onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
>
{icon} {label}
</button>
);
}