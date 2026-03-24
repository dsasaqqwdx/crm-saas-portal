
// import React, { useEffect, useState } from "react";
// import Sidebar from "../layouts/Sidebar";
// import axios from "axios";

// const Designations = () => {
// const [designations, setDesignations] = useState([]);
// const [designationName, setDesignationName] = useState("");
// const [companyId, setCompanyId] = useState("");

// const fetchDesignations = async () => {
// try {
// const res = await axios.get("http://localhost:5001/api/designations");
// setDesignations(res.data);
// } catch (err) {
// console.error(err);
// }
// };

// useEffect(() => {
// fetchDesignations();
// }, []);

// const addDesignation = async () => {
// if (!designationName || !companyId) {
// return alert("Please enter both designation name and company ID");
// }

// try {
// await axios.post("http://localhost:5001/api/designations", {
// designation_name: designationName,
// company_id: parseInt(companyId),
// });

// setDesignationName("");
// setCompanyId("");
// fetchDesignations();
// } catch (err) {
// console.error(err);
// alert("Failed to add designation");
// }
// };

// const deleteDesignation = async (id) => {
// try {
// await axios.delete(`http://localhost:5001/api/designations/${id}`);
// fetchDesignations();
// } catch (err) {
// console.error(err);
// alert("Failed to delete designation");
// }
// };

// const s = {
// container: { marginLeft: "250px", padding: "40px 50px", backgroundColor: "#fcfdfe", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
// header: { marginBottom: "32px" },
// title: { fontSize: "26px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px" },
// actionCard: { background: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)", marginBottom: "30px", display: "flex", gap: "16px", alignItems: "center" },
// input: { flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", transition: "border 0.2s" },
// btnPrimary: { padding: "12px 24px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "600", cursor: "pointer", transition: "0.2s" },
// tableWrapper: { background: "#fff", borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.03)" },
// table: { width: "100%", borderCollapse: "collapse" },
// th: { padding: "16px 24px", background: "#f8fafc", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1px solid #f1f5f9" },
// td: { padding: "16px 24px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
// idBadge: { background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", color: "#475569", fontWeight: "600" },
// btnDelete: { padding: "6px 12px", background: "#fff5f5", color: "#e53e3e", border: "1px solid #fed7d7", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }
// };

// return (
// <div className="d-flex bg-light min-vh-100">
// <Sidebar />
// <div style={s.container}>
// <div style={s.header}>
// <h2 style={s.title}>Designation Management</h2>
// <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>Configure and organize corporate roles and hierarchies.</p>
// </div>

// <div style={s.actionCard}>
// <input
// type="text"
// style={s.input}
// placeholder="Designation Title (e.g. Senior Developer)"
// value={designationName}
// onChange={(e) => setDesignationName(e.target.value)}
// />
// <input
// type="number"
// style={{ ...s.input, maxWidth: "180px" }}
// placeholder="Company ID"
// value={companyId}
// onChange={(e) => setCompanyId(e.target.value)}
// />
// <button style={s.btnPrimary} onClick={addDesignation}>
// Add Role
// </button>
// </div>

// <div style={s.tableWrapper}>
// <table style={s.table}>
// <thead>
// <tr>
// <th style={s.th}>ID</th>
// <th style={s.th}>Designation Name</th>
// <th style={s.th}>Company Mapping</th>
// <th style={s.th}>Operations</th>
// </tr>
// </thead>
// <tbody>
// {designations.length === 0 ? (
// <tr>
// <td colSpan="4" style={{ ...s.td, textAlign: "center", padding: "40px", color: "#94a3b8" }}>
// No active designations found in the directory.
// </td>
// </tr>
// ) : (
// designations.map((d) => (
// <tr key={d.designation_id}>
// <td style={s.td}><span style={s.idBadge}>#{d.designation_id}</span></td>
// <td style={{ ...s.td, fontWeight: "600", color: "#1e293b" }}>{d.designation_name}</td>
// <td style={s.td}>
// <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
// <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></div>
// Entity ID: {d.company_id}
// </div>
// </td>
// <td style={s.td}>
// <button
// style={s.btnDelete}
// onClick={() => deleteDesignation(d.designation_id)}
// >
// Remove
// </button>
// </td>
// </tr>
// ))
// )}
// </tbody>
// </table>
// </div>
// </div>
// </div>
// );
// };

// export default Designations;

import React, { useEffect, useState } from "react";
import Sidebar from "../layouts/Sidebar";
import axios from "axios";

const Designations = () => {
const [designations, setDesignations] = useState([]);
const [designationName, setDesignationName] = useState("");
const [companyId, setCompanyId] = useState("");

const fetchDesignations = async () => {
try {
const res = await axios.get("http://localhost:5001/api/designations");
setDesignations(res.data);
} catch (err) {
console.error(err);
}
};

useEffect(() => {
fetchDesignations();
}, []);

const addDesignation = async () => {
if (!designationName || !companyId) {
return alert("Please enter both designation name and company ID");
}

try {
await axios.post("http://localhost:5001/api/designations", {
designation_name: designationName,
company_id: parseInt(companyId),
});

setDesignationName("");
setCompanyId("");
fetchDesignations();
} catch (err) {
console.error(err);
alert("Failed to add designation");
}
};

const deleteDesignation = async (id) => {
try {
await axios.delete(`http://localhost:5001/api/designations/${id}`);
fetchDesignations();
} catch (err) {
console.error(err);
alert("Failed to delete designation");
}
};

const s = {
wrapper: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1100px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden", display: "flex", flexDirection: "column" },
boxHeader: { padding: "40px", borderBottom: "1px solid #f1f5f9", background: "linear-gradient(to right, #ffffff, #fafbfc)" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
subtitle: { fontSize: "14px", color: "#64748b", marginTop: "4px" },
formSection: { padding: "30px 40px", background: "#ffffff", display: "flex", gap: "16px", alignItems: "center", borderBottom: "1px solid #f1f5f9" },
input: { padding: "14px 18px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "14px", flex: 1, outline: "none", backgroundColor: "#fff", transition: "all 0.2s", color: "#1e293b" },
btnPrimary: { padding: "14px 28px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", transition: "0.2s", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)" },
tableSection: { padding: "0" },
table: { width: "100%", borderCollapse: "separate", borderSpacing: "0" },
th: { padding: "16px 40px", background: "#f8fafc", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", borderBottom: "2px solid #f1f5f9" },
td: { padding: "20px 40px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
roleName: { fontWeight: "700", color: "#1e293b", fontSize: "15px" },
idTag: { fontSize: "12px", color: "#94a3b8", fontWeight: "600", fontFamily: "monospace", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" },
btnDelete: { padding: "8px 16px", background: "transparent", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer", transition: "0.2s" }
};

return (
<div style={s.wrapper}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<div style={s.boxHeader}>
<h2 style={s.title}>Designations</h2>
<p style={s.subtitle}>Configure organizational hierarchies and define system-level roles.</p>
</div>

<div style={s.formSection}>
<input
type="text"
style={s.input}
placeholder="Designation Title (e.g. Senior Software Engineer)"
value={designationName}
onChange={(e) => setDesignationName(e.target.value)}
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
<input
type="number"
style={{ ...s.input, maxWidth: "180px" }}
placeholder="Company ID"
value={companyId}
onChange={(e) => setCompanyId(e.target.value)}
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
<button 
style={s.btnPrimary} 
onClick={addDesignation}
onMouseOver={(e) => e.target.style.background = "#4338ca"}
onMouseOut={(e) => e.target.style.background = "#4f46e5"}
>
Register Role
</button>
</div>

<div style={s.tableSection}>
<table style={s.table}>
<thead>
<tr>
<th style={s.th}>Identity</th>
<th style={s.th}>Role Designation</th>
<th style={s.th}>Entity Mapping</th>
<th style={{ ...s.th, textAlign: "right" }}>Management</th>
</tr>
</thead>
<tbody>
{designations.length === 0 ? (
<tr>
<td colSpan="4" style={{ ...s.td, textAlign: "center", padding: "80px", color: "#94a3b8" }}>
The role directory is currently empty. No designations found.
</td>
</tr>
) : (
designations.map((d) => (
<tr key={d.designation_id} onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
<td style={s.td}><span style={s.idTag}>#{d.designation_id}</span></td>
<td style={{ ...s.td, ...s.roleName }}>{d.designation_name}</td>
<td style={s.td}>
<span style={{ padding: "6px 12px", borderRadius: "8px", background: "#eff6ff", color: "#3b82f6", fontSize: "12px", fontWeight: "700" }}>
ORG_UNIT_{d.company_id}
</span>
</td>
<td style={{ ...s.td, textAlign: "right" }}>
<button
style={s.btnDelete}
onClick={() => deleteDesignation(d.designation_id)}
onMouseOver={(e) => { e.target.style.background = "#fef2f2"; e.target.style.borderColor = "#fecaca" }}
onMouseOut={(e) => { e.target.style.background = "transparent"; e.target.style.borderColor = "#fee2e2" }}
>
Remove
</button>
</td>
</tr>
))
)}
</tbody>
</table>
</div>
</div>
</main>
</div>
);
};

export default Designations;
