
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function DepartmentsPage() {
const [departments, setDepartments] = useState([]);
const [loading, setLoading] = useState(true);
const [modalOpen, setModalOpen] = useState(false);
const [editItem, setEditItem] = useState(null);
const [formName, setFormName] = useState("");
const [formError, setFormError] = useState("");
const [submitting, setSubmitting] = useState(false);
const [deleteConfirm, setDeleteConfirm] = useState(null);
const [toast, setToast] = useState(null);
const [search, setSearch] = useState("");

const token = localStorage.getItem("token");
const headers = { "x-auth-token": token };

const showToast = (message, type = "success") => {
setToast({ message, type });
setTimeout(() => setToast(null), 3000);
};

const fetchDepartments = async () => {
try {
setLoading(true);
const res = await axios.get(`${API}/api/departments`, { headers });
setDepartments(res.data.data || []);
} catch {
showToast("Failed to load departments", "error");
} finally {
setLoading(false);
}
};

useEffect(() => { fetchDepartments(); }, []);

const openAdd = () => { setEditItem(null); setFormName(""); setFormError(""); setModalOpen(true); };
const openEdit = (dept) => { setEditItem(dept); setFormName(dept.department_name); setFormError(""); setModalOpen(true); };
const closeModal = () => { setModalOpen(false); setEditItem(null); setFormName(""); setFormError(""); };

const handleSubmit = async (e) => {
e.preventDefault();
if (!formName.trim()) { setFormError("Department name is required"); return; }
setSubmitting(true); setFormError("");
try {
if (editItem) {
await axios.put(`${API}/api/departments/${editItem.department_id}`, { department_name: formName }, { headers });
showToast("Department updated successfully");
} else {
await axios.post(`${API}/api/departments`, { department_name: formName }, { headers });
showToast("Department created successfully");
}
closeModal(); fetchDepartments();
} catch (err) {
setFormError(err.response?.data?.message || "Something went wrong");
} finally { setSubmitting(false); }
};

const handleDelete = async (id) => {
try {
await axios.delete(`${API}/api/departments/${id}`, { headers });
showToast("Department deleted successfully");
setDeleteConfirm(null); fetchDepartments();
} catch (err) {
showToast(err.response?.data?.message || "Delete failed", "error");
setDeleteConfirm(null);
}
};

const filtered = departments.filter((d) =>
d.department_name.toLowerCase().includes(search.toLowerCase())
);

const palette = [
{ bg: "#eef2ff", color: "#6366f1" },
{ bg: "#ecfdf5", color: "#10b981" },
{ bg: "#fffbeb", color: "#f59e0b" },
{ bg: "#fdf4ff", color: "#d946ef" },
{ bg: "#eff6ff", color: "#3b82f6" },
{ bg: "#fef2f2", color: "#ef4444" },
];

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1100px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" },
header: { padding: "40px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
title: { fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.8px" },
toolbar: { padding: "20px 40px", background: "#fafbfc", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" },
searchField: { padding: "12px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", width: "320px", outline: "none", fontSize: "14px", transition: "all 0.2s" },
btnPrimary: { padding: "12px 24px", background: "#6366f1", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" },
table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
th: { padding: "16px 40px", background: "#f8fafc", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #f1f5f9" },
td: { padding: "20px 40px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
avatar: (idx) => ({
width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
fontWeight: "700", fontSize: "15px",
backgroundColor: palette[idx % palette.length].bg,
color: palette[idx % palette.length].color
}),
modalOverlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
modalContent: { background: "#fff", width: "450px", borderRadius: "24px", padding: "32px", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.header}>
<div>
<h1 style={s.title}>Departments</h1>
<p style={{ color: "#64748b", marginTop: "4px", fontSize: "15px" }}>Manage and structure company departments and workflows.</p>
</div>
<button style={s.btnPrimary} onClick={openAdd}>
<span style={{ fontSize: "20px", lineHeight: "1" }}>+</span> Add Department
</button>
</header>

<div style={s.toolbar}>
<input
type="text"
placeholder="Search departments..."
style={s.searchField}
value={search}
onChange={(e) => setSearch(e.target.value)}
onFocus={(e) => e.target.style.borderColor = "#6366f1"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
<div style={{ color: "#94a3b8", fontSize: "13px", fontWeight: "600" }}>{filtered.length} Units Found</div>
</div>

<div style={{ overflowX: "auto" }}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Department Entity</th>
<th style={s.th}>Status</th>
<th style={{ ...s.th, textAlign: "right" }}>Operational Actions</th>
</tr>
</thead>
<tbody>
{loading ? (
<tr><td colSpan="3" style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>Syncing organization data...</td></tr>
) : filtered.length > 0 ? (
filtered.map((dept, idx) => (
<tr key={dept.department_id} style={{ transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
<td style={s.td}>
<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
<div style={s.avatar(idx)}>{dept.department_name.charAt(0)}</div>
<div>
<div style={{ fontWeight: "700", color: "#1e293b", fontSize: "16px" }}>{dept.department_name}</div>
<div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "500" }}>ID: DEPT_{dept.department_id}</div>
</div>
</div>
</td>
<td style={s.td}>
<span style={{ padding: "4px 10px", borderRadius: "20px", background: "#ecfdf5", color: "#10b981", fontSize: "12px", fontWeight: "700" }}>Active Unit</span>
</td>
<td style={{ ...s.td, textAlign: "right" }}>
<button onClick={() => openEdit(dept)} style={{ background: "none", border: "none", color: "#6366f1", fontWeight: "700", cursor: "pointer", marginRight: "20px", fontSize: "13px" }}>Modify</button>
<button onClick={() => setDeleteConfirm(dept)} style={{ background: "none", border: "none", color: "#ef4444", fontWeight: "700", cursor: "pointer", fontSize: "13px" }}>Terminate</button>
</td>
</tr>
))
) : (
<tr><td colSpan="3" style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>No departments match your search criteria.</td></tr>
)}
</tbody>
</table>
</div>
</div>
</main>

{modalOpen && (
<div style={s.modalOverlay}>
<div style={s.modalContent}>
<h3 style={{ fontFamily: "Bricolage Grotesque", fontSize: "24px", fontWeight: "800", marginBottom: "8px" }}>{editItem ? "Modify Unit" : "New Department"}</h3>
<p style={{ color: "#64748b", fontSize: "14px", marginBottom: "24px" }}>Enter the official name for this organizational branch.</p>
<form onSubmit={handleSubmit}>
<div style={{ marginBottom: "24px" }}>
<label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#94a3b8", marginBottom: "8px", textTransform: "uppercase" }}>Department Name</label>
<input
style={{ ...s.searchField, width: "100%", padding: "14px" }}
value={formName}
onChange={(e) => setFormName(e.target.value)}
placeholder="e.g. Talent Acquisition"
autoFocus
/>
{formError && <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "8px", fontWeight: "600" }}>{formError}</p>}
</div>
<div style={{ display: "flex", gap: "12px" }}>
<button type="button" onClick={closeModal} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }}>Discard</button>
<button type="submit" disabled={submitting} style={{ ...s.btnPrimary, flex: 2, justifyContent: "center" }}>{submitting ? "Processing..." : (editItem ? "Update Entity" : "Create Unit")}</button>
</div>
</form>
</div>
</div>
)}

{deleteConfirm && (
<div style={s.modalOverlay}>
<div style={{ ...s.modalContent, textAlign: "center" }}>
<div style={{ width: "60px", height: "60px", background: "#fef2f2", color: "#ef4444", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: "24px" }}>!</div>
<h3 style={{ fontFamily: "Bricolage Grotesque", fontSize: "22px", fontWeight: "800" }}>Terminate Unit?</h3>
<p style={{ color: "#64748b", fontSize: "14px", margin: "8px 0 24px" }}>Are you sure you want to delete <strong>{deleteConfirm.department_name}</strong>? This action is irreversible.</p>
<div style={{ display: "flex", gap: "12px" }}>
<button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #e2e8f0", background: "#fff", fontWeight: "700", cursor: "pointer" }}>Keep Unit</button>
<button onClick={() => handleDelete(deleteConfirm.department_id)} style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "#ef4444", color: "#fff", fontWeight: "700", cursor: "pointer" }}>Confirm Delete</button>
</div>
</div>
</div>
)}

{toast && (
<div style={{ position: "fixed", bottom: "40px", right: "40px", background: toast.type === "error" ? "#ef4444" : "#1e293b", color: "#fff", padding: "16px 24px", borderRadius: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", zIndex: 2000 }}>
{toast.message}
</div>
)}
</div>
);
}
