import React, { useEffect, useState } from "react";
import API from "../../../api/api";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
const AdminAttendancePage = () => {
const [attendance, setAttendance] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [editRow, setEditRow] = useState(null);
const [editForm, setEditForm] = useState({ status: "", check_in: "", check_out: "" });
const [saving, setSaving] = useState(false);
const [toast, setToast] = useState(null);
useEffect(() => { fetchAttendance(); }, []);
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

const showToast = (msg, type = "success") => {
setToast({ msg, type });
setTimeout(() => setToast(null), 3000);
};

const openEdit = (item) => {
setEditRow(item);
setEditForm({ status: item.status || "Present", check_in: item.check_in || "", check_out: item.check_out || "" });
};

const closeEdit = () => setEditRow(null);

const handleEditChange = (e) => setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

const handleEditSave = async () => {
setSaving(true);
try {
const cleanDate = editRow.date ? editRow.date.substring(0, 10) : "";
console.log("Sending edit:", { employee_id: editRow.employee_id, attendance_date: cleanDate });
await API.put("/attendance/edit", {
employee_id: editRow.employee_id,
attendance_date: cleanDate,
status: editForm.status,
check_in: editForm.check_in || null,
check_out: editForm.check_out || null,
});
showToast("Attendance updated successfully");
closeEdit();
fetchAttendance();
} catch (err) {
showToast(err.response?.data?.message || "Update failed", "error");
} finally {
setSaving(false);
}
};

const getBadgeStyle = (status) => ({
padding: "6px 12px",
borderRadius: "8px",
fontSize: "12px",
fontWeight: "700",
backgroundColor: status === "Present" ? "#dcfce7" : status === "Absent" ? "#fee2e2" : status === "Late" ? "#fef9c3" : "#f3e8ff",
color: status === "Present" ? "#15803d" : status === "Absent" ? "#dc2626" : status === "Late" ? "#a16207" : "#7e22ce",
display: "inline-flex",
alignItems: "center",
gap: "6px",
});

const getDot = (status) => status === "Present" ? "#15803d" : status === "Absent" ? "#dc2626" : status === "Late" ? "#a16207" : "#7e22ce";

return (
<div className="d-flex bg-light min-vh-100">
<Sidebar />
<PageContent>
<div className="container-fluid px-3 px-md-4 py-4">

{toast && (
<div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", fontSize: 14 }}>
{toast.msg}
</div>
)}

<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mb-4 gap-3">
<div>
<h2 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>Attendance</h2>
<p className="text-muted small mb-0">Real-time monitoring of workplace presence and clock-in metrics.</p>
</div>
<div className="bg-white p-3 rounded-4 border shadow-sm text-center text-sm-end" style={{ minWidth: "140px" }}>
<span className="d-block fs-3 fw-bold" style={{ color: "#4f46e5", lineHeight: 1 }}>{attendance.length}</span>
<span className="text-uppercase fw-bold text-muted" style={{ fontSize: "10px", letterSpacing: "1px" }}>Total Entries</span>
</div>
</div>

<div className="bg-white rounded-4 border shadow-sm overflow-hidden" style={{ minHeight: "60vh" }}>
<div className="p-3 p-md-4">
{error && <div className="alert alert-danger border-0 rounded-3 mb-4" style={{ fontSize: "14px" }}>{error}</div>}
{loading ? (
<div className="text-center py-5">
<div className="spinner-border text-primary" role="status" style={{ width: "2.5rem", height: "2.5rem" }} />
<p className="mt-3 text-muted fw-medium">Fetching secure records...</p>
</div>
) : (
<div className="table-responsive">
<table className="table align-middle mb-0">
<thead className="bg-light">
<tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
<th className="px-4 py-3 border-0">Employee Name</th>
<th className="px-4 py-3 border-0">Calendar Date</th>
<th className="px-4 py-3 border-0">Status</th>
<th className="px-4 py-3 border-0">Entry Time</th>
<th className="px-4 py-3 border-0">Exit Time</th>
<th className="px-4 py-3 border-0">Actions</th>
</tr>
</thead>
<tbody>
{attendance.length > 0 ? attendance.map((item, index) => (
<tr key={index} className="hover-fade">
<td className="px-4 py-3 fw-bold" style={{ color: "#1e293b" }}>{item.name}</td>
<td className="px-4 py-3 text-muted" style={{ fontSize: "14px" }}>
{item.date ? new Date(item.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
</td>
<td className="px-4 py-3">
<span style={getBadgeStyle(item.status)}>
<div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getDot(item.status) }} />
{item.status}
</span>
</td>
<td className="px-4 py-3 text-muted font-monospace" style={{ fontSize: "14px" }}>{item.check_in || "—"}</td>
<td className="px-4 py-3 text-muted font-monospace" style={{ fontSize: "14px" }}>{item.check_out || "—"}</td>
<td className="px-4 py-3">
<button onClick={() => openEdit(item)} style={{ background: "#f1f5f9", color: "#4f46e5", fontWeight: 600, fontSize: 12, border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "5px 14px", cursor: "pointer" }}>Modify</button>
</td>
</tr>
)) : (
<tr><td colSpan="6" className="text-center py-5 text-muted">No attendance records found.</td></tr>
)}
</tbody>
</table>
</div>
)}
</div>
</div>
</div>
</PageContent>

{editRow && (
<div onClick={closeEdit} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
<div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: "30px 28px", width: "100%", maxWidth: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
<div className="d-flex justify-content-between align-items-start mb-1">
<div>
<h6 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: 16 }}>Modify Attendance</h6>
<small className="text-muted">{editRow.name}&nbsp;·&nbsp;{editRow.date}</small>
</div>
<button onClick={closeEdit} style={{ background: "none", border: "none", fontSize: 22, color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
</div>
<hr style={{ borderColor: "#f1f5f9", margin: "16px 0" }} />
<div className="mb-3">
<label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 6 }}>Status</label>
<select name="status" value={editForm.status} onChange={handleEditChange} style={{ width: "100%", borderRadius: 10, fontSize: 14, border: "1.5px solid #e2e8f0", padding: "9px 12px", outline: "none", color: "#1e293b" }}>
<option value="Present">Present</option>
<option value="Absent">Absent</option>
<option value="Late">Late</option>
<option value="Half Day">Half Day</option>
</select>
</div>

<div className="mb-3">
<label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 6 }}>Check In</label>
<input type="time" name="check_in" value={editForm.check_in} onChange={handleEditChange} style={{ width: "100%", borderRadius: 10, fontSize: 14, border: "1.5px solid #e2e8f0", padding: "9px 12px", outline: "none", color: "#1e293b" }} />
</div>

<div className="mb-4">
<label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", display: "block", marginBottom: 6 }}>Check Out</label>
<input type="time" name="check_out" value={editForm.check_out} onChange={handleEditChange} style={{ width: "100%", borderRadius: 10, fontSize: 14, border: "1.5px solid #e2e8f0", padding: "9px 12px", outline: "none", color: "#1e293b" }} />
</div>

<div style={{ display: "flex", gap: 10 }}>
<button onClick={closeEdit} style={{ flex: 1, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, fontWeight: 600, fontSize: 14, padding: "10px 0", cursor: "pointer", color: "#64748b" }}>Cancel</button>
<button onClick={handleEditSave} disabled={saving} style={{ flex: 1, background: saving ? "#a5b4fc" : "#4f46e5", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, padding: "10px 0", cursor: saving ? "not-allowed" : "pointer", color: "#fff" }}>
{saving ? "Saving..." : "Save Changes"}
</button>
</div>
</div>
</div>
)}

<style>{`.hover-fade:hover { background-color: #fcfdfe; transition: background 0.2s ease; }`}</style>
</div>
);
};

export default AdminAttendancePage;