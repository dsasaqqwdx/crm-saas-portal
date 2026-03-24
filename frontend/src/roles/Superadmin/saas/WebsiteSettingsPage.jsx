import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import axios from "axios";
import { Layout, Type, Phone, Tag, Star, ChevronRight, Save, CheckCircle, AlertCircle, Upload } from "lucide-react";const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const DEFAULTS = {
header: {
appName: "Shnoor International LLC SAAS",
title: "Next Generation HR Management For Your Company",
subtitle: "Grow Your Business With SHNOOR INTERNATIONAL LLC",
description: "Best-rated HR management application for small to large scale business.",
btn1Text: "Get Started", btn1Url: "/register",
btn2Text: "View Features", btn2Url: "/features",
showBtn1: "true", showBtn2: "true",
},
footer: {
companyName: "Shnoor International LLC",
tagline: "Next-gen HR management for modern businesses.",
email: "support@shnoor.com", phone: "+91 98765 43210",
address: "Business Bay, Dubai / Kuppam, India",
copyright: "2025 Shnoor International LLC. All rights reserved.",
logo: "",
},
contact: {
title: "Get in Touch",
subtitle: "Have questions about our HR modules? Our team is ready to help.",
email: "support@shnoor.com", phone: "+91 98765 43210",
address: "Business Bay, Dubai / Kuppam, India",
},
pricing: {
title: "Simple, Scalable Pricing",
subtitle: "Choose the plan that fits your company's growth.",
plan1Name: "Basic", plan1Price: "10",
plan2Name: "Pro", plan2Price: "25",
plan3Name: "Enterprise", plan3Price: "50",
},
features: {
title: "Platform Capabilities",
subtitle: "Everything you need to manage a modern workforce efficiently.",
},
};
const navItems = [
{ key: "header", label: "Header Settings", icon: <Layout size={15} /> },
{ key: "footer", label: "Footer Settings", icon: <Type size={15} /> },
{ key: "contact", label: "Contact Settings", icon: <Phone size={15} /> },
{ key: "pricing", label: "Price Settings", icon: <Tag size={15} /> },
{ key: "features", label: "Features Settings", icon: <Star size={15} /> },
];
const inputCls = {
display: "block", width: "100%", padding: "9px 12px",
border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 13,
outline: "none", background: "#fff", color: "#1e293b", transition: "border 0.15s",
};const labelCls = {
fontSize: 11, fontWeight: 700, color: "#64748b",
textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5, display: "block",
};
const sectionDivider = {
fontSize: 11, fontWeight: 700, color: "#4f46e5", textTransform: "uppercase",
letterSpacing: "0.08em", borderBottom: "1px solid #e0e7ff", paddingBottom: 6, marginBottom: 16, marginTop: 8,
};function Field({ label, name, value, onChange, type = "text", rows }) {
return (
<div style={{ marginBottom: 20 }}>
<label style={labelCls}>{label}</label>
{rows ? (
<textarea name={name} value={value || ""} onChange={onChange} rows={rows}
style={{ ...inputCls, resize: "vertical", lineHeight: 1.6 }}
onFocus={e => e.target.style.border = "1px solid #4f46e5"}
onBlur={e => e.target.style.border = "1px solid #e2e8f0"} />
) : (
<input type={type} name={name} value={value || ""} onChange={onChange} style={inputCls}
onFocus={e => e.target.style.border = "1px solid #4f46e5"}
onBlur={e => e.target.style.border = "1px solid #e2e8f0"} />
)}
</div>
);
}

function Toggle({ label, name, value, onChange }) {
const isOn = value === "true" || value === true;
return (
<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
<span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{label}</span>
<div onClick={() => onChange({ target: { name, value: isOn ? "false" : "true" } })}
style={{ width: 44, height: 24, borderRadius: 12, cursor: "pointer", background: isOn ? "#4f46e5" : "#cbd5e1", position: "relative", transition: "background 0.2s" }}>
<div style={{ position: "absolute", top: 3, left: isOn ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
</div>
</div>
);
}
function LogoUpload({ currentLogo, onChange }) {
const handleFile = (e) => {
const file = e.target.files[0];
if (!file) return;
if (file.size > 2 * 1024 * 1024) { alert("Logo must be under 2MB"); return; }
const reader = new FileReader();
reader.onload = () => onChange({ target: { name: "logo", value: reader.result } });
reader.readAsDataURL(file);
};
return (
<div style={{ marginBottom: 20 }}>
<label style={labelCls}>Logo Image</label>
<div style={{ display: "flex", alignItems: "center", gap: 20 }}>
<div style={{ position: "relative" }}>
{currentLogo ? (
<img src={currentLogo} alt="logo" style={{ width: 70, height: 70, objectFit: "cover", borderRadius: "50%", border: "3px solid #e0e7ff" }} />
) : (
<div style={{ width: 70, height: 70, borderRadius: "50%", background: "#f1f5f9", border: "3px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Upload size={20} color="#94a3b8" />
</div>
)}
{currentLogo && (
<div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, background: "#4f46e5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
<Upload size={10} color="#fff" />
</div>
)}
</div>
<div>
<label style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer", fontSize: 13, color: "#374151", fontWeight: 500 }}
onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}>
<Upload size={14} color="#4f46e5" />
{currentLogo ? "Change Logo" : "Upload Logo"}
<input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
</label>
<p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5, marginBottom: 0 }}>PNG, JPG or SVG</p>
</div>
</div>
</div>
);
}
function HeaderForm({ data, onChange }) {
return (
<>
<div style={sectionDivider}>Basic Settings</div>
<Field label="App Name"    name="appName" value={data.appName} onChange={onChange} />
<div style={sectionDivider}>Header Settings</div>
<Field   label="Header Title"   name="title" value={data.title}     onChange={onChange} />
<Field label="Header Sub Title" name="subtitle"    value={data.subtitle} onChange={onChange} />
<Field   label="Header Description"    name="description" value={data.description} onChange={onChange} rows={4} />
<div style={sectionDivider}>Header Buttons</div>
<Toggle label="Get Started button" name="showBtn1" value={data.showBtn1} onChange={onChange} /> 
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field    label="Button 1 Text" name="btn1Text" value={data.btn1Text} onChange={onChange} />
<Field label="Button 1 URL" name="btn1Url" value={data.btn1Url} onChange={onChange} />
</div>
<Toggle   label="View Features button" name="showBtn2" value={data.showBtn2} onChange={onChange} />
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Button 2 Text"     name="btn2Text" value={data.btn2Text} onChange={onChange} />
<Field     label="Button 2 URL" name="btn2Url" value={data.btn2Url} onChange={onChange} />
</div>
</>
);
}
function FooterForm({ data, onChange }) {
return (
<>
<LogoUpload currentLogo={data.logo || ""} onChange={onChange} />
<div style={sectionDivider}>Footer Details</div>
<Field label="Company Name"    name="companyName" value={data.companyName} onChange={onChange} />
<Field label="Tagline" name="tagline" value={data.tagline} onChange={onChange} />
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Email"   name="email" value={data.email} onChange={onChange} />
<Field label="Phone" name="phone"    value={data.phone} onCh  ange={onChange} />
</div>
<Field label="Address"   name="address" value={data.address} onChange={onChange} />
<Field label="Copyright" name="copyright"  value={data.copyright} onChange={onChange} />
</>
);
}function ContactForm({ data, onChange }) {
return (
<>
<Field          label="Page Title"     name="title" v alue={data.title} onChange={onChange} />
<Field          label="Subtitle"  name="subtitle" valu e={data.subtitle} onChange={onChange} rows={2} />
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Email" name="email"   value={data.email} onChange={onChange} />
<Field label="Phone"  name="phone" value={data.phone} onChange={onChange} />
</div>
<Field label="Address" name="address" value={data.address} onChange={onChange} />
</>
);
}

function PricingForm({ data, onChange }) {
return (
<>
<Field        label="Page Title" name="title"  value={data.title} onChange={onChange} />
<Field label="Subtitle"     name="subtitle" value={data.subtitle} onChange={onChange} />
<div style={sectionDivider}>Plan 1 - Basic</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Plan Name"     name="plan1Name" value={data.plan1Name} onChange={onChange} />
<Field        label="Price ($/mo)" name="plan1Price" value={data.plan1Price} onChange={onChange} type="number" />
</div>
<div style={sectionDivider}>Plan 2 - Pro</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Plan Name"    name="plan2Name" value={data.plan2Name} onChange={onChange} />
<Field        label="Price ($/mo)" name="plan2Price" value={data.plan2Price} onChange={onChange} type="number" />
</div>
<div style={sectionDivider}>Plan 3 - Enterprise</div>
<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
<Field label="Plan Name"  name="plan3Name" value={data.plan3Name} onChange={onChange} />
<Field label="Price ($/mo)" name="plan3Price" value={data.plan3Price}     onChange={onChange} type="number" />  
</div>
</>
);
}

function FeaturesForm({ data, onChange }) {
return (
<>
<Field      label="Page Title" name="title" value={data.title} onChange={onChange} />
<Field label="Subtitle" name="subtitle" value={data.subtitle} onC hange={onChange} />
</>
);
}
                          const FORMS = { header: HeaderForm, footer: FooterForm, contact: ContactForm, pricing: PricingForm, features: FeaturesForm };
export default function WebsiteSettingsPage() {
const [activeSection, setActiveSection] = useState("header");
const [allData, setAllData] = useState({});
const [saving, setSaving] = useState(false);
const [toast, setToast] = useState(null);
const token = localStorage.getItem("token");
const headers = { "x-auth-token": token };
useEffect(() => {
const load = async () => {
try {
const res = await axios.get(`${API}/api/website-settings`, { headers });
if (res.data.success) {
const fetched = res.data.data || {};
const merged = {};
for (const section of Object.keys(DEFAULTS)) {
merged[section] = { ...DEFAULTS[section], ...(fetched[section] || {}) };
}
setAllData(merged);
}
} catch (err) {
console.error(err);
setAllData(DEFAULTS);
}
};
load();
}, []);
const handleChange = (e) => {
const { name, value } = e.target;
setAllData(prev => ({ ...prev, [activeSection]: { ...(prev[activeSection] || {}), [name]: value } }));
};

const handleSave = async () => {
setSaving(true);
try {
await axios.put(`${API}/api/website-settings/${activeSection}`, allData[activeSection] || {}, { headers });
showToast("Settings saved successfully!", "success");
} catch (err) {
console.error(err);
showToast("Failed to save settings", "error");
} finally {
setSaving(false);
}
};
const showToast = (message, type) => {
setToast({ message, type });
setTimeout(() => setToast(null), 3000);
};
const ActiveForm = FORMS[activeSection];
const sectionData = allData[activeSection] || DEFAULTS[activeSection] || {};
const activeNav = navItems.find(n => n.key === activeSection);
return (
<div className="d-flex bg-light min-vh-100">
<Sidebar />
<div style={{ marginLeft: 250, flex: 1, minHeight: "100vh", background: "#f8fafc" }}>
{toast && (
<div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 18px", borderRadius: 10, fontWeight: 500, fontSize: 13, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
{toast.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
{toast.message}
</div>
)}
<div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 28px", display: "flex", alignItems: "center", gap: 6 }}>
<span style={{ fontSize: 13, color: "#94a3b8" }}>Dashboard</span>
<ChevronRight size={13} color="#94a3b8" />
<span style={{ fontSize: 13, color: "#94a3b8" }}>Website Settings</span>
<ChevronRight size={13} color="#94a3b8" />
<span style={{ fontSize: 13, color: "#4f46e5", fontWeight: 600 }}>{activeNav?.label}</span>
</div>
<div style={{ display: "flex", minHeight: "calc(100vh - 53px)" }}>
<div style={{ width: 220, background: "#fff", borderRight: "1px solid #e2e8f0", padding: "16px 0", flexShrink: 0 }}>
{navItems.map(item => {
const active = item.key === activeSection;
return (
<button key={item.key} onClick={() => setActiveSection(item.key)}
style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 18px", background: active ? "#ede9fe" : "transparent", border: "none", borderLeft: active ? "3px solid #4f46e5" : "3px solid transparent", color: active ? "#4f46e5" : "#64748b", fontWeight: active ? 600 : 400, fontSize: 13, cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#f8fafc"; }}
onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
{item.icon}{item.label}
</button>
);
})}
</div>
<div style={{ flex: 1, padding: 28, overflowY: "auto" }}>
<div style={{ maxWidth: 720 }}>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
<div>
<h4 style={{ fontWeight: 700, color: "#1e293b", margin: 0 }}>{activeNav?.label}</h4>
<p style={{ color: "#94a3b8", fontSize: 13, margin: "4px 0 0" }}></p>
</div>
<button onClick={handleSave} disabled={saving}
style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", background: saving ? "#a5b4fc" : "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: saving ? "default" : "pointer", transition: "background 0.15s" }}>
<Save size={14} />{saving ? "Saving..." : "Save Changes"}
</button>
</div>
<div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "24px 28px" }}>
{ActiveForm && <ActiveForm data={sectionData} onChange={handleChange} />}
</div>
</div>
</div>
</div>
</div>
</div>
);
}