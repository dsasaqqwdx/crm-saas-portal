// import React, { useState } from "react";
// import axios from "axios";
// import Sidebar from "../../../layouts/Sidebar";
// import { UserPlus, Mail, Phone, Calendar, Briefcase, Lock } from "lucide-react";

// function AddEmployee() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     phone: "",
//     department_id: "",
//     joining_date: new Date().toISOString().split("T")[0],
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       await axios.post(
//         "http://localhost:5001/api/employees/add",
//         formData,
//         {
//           headers: { "x-auth-token": token },
//         }
//       );
//       alert("Employee added successfully!");
      
//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         phone: "",
//         department_id: "",
//         joining_date: new Date().toISOString().split("T")[0],
//       });
//     } catch (error) {
//       console.error(error);
//       alert(error.response?.data?.error || "Failed to add employee. Please check all fields.");
//     }
//   };

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />

//       <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
//         <div className="container-fluid p-4">
//           <div className="mb-4">
//             <h3 className="fw-bold d-flex align-items-center text-dark">
//               <UserPlus className="me-2 text-primary" size={24} />
//               Employee Onboarding
//             </h3>
//             <p className="text-muted small">
//               Please fill out all fields. Fields marked with <span className="text-danger">*</span> are mandatory.
//             </p>
//           </div>

//           <div className="card shadow-sm border-0">
//             <div className="card-body p-4">
//               <form onSubmit={handleSubmit}>
//                 <div className="row">

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label fw-semibold small text-secondary">Full Name *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <UserPlus size={16} />
//                       </span>
//                       <input
//                         type="text"
//                         className="form-control border-start-0 ps-0"
//                         placeholder="Enter full name"
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label fw-semibold small text-secondary">Work Email *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <Mail size={16} />
//                       </span>
//                       <input
//                         type="email"
//                         className="form-control border-start-0 ps-0"
//                         placeholder="email@company.com"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label fw-semibold small text-secondary">Initial Password *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <Lock size={16} />
//                       </span>
//                       <input
//                         type="password"
//                         className="form-control border-start-0 ps-0"
//                         placeholder="Minimum 6 characters"
//                         value={formData.password}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                         required
//                         minLength="6"
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label fw-semibold small text-secondary">Phone Number *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <Phone size={16} />
//                       </span>
//                       <input
//                         type="tel"
//                         className="form-control border-start-0 ps-0"
//                         placeholder="Enter contact number"
//                         value={formData.phone}
//                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

//                   <div className="col-md-6 mb-3">
//                     <label className="form-label fw-semibold small text-secondary">Official Joining Date *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <Calendar size={16} />
//                       </span>
//                       <input
//                         type="date"
//                         className="form-control border-start-0 ps-0"
//                         value={formData.joining_date}
//                         onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
//                         required
//                       />
//                     </div>
//                   </div>

                 
//                   <div className="col-md-6 mb-4">
//                     <label className="form-label fw-semibold small text-secondary">Assigned Department *</label>
//                     <div className="input-group">
//                       <span className="input-group-text bg-white border-end-0 text-muted">
//                         <Briefcase size={16} />
//                       </span>
//                       <select
//                         className="form-select border-start-0 ps-0"
//                         required
//                         value={formData.department_id}
//                         onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
//                       >
//                         <option value="" disabled>Select from list</option>
//                         <option value="1">Engineering</option>
//                         <option value="2">Human Resources</option>
//                         <option value="3">Sales & Marketing</option>
//                         <option value="4">Operations</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="col-12 pt-3 border-top">
//                     <button type="submit" className="btn btn-primary px-5 py-2 fw-bold shadow-sm">
//                       Add Employee
//                     </button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddEmployee;


import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { UserPlus, Mail, Phone, Calendar, Briefcase, Lock, ShieldCheck, ArrowRight } from "lucide-react";

function AddEmployee() {
const [formData, setFormData] = useState({
name: "",
email: "",
password: "",
phone: "",
department_id: "",
joining_date: new Date().toISOString().split("T")[0],
});

const handleSubmit = async (e) => {
e.preventDefault();
const token = localStorage.getItem("token");

try {
await axios.post(
"http://localhost:5001/api/employees/add",
formData,
{
headers: { "x-auth-token": token },
}
);
alert("Employee added successfully!");

setFormData({
name: "",
email: "",
password: "",
phone: "",
department_id: "",
joining_date: new Date().toISOString().split("T")[0],
});
} catch (error) {
console.error(error);
alert(error.response?.data?.error || "Failed to add employee. Please check all fields.");
}
};

const s = {
root: { display: "flex", background: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
main: { marginLeft: "250px", flex: 1, padding: "30px", display: "flex", justifyContent: "center" },
fullBox: { width: "100%", maxWidth: "1000px", background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 40px rgba(0,0,0,0.03)", overflow: "hidden" },
boxHeader: { padding: "40px", borderBottom: "1px solid #f1f5f9", background: "linear-gradient(to right, #ffffff, #fafbfc)" },
title: { fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" },
subText: { color: "#64748b", fontSize: "14px", marginTop: "4px" },
formBody: { padding: "40px" },
label: { display: "block", fontSize: "13px", fontWeight: "700", color: "#475569", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
inputWrapper: { position: "relative", marginBottom: "24px" },
icon: { position: "absolute", left: "16px", top: "14px", color: "#94a3b8" },
input: { width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", outline: "none", transition: "all 0.2s", color: "#1e293b", backgroundColor: "#fff" },
select: { width: "100%", padding: "12px 16px 12px 48px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "15px", outline: "none", appearance: "none", backgroundColor: "#fff" },
footer: { padding: "30px 40px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end" },
submitBtn: { padding: "14px 40px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 12px rgba(79, 70, 229, 0.25)" }
};

return (
<div style={s.root}>
<Sidebar />
<main style={s.main}>
<div style={s.fullBox}>
<header style={s.boxHeader}>
<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
<div style={{ padding: "12px", background: "#eef2ff", color: "#4f46e5", borderRadius: "14px" }}>
<UserPlus size={28} />
</div>
<div>
<h2 style={s.title}>Employee Onboarding</h2>
<p style={s.subText}>Register new talent into the Shnoor International ecosystem.</p>
</div>
</div>
</header>

<form onSubmit={handleSubmit}>
<div style={s.formBody}>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 30px" }}>
<div>
<label style={s.label}>Full Name <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<UserPlus size={18} style={s.icon} />
<input
type="text"
style={s.input}
placeholder="John Doe"
value={formData.name}
onChange={(e) => setFormData({ ...formData, name: e.target.value })}
required
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
</div>
</div>

<div>
<label style={s.label}>Work Email <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<Mail size={18} style={s.icon} />
<input
type="email"
style={s.input}
placeholder="name@company.com"
value={formData.email}
onChange={(e) => setFormData({ ...formData, email: e.target.value })}
required
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
</div>
</div>

<div>
<label style={s.label}>Access Password <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<Lock size={18} style={s.icon} />
<input
type="password"
style={s.input}
placeholder="••••••••"
value={formData.password}
onChange={(e) => setFormData({ ...formData, password: e.target.value })}
required
minLength="6"
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
</div>
</div>

<div>
<label style={s.label}>Contact Number <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<Phone size={18} style={s.icon} />
<input
type="tel"
style={s.input}
placeholder="+1 (555) 000-0000"
value={formData.phone}
onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
required
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
</div>
</div>

<div>
<label style={s.label}>Joining Date <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<Calendar size={18} style={s.icon} />
<input
type="date"
style={s.input}
value={formData.joining_date}
onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
required
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
/>
</div>
</div>

<div>
<label style={s.label}>Department Assignment <span style={{ color: "#ef4444" }}>*</span></label>
<div style={s.inputWrapper}>
<Briefcase size={18} style={s.icon} />
<select
style={s.select}
value={formData.department_id}
onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
required
onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
>
<option value="" disabled>Select Department</option>
<option value="1">Engineering</option>
<option value="2">Human Resources</option>
<option value="3">Sales & Marketing</option>
<option value="4">Operations</option>
</select>
</div>
</div>
</div>

<div style={{ marginTop: "10px", padding: "20px", background: "#f0f9ff", borderRadius: "12px", border: "1px solid #e0f2fe", display: "flex", gap: "12px", alignItems: "center" }}>
<ShieldCheck size={20} color="#0369a1" />
<p style={{ margin: 0, fontSize: "13px", color: "#0369a1", fontWeight: "500" }}>
Credentials will be sent to the employee's work email once the profile is generated.
</p>
</div>
</div>

<footer style={s.footer}>
<button type="submit" style={s.submitBtn}>
Complete Onboarding <ArrowRight size={18} />
</button>
</footer>
</form>
</div>
</main>
</div>
);
}

export default AddEmployee;
