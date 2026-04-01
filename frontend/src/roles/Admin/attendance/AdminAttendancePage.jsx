
import React, { useEffect, useState, useMemo, useRef } from "react";
import API from "../../../api/api";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { ChevronDown, ChevronRight, Download, Pencil } from "lucide-react";

const fmt = (dateStr) => dateStr ? new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

const fmtTime = (t) => {
if (!t) return "—";
const [h, m] = t.split(":");
const hr = parseInt(h);
return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const calcDuration = (ci, co) => {
if (!ci || !co) return null;
try {
const [ih, im] = ci.split(":").map(Number);
const [oh, om] = co.split(":").map(Number);
const mins = oh * 60 + om - (ih * 60 + im);
if (mins <= 0) return null;
const h = Math.floor(mins / 60), m = mins % 60;
return h > 0 ? `${h}h ${m}m` : `${m}m`;
} catch { return null; }
};

const totalWorked = (sessions) => {
if (!sessions?.length) return null;
const mins = sessions.reduce((acc, s) => {
if (!s.check_in || !s.check_out) return acc;
const [ih, im] = s.check_in.split(":").map(Number);
const [oh, om] = s.check_out.split(":").map(Number);
const d = oh * 60 + om - (ih * 60 + im);
return acc + (d > 0 ? d : 0);
}, 0);
if (!mins) return null;
const h = Math.floor(mins / 60), m = mins % 60;
return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const badgeStyle = (status) => ({
padding: "4px 11px", borderRadius: 8, fontSize: 11, fontWeight: 700,
display: "inline-flex", alignItems: "center", gap: 5,
backgroundColor: status === "Present" ? "#dcfce7" : status === "Absent" ? "#fee2e2" : status === "Late" ? "#fef9c3" : "#f3e8ff",
color: status === "Present" ? "#15803d" : status === "Absent" ? "#dc2626" : status === "Late" ? "#a16207" : "#7e22ce",
});

const dotColor = (status) => status === "Present" ? "#15803d" : status === "Absent" ? "#dc2626" : status === "Late" ? "#a16207" : "#7e22ce";

const downloadPDF = (employee, rows, dateFrom, dateTo) => {
const range = dateFrom && dateTo ? `${fmt(dateFrom)} – ${fmt(dateTo)}` : dateFrom ? `From ${fmt(dateFrom)}` : dateTo ? `Until ${fmt(dateTo)}` : "All dates";

const tableRows = rows.map((r) => {
const sessionRows = (r.sessions || []).map((s, i) => `
      <tr style="background:#fafbff">
        <td style="padding:6px 16px 6px 32px;color:#64748b;font-size:12px">↳ Session ${i + 1}</td>
        <td></td>
        <td style="font-size:12px;color:#475569;font-family:monospace">${fmtTime(s.check_in)}</td>
        <td style="font-size:12px;color:#475569;font-family:monospace">${fmtTime(s.check_out)}</td>
        <td style="font-size:12px;color:#22c55e;font-weight:600">${calcDuration(s.check_in, s.check_out) || "—"}</td>
      </tr>`).join("");

return `
      <tr>
        <td style="padding:10px 16px;font-weight:600">${fmt(r.date)}</td>
        <td><span class="badge badge-${(r.status || "").toLowerCase().replace(" ", "-")}">${r.status || "—"}</span></td>
        <td style="font-family:monospace;font-size:13px">${fmtTime(r.check_in)}</td>
        <td style="font-family:monospace;font-size:13px">${fmtTime(r.check_out)}</td>
        <td style="font-size:13px;color:#22c55e;font-weight:600">${totalWorked(r.sessions) || "—"}</td>
      </tr>
      ${sessionRows}`;
}).join("");

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Attendance – ${employee}</title>
<style>
body{font-family:system-ui,sans-serif;color:#1e293b;padding:36px}
h2{font-size:22px;font-weight:800;margin:0 0 4px}
.sub{color:#64748b;font-size:13px;margin-bottom:28px}
.stats{display:flex;gap:10px;margin-bottom:24px}
.stat{flex:1;border-radius:10px;padding:12px;text-align:center}
.stat.p{background:#dcfce7}.stat.a{background:#fee2e2}.stat.l{background:#fef9c3}.stat.h{background:#f3e8ff}
.stat .n{font-size:20px;font-weight:800}.stat.p .n{color:#15803d}.stat.a .n{color:#dc2626}.stat.l .n{color:#a16207}.stat.h .n{color:#7e22ce}
.stat .lb{font-size:10px;text-transform:uppercase;letter-spacing:.8px;color:#64748b;font-weight:700}
table{width:100%;border-collapse:collapse}
th{background:#f1f5f9;padding:9px 16px;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;text-align:left}
td{padding:9px 16px;border-bottom:1px solid #f1f5f9;font-size:13px}
.badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700}
.badge-present{background:#dcfce7;color:#15803d}.badge-absent{background:#fee2e2;color:#dc2626}
.badge-late{background:#fef9c3;color:#a16207}.badge-half-day{background:#f3e8ff;color:#7e22ce}
.footer{margin-top:28px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;display:flex;justify-content:space-between}
</style></head><body>
<h2>Attendance Report — ${employee}</h2>
<p class="sub">${range} &nbsp;·&nbsp; ${rows.length} days</p>
<div class="stats">
<div class="stat p"><div class="n">${rows.filter(r=>r.status==="Present").length}</div><div class="lb">Present</div></div>
<div class="stat a"><div class="n">${rows.filter(r=>r.status==="Absent").length}</div><div class="lb">Absent</div></div>
<div class="stat l"><div class="n">${rows.filter(r=>r.status==="Late").length}</div><div class="lb">Late</div></div>
<div class="stat h"><div class="n">${rows.filter(r=>r.status==="Half Day").length}</div><div class="lb">Half Day</div></div>
</div>
<table>
<thead><tr><th>Date</th><th>Status</th><th>First In</th><th>Last Out</th><th>Total Worked</th></tr></thead>
<tbody>${tableRows}</tbody>
</table>
<div class="footer">
<span>Generated ${new Date().toLocaleString("en-US",{dateStyle:"long",timeStyle:"short"})}</span>
<span>Confidential – HR Use Only</span>
</div>
</body></html>`;

const win = window.open("", "_blank");
win.document.write(html);
win.document.close();
setTimeout(() => win.print(), 600);
};

const AdminAttendancePage = () => {
const [attendance, setAttendance] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [search, setSearch] = useState("");
const [dateFrom, setDateFrom] = useState("");
const [dateTo, setDateTo] = useState("");
const [activeEmployee, setActiveEmployee] = useState(null);
const [showSuggestions, setShowSuggestions] = useState(false);
const searchRef = useRef(null);
const [expandedRows, setExpandedRows] = useState(new Set());
const [editDayRow, setEditDayRow] = useState(null);
const [editDayStatus, setEditDayStatus] = useState("Present");
const [editSessionRow, setEditSessionRow] = useState(null);
const [editSessionForm, setEditSessionForm] = useState({ check_in: "", check_out: "" });
const [saving, setSaving] = useState(false);
const [toast, setToast] = useState(null);

useEffect(() => {
fetchAttendance();
const handler = (e) => {
if (searchRef.current && !searchRef.current.contains(e.target))
setShowSuggestions(false);
};
document.addEventListener("mousedown", handler);
return () => document.removeEventListener("mousedown", handler);
}, []);

const fetchAttendance = async () => {
try {
const res = await API.get("/attendance/all");
setAttendance(res.data);
setError("");
} catch { setError("Failed to load attendance"); }
finally { setLoading(false); }
};

const showToast = (msg, type = "success") => {
setToast({ msg, type });
setTimeout(() => setToast(null), 3000);
};

const allNames = useMemo(() => [...new Set(attendance.map(a => a.name))].sort(), [attendance]);
const suggestions = useMemo(() => {
if (!search.trim()) return [];
const q = search.toLowerCase();
return allNames.filter(n => n.toLowerCase().includes(q)).slice(0, 6);
}, [search, allNames]);

const filtered = useMemo(() =>
attendance.filter(item => {
const nm = search ? item.name?.toLowerCase().includes(search.toLowerCase()) : true;
const fr = dateFrom ? item.date >= dateFrom : true;
const to = dateTo ? item.date <= dateTo : true;
return nm && fr && to;
}), [attendance, search, dateFrom, dateTo]);

const detailRows = useMemo(() =>
!activeEmployee ? [] :
attendance.filter(item => {
if (item.name !== activeEmployee) return false;
return (dateFrom ? item.date >= dateFrom : true) && (dateTo ? item.date <= dateTo : true);
}), [attendance, activeEmployee, dateFrom, dateTo]);

const toggleRow = (id) => setExpandedRows(prev => {
const next = new Set(prev);
next.has(id) ? next.delete(id) : next.add(id);
return next;
});

const handleDaySave = async () => {
setSaving(true);
try {
await API.put("/attendance/edit", {
employee_id: editDayRow.employee_id,
attendance_date: editDayRow.date,
status: editDayStatus,
});
showToast("Status updated");
setEditDayRow(null);
fetchAttendance();
} catch (err) {
showToast(err.response?.data?.message || "Update failed", "error");
} finally { setSaving(false); }
};

const handleSessionSave = async () => {
setSaving(true);
try {
await API.put("/attendance/session/edit", {
session_id: editSessionRow.session.session_id,
check_in: editSessionForm.check_in || null,
check_out: editSessionForm.check_out || null,
});
showToast("Session updated");
setEditSessionRow(null);
fetchAttendance();
} catch (err) {
showToast(err.response?.data?.message || "Update failed", "error");
} finally { setSaving(false); }
};

const hasFilters = search || dateFrom || dateTo;

const AttendanceRow = ({ item, showName = true }) => {
const expanded = expandedRows.has(item.attendance_id);
const hasSessions = item.sessions?.length > 0;

return (
<>
<tr className="hover-fade">
{showName && (
<td className="px-4 py-3">
<button
onClick={() => { setActiveEmployee(item.name); setSearch(item.name); }}
style={{ background:"none", border:"none", padding:0, fontWeight:700,
color: activeEmployee===item.name ? "#4f46e5":"#1e293b", cursor:"pointer", fontSize:14 }}
>{item.name}</button>
</td>
)}
<td className="px-4 py-3 text-muted" style={{fontSize:14}}>{fmt(item.date)}</td>
<td className="px-4 py-3">
<span style={badgeStyle(item.status)}>
<div style={{width:6,height:6,borderRadius:"50%",background:dotColor(item.status)}}/>
{item.status}
</span>
</td>
<td className="px-4 py-3 font-monospace" style={{fontSize:13,color:"#475569"}}>{fmtTime(item.check_in)}</td>
<td className="px-4 py-3 font-monospace" style={{fontSize:13,color:"#475569"}}>{fmtTime(item.check_out)}</td>
<td className="px-4 py-3" style={{fontSize:13,color:"#22c55e",fontWeight:600}}>{totalWorked(item.sessions)||"—"}</td>
<td className="px-4 py-3" style={{fontSize:12,color:"#94a3b8"}}>
{item.sessions?.length||0} session{item.sessions?.length!==1?"s":""}
</td>
<td className="px-4 py-3">
<div style={{display:"flex",gap:6,alignItems:"center"}}>
{hasSessions && (
<button onClick={()=>toggleRow(item.attendance_id)}
style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:7,padding:"4px 8px",cursor:"pointer",display:"flex",alignItems:"center",color:"#64748b"}}>
{expanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
</button>
)}
<button onClick={()=>{setEditDayRow(item);setEditDayStatus(item.status||"Present");}}
style={{background:"#f1f5f9",color:"#4f46e5",fontWeight:600,fontSize:12,border:"1.5px solid #e2e8f0",borderRadius:8,padding:"5px 12px",cursor:"pointer"}}>
Modify
</button>
</div>
</td>
</tr>

{expanded && hasSessions && item.sessions.map((s,i) => (
<tr key={s.session_id} style={{background:"#fafbff"}}>
{showName && <td/>}
<td className="py-2" style={{paddingLeft:36}}>
<span style={{fontSize:11,fontWeight:600,color:"#94a3b8",background:"#f1f5f9",padding:"2px 8px",borderRadius:5}}>
Breaks {i+1}
</span>
</td>
<td/>
<td className="px-4 py-2 font-monospace" style={{fontSize:12,color:"#22c55e"}}>{fmtTime(s.check_in)}</td>
<td className="px-4 py-2 font-monospace" style={{fontSize:12,color:s.check_out?"#ef4444":"#f59e0b"}}>
{s.check_out ? fmtTime(s.check_out) : <em style={{color:"#f59e0b",fontStyle:"normal",fontWeight:600}}>Active</em>}
</td>
<td className="px-4 py-2" style={{fontSize:12,color:"#22c55e",fontWeight:600}}>
{calcDuration(s.check_in,s.check_out)||"—"}
</td>
<td/>
<td className="px-4 py-2">
<button
onClick={()=>{
setEditSessionRow({session:s,parentItem:item});
setEditSessionForm({check_in:s.check_in?.slice(0,5)||"",check_out:s.check_out?.slice(0,5)||""});
}}
style={{background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:4,display:"flex",alignItems:"center"}}
title="Edit session"
>
<Pencil size={13}/>
</button>
</td>
</tr>
))}
</>
);
};

return (
<div className="d-flex bg-light min-vh-100">
<Sidebar/>
<PageContent>
<div className="container-fluid px-3 px-md-4 py-4">

{toast && (
<div style={{position:"fixed",top:20,right:20,zIndex:9999,background:toast.type==="error"?"#ef4444":"#10b981",color:"#fff",padding:"12px 20px",borderRadius:8,fontWeight:500,boxShadow:"0 4px 12px rgba(0,0,0,0.15)",fontSize:14}}>
{toast.msg}
</div>
)}

<div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-end mb-4 gap-3">
<div>
<h2 className="fw-bold fs-3 mb-1" style={{color:"#0f172a",letterSpacing:"-0.5px"}}>Attendance</h2>
<p className="text-muted small mb-0">Multi-session tracking — employees can check in/out multiple times per day.</p>
</div>
<div className="bg-white p-3 rounded-4 border shadow-sm text-center" style={{minWidth:140}}>
<span className="d-block fs-3 fw-bold" style={{color:"#4f46e5",lineHeight:1}}>{filtered.length}</span>
<span className="text-uppercase fw-bold text-muted" style={{fontSize:10,letterSpacing:1}}>{hasFilters?"Filtered":"Total"} Entries</span>
</div>
</div>

<div className="bg-white rounded-4 border shadow-sm p-3 mb-3">
<div className="row g-2 align-items-end">
<div className="col-12 col-md-5" ref={searchRef} style={{position:"relative"}}>
<label style={LS}>Search Employee</label>
<div style={{position:"relative"}}>
<span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:14,pointerEvents:"none"}}>🔍</span>
<input type="text" value={search}
onChange={e=>{setSearch(e.target.value);setActiveEmployee(null);setShowSuggestions(true);}}
onFocus={()=>setShowSuggestions(true)}
placeholder="Type employee name…"
style={{...IS,paddingLeft:32}}
/>
{search && <button onClick={()=>{setSearch("");setActiveEmployee(null);}} style={CS}>×</button>}
</div>
{showSuggestions && suggestions.length>0 && (
<div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:"1.5px solid #e2e8f0",borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",zIndex:200,marginTop:4,overflow:"hidden"}}>
{suggestions.map(name=>(
<button key={name} onClick={()=>{setSearch(name);setActiveEmployee(name);setShowSuggestions(false);}}
style={{display:"block",width:"100%",textAlign:"left",padding:"9px 14px",background:"none",border:"none",fontSize:13,color:"#1e293b",cursor:"pointer",borderBottom:"1px solid #f1f5f9"}}
onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
onMouseLeave={e=>e.currentTarget.style.background="none"}
>{name}</button>
))}
</div>
)}
</div>
<div className="col-6 col-md-2">
<label style={LS}>From</label>
<input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={IS}/>
</div>
<div className="col-6 col-md-2">
<label style={LS}>To</label>
<input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={IS}/>
</div>
<div className="col-12 col-md-3 d-flex gap-2">
{hasFilters && (
<button onClick={()=>{setSearch("");setDateFrom("");setDateTo("");setActiveEmployee(null);}}
style={{flex:1,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,fontWeight:600,fontSize:13,padding:"9px 0",cursor:"pointer",color:"#64748b"}}>
Clear
</button>
)}
{activeEmployee && detailRows.length>0 && (
<button onClick={()=>downloadPDF(activeEmployee,detailRows,dateFrom,dateTo)}
style={{flex:1,background:"#4f46e5",border:"none",borderRadius:10,fontWeight:600,fontSize:13,padding:"9px 0",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
<Download size={14}/> PDF
</button>
)}
</div>
</div>
</div>

{activeEmployee && (
<div className="bg-white rounded-4 border shadow-sm mb-3 overflow-hidden">
<div className="px-4 py-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
style={{borderBottom:"1px solid #f1f5f9",background:"#fafbff"}}>
<div>
<span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#94a3b8"}}>Detail View</span>
<h6 className="fw-bold mb-0 mt-1" style={{color:"#0f172a"}}>{activeEmployee}</h6>
</div>
<div className="d-flex gap-2 align-items-center flex-wrap">
{["Present","Absent","Late","Half Day"].map(s=>{
const c=detailRows.filter(r=>r.status===s).length;
return c>0?<span key={s} style={{...badgeStyle(s),fontSize:11}}>{c} {s}</span>:null;
})}
<button onClick={()=>downloadPDF(activeEmployee,detailRows,dateFrom,dateTo)}
style={{background:"#4f46e5",border:"none",borderRadius:8,fontWeight:600,fontSize:12,padding:"6px 14px",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:5}}>
<Download size={13}/> Download PDF
</button>
</div>
</div>
<div className="table-responsive">
<table className="table align-middle mb-0">
<thead className="bg-light"><tr style={TS}>
<th className="px-4 py-3 border-0">Date</th>
<th className="px-4 py-3 border-0">Status</th>
<th className="px-4 py-3 border-0">First In</th>
<th className="px-4 py-3 border-0">Last Out</th>
<th className="px-4 py-3 border-0">Total Worked</th>
<th className="px-4 py-3 border-0">Breaks</th>
<th className="px-4 py-3 border-0">Actions</th>
</tr></thead>
<tbody>
{detailRows.length>0
? detailRows.map(item=><AttendanceRow key={item.attendance_id} item={item} showName={false}/>)
: <tr><td colSpan="7" className="text-center py-4 text-muted">No records in this range.</td></tr>}
</tbody>
</table>
</div>
</div>
)}

<div className="bg-white rounded-4 border shadow-sm overflow-hidden" style={{minHeight:"40vh"}}>
<div className="p-3 p-md-4">
{error && <div className="alert alert-danger border-0 rounded-3 mb-4" style={{fontSize:14}}>{error}</div>}
{loading ? (
<div className="text-center py-5">
<div className="spinner-border text-primary" role="status" style={{width:"2.5rem",height:"2.5rem"}}/>
<p className="mt-3 text-muted fw-medium">Fetching records…</p>
</div>
) : (
<div className="table-responsive">
<table className="table align-middle mb-0">
<thead className="bg-light"><tr style={TS}>
<th className="px-4 py-3 border-0">Employee</th>
<th className="px-4 py-3 border-0">Date</th>
<th className="px-4 py-3 border-0">Status</th>
<th className="px-4 py-3 border-0">First In</th>
<th className="px-4 py-3 border-0">Last Out</th>
<th className="px-4 py-3 border-0">Total Worked</th>
<th className="px-4 py-3 border-0">Breaks</th>
<th className="px-4 py-3 border-0">Actions</th>
</tr></thead>
<tbody>
{filtered.length>0
? filtered.map(item=><AttendanceRow key={item.attendance_id} item={item} showName={true}/>)
: <tr><td colSpan="8" className="text-center py-5 text-muted">
{hasFilters?"No records match your filters.":"No attendance records found."}
</td></tr>}
</tbody>
</table>
</div>
)}
</div>
</div>
</div>
</PageContent>

{editDayRow && (
<Backdrop onClose={()=>setEditDayRow(null)}>
<ModalCard title="Edit Day Status" subtitle={`${editDayRow.name} · ${editDayRow.date}`} onClose={()=>setEditDayRow(null)}>
<div className="mb-4">
<label style={{...LS,display:"block",marginBottom:6}}>Status</label>
<select value={editDayStatus} onChange={e=>setEditDayStatus(e.target.value)}
style={{width:"100%",borderRadius:10,fontSize:14,border:"1.5px solid #e2e8f0",padding:"9px 12px",outline:"none",color:"#1e293b"}}>
{["Present","Absent","Late","Half Day"].map(s=><option key={s}>{s}</option>)}
</select>
</div>
<SaveCancel onCancel={()=>setEditDayRow(null)} onSave={handleDaySave} saving={saving}/>
</ModalCard>
</Backdrop>
)}

{editSessionRow && (
<Backdrop onClose={()=>setEditSessionRow(null)}>
<ModalCard
title="Edit Session"
subtitle={`${editSessionRow.parentItem.name} · ${editSessionRow.parentItem.date}`}
onClose={()=>setEditSessionRow(null)}
>
<div className="mb-3">
<label style={{...LS,display:"block",marginBottom:6}}>Check In</label>
<input type="time" value={editSessionForm.check_in}
onChange={e=>setEditSessionForm(p=>({...p,check_in:e.target.value}))}
style={{width:"100%",borderRadius:10,fontSize:14,border:"1.5px solid #e2e8f0",padding:"9px 12px",outline:"none",color:"#1e293b"}}/>
</div>
<div className="mb-4">
<label style={{...LS,display:"block",marginBottom:6}}>Check Out</label>
<input type="time" value={editSessionForm.check_out}
onChange={e=>setEditSessionForm(p=>({...p,check_out:e.target.value}))}
style={{width:"100%",borderRadius:10,fontSize:14,border:"1.5px solid #e2e8f0",padding:"9px 12px",outline:"none",color:"#1e293b"}}/>
</div>
<SaveCancel onCancel={()=>setEditSessionRow(null)} onSave={handleSessionSave} saving={saving}/>
</ModalCard>
</Backdrop>
)}

<style>{`.hover-fade:hover{background-color:#fcfdfe;transition:background 0.2s;}`}</style>
</div>
);
};

const LS = {fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.7px",marginBottom:4,display:"block"};
const IS = {width:"100%",borderRadius:10,fontSize:13,border:"1.5px solid #e2e8f0",padding:"9px 12px",outline:"none",color:"#1e293b",background:"#fff"};
const CS = {position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",fontSize:18,color:"#94a3b8",cursor:"pointer",lineHeight:1,padding:0};
const TS = {fontSize:"11px",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"1px"};

const Backdrop = ({onClose,children}) => (
<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.5)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
<div onClick={e=>e.stopPropagation()}>{children}</div>
</div>
);

const ModalCard = ({title,subtitle,onClose,children}) => (
<div style={{background:"#fff",borderRadius:18,padding:"28px 26px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
<div className="d-flex justify-content-between align-items-start mb-1">
<div>
<h6 className="fw-bold mb-0" style={{color:"#0f172a",fontSize:16}}>{title}</h6>
<small className="text-muted">{subtitle}</small>
</div>
<button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:"#94a3b8",cursor:"pointer",lineHeight:1,padding:0}}>×</button>
</div>
<hr style={{borderColor:"#f1f5f9",margin:"14px 0"}}/>
{children}
</div>
);

const SaveCancel = ({onCancel,onSave,saving}) => (
<div style={{display:"flex",gap:10}}>
<button onClick={onCancel} style={{flex:1,background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:10,fontWeight:600,fontSize:14,padding:"10px 0",cursor:"pointer",color:"#64748b"}}>Cancel</button>
<button onClick={onSave} disabled={saving} style={{flex:1,background:saving?"#a5b4fc":"#4f46e5",border:"none",borderRadius:10,fontWeight:600,fontSize:14,padding:"10px 0",cursor:saving?"not-allowed":"pointer",color:"#fff"}}>
{saving?"Saving…":"Save Changes"}
</button>
</div>
);

export default AdminAttendancePage;