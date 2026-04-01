
import React, { useState, useEffect } from "react";
import { Heart, Award, Clock, Eye, X } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { useNotifications } from "../../../context/NotificationContext";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const typeConfig = {
general: { label:"General", color:"#f59e0b", bg:"#fffbeb" },
performance: { label:"Performance", color:"#6366f1", bg:"#f5f3ff" },
teamwork: { label:"Teamwork", color:"#10b981", bg:"#f0fdf4" },
innovation: { label:"Innovation", color:"#3b82f6", bg:"#eff6ff" },
leadership: { label:"Leadership", color:"#8b5cf6", bg:"#f5f3ff" },
customer_service: { label:"Customer Service", color:"#ec4899", bg:"#fdf2f8" },
};

const fallbackHTML = (item) => {
const c = typeConfig[item.appreciation_type] || typeConfig.general;
const date = item.sent_at || item.created_at;
const firstName = (item.employee_name || "Employee").split(" ")[0];
const today = date ? new Date(date).toLocaleDateString("en-IN", { day:"2-digit",month:"long",year:"numeric" }) : new Date().toLocaleDateString("en-IN", { day:"2-digit",month:"long",year:"numeric" });
return `<div style="font-family:'DM Sans',Arial,sans-serif;color:#1e293b;font-size:13.5px;line-height:1.85;">
<div style="background:${c.color};height:6px;border-radius:4px 4px 0 0;margin-bottom:24px;"></div>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
<div>
<div style="font-size:20px;font-weight:900;color:${c.color};">SHNOOR INTERNATIONAL LLC</div>
<div style="font-size:11px;color:#94a3b8;">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div>
</div>
<div style="text-align:right;font-size:12px;color:#64748b;">Date: ${today}</div>
</div>
<div style="border-top:1px solid #f1f5f9;padding-top:16px;margin-bottom:16px;">
<strong>To,</strong><br/>
<strong>${item.employee_name || "Employee"}</strong><br/>
${item.employee_email || ""}
</div>
<div style="font-weight:700;margin-bottom:12px;">Sub: Letter of Appreciation &mdash; ${item.title}</div>
<p>Dear <strong>${firstName}</strong>,</p>
<p>We are pleased to present you this <strong>Letter of Appreciation</strong> in recognition of your outstanding contribution and dedication to <strong>SHNOOR INTERNATIONAL LLC</strong>.</p>
<div style="background:${c.bg};border-left:4px solid ${c.color};border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;">
<div style="font-size:15px;font-weight:700;color:${c.color};margin-bottom:6px;">&#x1F3C6; ${item.title}</div>
<div style="color:#334155;font-size:13px;">Category: <strong>${c.label}</strong></div>
</div>
${item.message ? `<p>${item.message}</p>` : ""}
<p>Your efforts reflect the values and standards that make our organisation thrive. We are truly grateful to have you as a part of our team.</p>
<p>Keep up the exceptional work!</p>
<div style="margin-top:32px;padding-top:20px;border-top:1px solid #f1f5f9;">
<strong>Authorised Signatory</strong><br/>
<span style="color:#64748b;font-size:12px;">HR Department, SHNOOR INTERNATIONAL LLC</span>
</div>
</div>`;
};

const ViewModal = ({ item, onClose }) => {
if (!item) return null;
const c = typeConfig[item.appreciation_type] || typeConfig.general;
const date = item.sent_at || item.created_at;
const html = item.html_content || fallbackHTML(item);
return (
<div onClick={e => e.target === e.currentTarget && onClose()}
style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)",padding:"16px" }}>
<div onClick={e => e.stopPropagation()}
style={{ background:"#fff",borderRadius:"24px",width:"100%",maxWidth:"820px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 25px 50px rgba(0,0,0,0.25)",overflow:"hidden" }}>
<div style={{ padding:"20px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#fff" }}>
<div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
<div style={{ width:"40px",height:"40px",borderRadius:"10px",background:c.bg,display:"flex",alignItems:"center",justifyContent:"center" }}>
<Heart size={20} color={c.color}/>
</div>
<div>
<div style={{ fontSize:"16px",fontWeight:"800",color:"#0f172a" }}>{item.title}</div>
<div style={{ fontSize:"12px",color:"#64748b" }}>Received: {date ? new Date(date).toLocaleDateString("en-IN", { day:"2-digit",month:"long",year:"numeric" }) : "—"}</div>
</div>
</div>
<button onClick={onClose} style={{ background:"#f1f5f9",border:"none",borderRadius:"50%",width:"32px",height:"32px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
<X size={18} color="#64748b"/>
</button>
</div>

<div style={{ overflowY:"auto",padding:"32px",background:"#f8fafc" }}>
<div style={{ background:"#fff",padding:"40px",borderRadius:"16px",border:"1px solid #e2e8f0",boxShadow:"0 4px 6px rgba(0,0,0,0.04)" }}>
<div dangerouslySetInnerHTML={{ __html: html }}/>
</div>
</div>

<div style={{ padding:"16px 24px",borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"flex-end",gap:"12px",background:"#fff" }}>
<button onClick={() => window.print()} style={{ padding:"10px 20px",background:"#0f172a",color:"#fff",border:"none",borderRadius:"10px",fontWeight:"700",fontSize:"13px",cursor:"pointer" }}>Print / Download PDF</button>
<button onClick={onClose} style={{ padding:"10px 20px",background:"#f1f5f9",color:"#334155",border:"none",borderRadius:"10px",fontWeight:"600",fontSize:"13px",cursor:"pointer" }}>Close</button>
</div>
</div>
</div>
);
};

const EmployeeAppreciation = () => {
const [appreciations, setAppreciations] = useState([]);
const [loading, setLoading] = useState(true);
const [viewItem, setViewItem] = useState(null);
const [filter, setFilter] = useState("all");
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
const [readIds, setReadIds] = useState(() => JSON.parse(localStorage.getItem("readAppreciationIds") || "[]"));
const { markAppreciationRead } = useNotifications();
useEffect(() => {
const onResize = () => setIsMobile(window.innerWidth < 768);
window.addEventListener("resize", onResize);
const load = async () => {
try {
const token = localStorage.getItem("token");
const res = await axios.get(`${API}/api/appreciations/my`, { headers: { "x-auth-token": token } });
let list = [];
if (res.data?.data && Array.isArray(res.data.data)) list = res.data.data;
else if (Array.isArray(res.data)) list = res.data;
const formatted = list.map(item => ({
...item,
appreciation_type: item.appreciation_type || "general",
title: item.title || "Appreciation Letter",
message: item.message || "",
employee_name: item.employee_name || "Employee",
employee_email: item.employee_email || "",
html_content: item.html_content || null,
}));
setAppreciations(formatted);
} catch (err) { console.error("Failed to load appreciations:", err); }
finally { setLoading(false); }
};
load();
return () => window.removeEventListener("resize", onResize);
}, []);
const handleView = (item) => {
setViewItem(item);
const id = String(item.id || item.appreciation_id);
markAppreciationRead(id);
setReadIds(prev => prev.includes(id) ? prev : [...prev, id]);
};

const filtered = filter === "all" ? appreciations : appreciations.filter(a => a.appreciation_type === filter);

const s = {
th: { padding:"14px 24px",background:"#f8fafc",textAlign:"left",fontSize:"11px",fontWeight:"700",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.05em" },
td: { padding:"16px 24px",fontSize:"13px",color:"#334155",borderBottom:"1px solid #f1f5f9" },
badge: (color, bg) => ({ background:bg,color,fontSize:"11px",fontWeight:"700",padding:"4px 10px",borderRadius:"8px",display:"inline-block" }),
viewBtn: (isRead) => ({ background:"#fff",color:isRead?"#94a3b8":"#f59e0b",border:`1.5px solid ${isRead?"#e2e8f0":"#f59e0b"}`,borderRadius:"10px",padding:"8px 16px",fontSize:"12px",fontWeight:"700",cursor:"pointer",transition:"0.2s",display:"inline-flex",alignItems:"center",gap:"6px" }),
};

return (
<div className="d-flex bg-light min-vh-100" style={{ fontFamily:"'DM Sans',sans-serif" }}>
<Sidebar/>
<PageContent>
<div style={{ padding:isMobile?"20px":"32px",width:"100%" }}>
<header style={{ marginBottom:"28px" }}>
<h1 style={{ fontSize:"26px",fontWeight:"900",color:"#0f172a",margin:0,letterSpacing:"-0.02em" }}>My Appreciations</h1>
<p style={{ color:"#64748b",marginTop:"4px" }}>Recognition letters received from your organisation</p>
</header>

<div style={{ background:"#fff",borderRadius:"24px",border:"1px solid #e2e8f0",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
<div style={{ padding:"20px 24px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:"16px" }}>
<div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
<div style={{ width:"40px",height:"40px",background:"#fffbeb",borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center" }}>
<Heart size={20} color="#f59e0b"/>
</div>
<div>
<div style={{ fontWeight:"800",fontSize:"15px",color:"#0f172a" }}>Appreciations Inbox</div>
<div style={{ fontSize:"12px",color:"#94a3b8" }}>{appreciations.length} Recognition{appreciations.length !== 1 ? "s" : ""} Received</div>
</div>
</div>

<div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
{["all", ...Object.keys(typeConfig)].map(key => {
const c = key === "all" ? { label:"All",color:"#334155",bg:"#f1f5f9" } : typeConfig[key];
const active = filter === key;
return (
<button key={key} type="button" onClick={() => setFilter(key)}
style={{ border:active?`2px solid ${c.color}`:"1.5px solid #e2e8f0",borderRadius:"20px",padding:"6px 16px",cursor:"pointer",background:active?c.bg:"#fff",fontSize:"12px",fontWeight:"700",color:active?c.color:"#64748b",transition:"all 0.15s" }}>
{c.label}
</button>
);
})}
</div>
</div>

{loading ? (
<div style={{ padding:"80px 20px",textAlign:"center",color:"#94a3b8" }}>
<div className="spinner-border text-warning mb-3" style={{ width:"32px",height:"32px" }}></div>
<div style={{ fontWeight:"600" }}>Fetching your appreciations…</div>
</div>
) : filtered.length === 0 ? (
<div style={{ padding:"80px 20px",textAlign:"center" }}>
<div style={{ width:"64px",height:"64px",background:"#f8fafc",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:"#cbd5e1" }}>
<Heart size={32}/>
</div>
<div style={{ fontSize:"16px",fontWeight:"700",color:"#1e293b" }}>No appreciations yet</div>
<p style={{ color:"#94a3b8",fontSize:"14px",maxWidth:"300px",margin:"8px auto" }}>Your appreciation letters will appear here once they are sent by HR.</p>
</div>
) : (
<div style={{ overflowX:"auto" }}>
<table style={{ width:"100%",borderCollapse:"collapse" }}>
<thead>
<tr style={{ background:"#f8fafc" }}>
{["Appreciation","Type","Date Received",""].map(h => (<th key={h} style={s.th}>{h}</th>))}
</tr>
</thead>
<tbody>
{filtered.map((item, i) => {
const c = typeConfig[item.appreciation_type] || typeConfig.general;
const date = item.sent_at || item.created_at;
const id = String(item.id || item.appreciation_id);
const isRead = readIds.includes(id);
return (
<tr key={i} style={{ borderBottom:"1px solid #f1f5f9", background:isRead?"transparent":"#fffdf5" }}>
<td style={s.td}>
<div style={{ display:"flex",alignItems:"center",gap:"12px" }}>
<div style={{ width:"38px",height:"38px",borderRadius:"10px",background:c.bg,color:c.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
<Award size={18}/>
</div>
<div>
<div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
<div style={{ fontWeight:"700",fontSize:"14px",color:"#1e293b" }}>{item.title}</div>
{!isRead && <span style={{ background:"#f59e0b",color:"#fff",fontSize:"9px",fontWeight:"900",padding:"2px 7px",borderRadius:"20px",textTransform:"uppercase" }}>New</span>}
</div>
<div style={{ fontSize:"11px",color:"#94a3b8",marginTop:"2px" }}>SHNOOR INTERNATIONAL LLC</div>
</div>
</div>
</td>
<td style={s.td}><span style={s.badge(c.color,c.bg)}>{c.label}</span></td>
<td style={{ ...s.td,color:"#475569",fontWeight:"600" }}>
<div style={{ display:"flex",alignItems:"center",gap:"6px" }}>
<Clock size={13} color="#94a3b8"/>
{date ? new Date(date).toLocaleDateString("en-IN", { day:"2-digit",month:"short",year:"numeric" }) : "—"}
</div>
</td>
<td style={{ ...s.td,textAlign:"right" }}>
<button onClick={() => handleView(item)} style={s.viewBtn(isRead)}
onMouseOver={e => { e.currentTarget.style.background="#f59e0b"; e.currentTarget.style.color="#fff"; e.currentTarget.style.borderColor="#f59e0b"; }}
onMouseOut={e => { e.currentTarget.style.background="#fff"; e.currentTarget.style.color=isRead?"#94a3b8":"#f59e0b"; e.currentTarget.style.borderColor=isRead?"#e2e8f0":"#f59e0b"; }}>
<Eye size={12}/>View Letter
</button>
</td>
</tr>
);
})}
</tbody>
</table>
</div>
)}
</div>
</div>
</PageContent>
{viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)}/>}
</div>
);
};

export default EmployeeAppreciation;