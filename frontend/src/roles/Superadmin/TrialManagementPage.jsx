import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../layouts/Sidebar";
import {
  Clock, CheckCircle2, XCircle, Plus, X, Shield,
  Bell, MessageSquare, Calendar, Users, Search, Ban
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const css = `
  .tr-layout { display:flex; min-height:100vh; background:#f8fafc; }
  .tr-main   { margin-left:250px; flex:1; padding:32px 28px; transition:margin-left .25s; }
  .tr-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
  .tr-stat  { background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 8px rgba(0,0,0,.05); display:flex; align-items:center; gap:14px; }
  .tr-tabs { display:flex; gap:4px; background:#f1f5f9; border-radius:10px; padding:4px; margin-bottom:20px; width:fit-content; }
  .tr-tab  { padding:8px 20px; border-radius:8px; border:none; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; white-space:nowrap; display:flex; align-items:center; gap:6px; }
  .tr-tab.active       { background:#fff; color:#4f46e5; box-shadow:0 1px 4px rgba(0,0,0,.1); }
  .tr-tab:not(.active) { background:transparent; color:#64748b; }
  .tr-table-wrap { background:#fff; border-radius:14px; box-shadow:0 4px 20px rgba(0,0,0,.06); overflow-x:auto; }
  .tr-table      { width:100%; border-collapse:collapse; min-width:600px; }
  .tr-table th   { padding:12px 16px; font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase; letter-spacing:.05em; background:#f8fafc; text-align:left; white-space:nowrap; }
  .tr-table td   { padding:13px 16px; font-size:13px; border-top:1px solid #f1f5f9; vertical-align:middle; }
  .tr-table tr:hover td { background:#fafbff; }
  .tr-table tr.row-suspended td { opacity:.65; background:#fafafa; }
  .tr-cards { display:none; }
  .tr-card  { background:#fff; border-radius:12px; padding:16px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); }
  .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:9999; display:flex; align-items:center; justify-content:center; padding:16px; }
  .modal-box     { background:#fff; border-radius:14px; padding:28px; width:100%; max-width:440px; box-shadow:0 20px 60px rgba(0,0,0,.2); }
  .fi { width:100%; border:1.5px solid #e2e8f0; border-radius:9px; padding:9px 12px; font-size:13px; outline:none; background:#f8fafc; box-sizing:border-box; }
  .fi:focus { border-color:#4f46e5; }
  .req-card { background:#fff; border-radius:12px; padding:18px; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,.05); border-left:4px solid #e2e8f0; }
  .req-card.pending  { border-left-color:#f59e0b; }
  .req-card.approved { border-left-color:#10b981; }
  .req-card.denied   { border-left-color:#ef4444; }
  .badge { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; display:inline-flex; align-items:center; gap:4px; white-space:nowrap; }
  .badge-pending   { background:#fef9c3; color:#a16207; }
  .badge-approved  { background:#dcfce7; color:#16a34a; }
  .badge-denied    { background:#fee2e2; color:#dc2626; }
  .badge-trial     { background:#e0f2fe; color:#0891b2; }
  .badge-active    { background:#dcfce7; color:#16a34a; }
  .badge-expired   { background:#fee2e2; color:#dc2626; }
  .badge-suspended { background:#f1f5f9; color:#64748b; }
  .notif-dot { width:8px; height:8px; background:#ef4444; border-radius:50%; display:inline-block; margin-left:4px; vertical-align:middle; animation:pulse 1.5s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .search-wrap { position:relative; }
  .search-wrap svg { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; pointer-events:none; }
  .search-wrap input { border:1.5px solid #e2e8f0; border-radius:10px; padding:9px 14px 9px 34px; font-size:13px; outline:none; width:280px; background:#fff; transition:border-color .15s; }
  .search-wrap input:focus { border-color:#4f46e5; }
  .act-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 11px; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; border:1px solid transparent; white-space:nowrap; }
  @media (max-width:1100px) { .tr-stats { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:768px) {
    .tr-main { margin-left:70px; padding:20px 14px; }
    .tr-stats { grid-template-columns:1fr 1fr; gap:10px; }
    .tr-table-wrap { display:none; }
    .tr-cards { display:block; }
    .tr-tabs  { width:100%; flex-wrap:wrap; }
    .tr-tab   { flex:1; justify-content:center; }
    .search-wrap input { width:100%; }
  }
  @media (max-width:480px) {
    .tr-main  { margin-left:70px; padding:14px 10px; }
    .tr-stats { grid-template-columns:1fr 1fr; }
  }
`;

const fmtD  = d => d ? new Date(d).toLocaleDateString("en-IN",  { day:"2-digit", month:"short", year:"numeric" }) : "—";
const fmtDT = d => d ? new Date(d).toLocaleString("en-IN",      { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "—";

export default function TrialManagementPage() {
  const [companies,  setCompanies ] = useState([]);
  const [employees,  setEmployees ] = useState([]);
  const [requests,   setRequests  ] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [tab,        setTab       ] = useState("companies");
  const [toast,      setToast     ] = useState(null);
  const [modal,      setModal     ] = useState(null);
  const [days,       setDays      ] = useState("30");
  const [adminNote,  setAdminNote ] = useState("");
  const [acting,     setActing    ] = useState(false);
  const [empSearch,  setEmpSearch ] = useState("");

  const headers = { "x-auth-token": localStorage.getItem("token") };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [comp, reqs, emps] = await Promise.all([
        axios.get(`${API}/api/saas/trials`,          { headers }),
        axios.get(`${API}/api/saas/trials/requests`, { headers }),
        axios.get(`${API}/api/saas/users`,           { headers }),
      ]);
      setCompanies(comp.data.data || []);
      setRequests( reqs.data.data || []);
      setEmployees(emps.data.data || []);
    } catch { showToast("Failed to load data", "error"); }
    finally  { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleAction = async () => {
    if (!modal) return;
    setActing(true);
    try {
      const uid = modal.user?.user_id;
      const cid = modal.company?.company_id;

      if (modal.type === "extend_user") {
        if (!days || parseInt(days) <= 0) { showToast("Enter valid days", "error"); setActing(false); return; }
        await axios.put(`${API}/api/saas/users/${uid}/extend`, { days: parseInt(days) }, { headers });
        showToast(`Trial extended by ${days} days for ${modal.user.name} ✓`);

      } else if (modal.type === "suspend_user") {
        await axios.put(`${API}/api/saas/users/${uid}/suspend`, {}, { headers });
        showToast(`${modal.user.name} suspended`);

      } else if (modal.type === "reactivate_user") {
        await axios.put(`${API}/api/saas/users/${uid}/reactivate`, {}, { headers });
        showToast(`${modal.user.name} reactivated ✓`);

      } else if (modal.type === "extend_company") {
        if (!days || parseInt(days) <= 0) { showToast("Enter valid days", "error"); setActing(false); return; }
        await axios.put(`${API}/api/saas/trials/${cid}/extend`, { days: parseInt(days) }, { headers });
        showToast(`Trial extended by ${days} days for all users in ${modal.company.company_name} ✓`);

      } else if (modal.type === "suspend_company") {
        await axios.put(`${API}/api/saas/trials/${cid}/suspend`, {}, { headers });
        showToast(`All users in ${modal.company.company_name} suspended`);

      } else if (modal.type === "resolve") {
        await axios.put(
          `${API}/api/saas/trials/requests/${modal.request.request_id}/resolve`,
          { status: modal.resolution, admin_note: adminNote },
          { headers }
        );
        showToast(modal.resolution === "approved" ? "Request approved ✓" : "Request denied");
      }

      setModal(null); setAdminNote(""); loadAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", "error");
    } finally { setActing(false); }
  };

  const active     = companies.filter(c =>  c.is_active && !c.is_trial).length;
  const onTrial    = companies.filter(c =>  c.is_trial  && parseInt(c.days_left) > 0 && c.is_active).length;
  const expired    = companies.filter(c =>  c.is_trial  && parseInt(c.days_left) <= 0).length;
  const suspended  = companies.filter(c => !c.is_active).length;
  const pendingCnt = requests.filter(r => r.status === "pending").length;

  const getCompanyBadge = c => {
    if (!c.is_active)               return { label:"Suspended",              cls:"badge-suspended" };
    if (!c.is_trial)                return { label:"Active",                  cls:"badge-active"    };
    if (parseInt(c.days_left) <= 0) return { label:"Expired",                 cls:"badge-expired"   };
    if (parseInt(c.days_left) <= 3) return { label:`${c.days_left}d left`,    cls:"badge-expired"   };
    return                                 { label:`Trial · ${c.days_left}d`, cls:"badge-trial"     };
  };

  const modalTitle = () => {
    if (!modal) return "";
    const name = modal.user?.name || modal.company?.company_name || "";
    if (modal.type === "extend_user")     return `Extend Trial — ${name}`;
    if (modal.type === "suspend_user")    return `Suspend User — ${name}`;
    if (modal.type === "reactivate_user") return `Reactivate — ${name}`;
    if (modal.type === "extend_company")  return `Extend Trial — ${name} (all users)`;
    if (modal.type === "suspend_company") return `Suspend Company — ${name}`;
    if (modal.type === "resolve") return modal.resolution === "approved" ? "Approve Request" : "Deny Request";
    return "";
  };

  const modalBtnLabel = () => {
    if (acting) return "Processing…";
    if (!modal) return "";
    if (modal.type === "extend_user"  || modal.type === "extend_company")  return "Extend Trial";
    if (modal.type === "suspend_user" || modal.type === "suspend_company") return "Suspend";
    if (modal.type === "reactivate_user") return "Reactivate ✓";
    if (modal.type === "resolve") return modal.resolution === "approved" ? "Approve ✓" : "Deny ✗";
    return "Confirm";
  };

  const isDestructive = modal && (
    modal.type === "suspend_user" || modal.type === "suspend_company" || modal.resolution === "denied"
  );


  const CompanyActionBtns = ({ company }) => (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      <button className="act-btn" onClick={() => { setModal({ type:"extend_company", company }); setDays("30"); }}
        style={{ background:"#eff6ff", color:"#2563eb", borderColor:"#bfdbfe" }}>
        <Plus size={11}/> Extend All
      </button>
      {company.is_active ? (
        <button className="act-btn" onClick={() => setModal({ type:"suspend_company", company })}
          style={{ background:"#fff1f2", color:"#ef4444", borderColor:"#fecaca" }}>
          <Ban size={11}/> Suspend All
        </button>
      ) : (
        <button className="act-btn" onClick={() => { setModal({ type:"extend_company", company }); setDays("30"); }}
          style={{ background:"#dcfce7", color:"#16a34a", borderColor:"#bbf7d0" }}>
          <CheckCircle2 size={11}/> Reactivate All
        </button>
      )}
    </div>
  );
  const UserActionBtns = ({ user }) => (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      <button className="act-btn" onClick={() => { setModal({ type:"extend_user", user }); setDays("30"); }}
        style={{ background:"#eff6ff", color:"#2563eb", borderColor:"#bfdbfe" }}>
        <Plus size={11}/> Extend
      </button>
      {user.is_active ? (
        <button className="act-btn" onClick={() => setModal({ type:"suspend_user", user })}
          style={{ background:"#fff1f2", color:"#ef4444", borderColor:"#fecaca" }}>
          <Ban size={11}/> Suspend
        </button>
      ) : (
        <button className="act-btn" onClick={() => setModal({ type:"reactivate_user", user })}
          style={{ background:"#dcfce7", color:"#16a34a", borderColor:"#bbf7d0" }}>
          <CheckCircle2 size={11}/> Reactivate
        </button>
      )}
    </div>
  );

 
  const filteredEmps = empSearch.trim() === ""
    ? employees
    : employees.filter(e => {
        const q = empSearch.toLowerCase();
        return (e.name || "").toLowerCase().includes(q)
            || (e.email || "").toLowerCase().includes(q)
            || (e.company_name || "").toLowerCase().includes(q);
      });

  return (
    <>
      <style>{css}</style>
      <div className="tr-layout">
        <Sidebar />
        <div className="tr-main">

        
          {toast && (
            <div style={{ position:"fixed", top:16, right:16, zIndex:9999, background:toast.type==="error"?"#ef4444":"#10b981", color:"#fff", padding:"12px 20px", borderRadius:8, fontWeight:500, boxShadow:"0 4px 12px rgba(0,0,0,.15)", maxWidth:"calc(100vw - 32px)" }}>
              {toast.message}
            </div>
          )}

      
          {modal && (
            <div className="modal-overlay">
              <div className="modal-box">
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{modalTitle()}</div>
                  <button onClick={() => { setModal(null); setAdminNote(""); }}
                    style={{ background:"transparent", border:"none", cursor:"pointer", color:"#94a3b8" }}>
                    <X size={18}/>
                  </button>
                </div>

              
                {modal.user && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, background:"#f8fafc", borderRadius:10, padding:"10px 14px", marginBottom:16 }}>
                    <div style={{ width:34, height:34, borderRadius:8, background:modal.user.is_active?"#6366f1":"#94a3b8", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, flexShrink:0 }}>
                      {(modal.user.name||"?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13, color:"#1e293b" }}>{modal.user.name}</div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>{modal.user.email} · {(modal.user.role||"").replace("_"," ")} · {modal.user.company_name}</div>
                    </div>
                  </div>
                )}

              
                {modal.company && !modal.user && (
                  <div style={{ background:"#f8fafc", borderRadius:10, padding:"10px 14px", marginBottom:16, fontSize:13 }}>
                    <strong style={{ color:"#1e293b" }}>{modal.company.company_name}</strong>
                    <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
                      {modal.type.includes("suspend")
                        ? "All users in this company will lose access immediately."
                        : "Trial will be extended for all users in this company."}
                    </div>
                  </div>
                )}

                {modal.request && (
                  <div style={{ fontSize:13, color:"#64748b", marginBottom:16 }}>
                    Company: <strong style={{ color:"#1e293b" }}>{modal.request.company_name}</strong>
                    <div style={{ marginTop:4 }}>
                      Requested by: <strong>{modal.request.requester_name}</strong>
                      <span style={{ marginLeft:6, fontSize:11, color:"#94a3b8" }}>({modal.request.requester_role})</span>
                    </div>
                  </div>
                )}

                {(modal.type === "extend_user" || modal.type === "extend_company") && (
                  <div style={{ marginBottom:16 }}>
                    <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>Days to Add</label>
                    <input type="number" className="fi" value={days} onChange={e => setDays(e.target.value)} min="1" max="365" placeholder="e.g. 30"/>
                    {(modal.user?.user_trial_end || modal.company?.trial_end) && (
                      <div style={{ fontSize:11, color:"#94a3b8", marginTop:5 }}>
                        Current trial end: {fmtD(modal.user?.user_trial_end || modal.company?.trial_end)}
                      </div>
                    )}
                  </div>
                )}

                {(modal.type === "suspend_user" || modal.type === "suspend_company") && (
                  <div style={{ background:"#fff1f2", border:"1px solid #fecaca", borderRadius:8, padding:"12px 14px", marginBottom:16, fontSize:13, color:"#dc2626" }}>
                    {modal.type === "suspend_user"
                      ? `${modal.user.name} will immediately lose access to the platform.`
                      : `All users in ${modal.company.company_name} will immediately lose access.`}
                  </div>
                )}

               
                {modal.type === "reactivate_user" && (
                  <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:8, padding:"12px 14px", marginBottom:16, fontSize:13, color:"#16a34a" }}>
                    {modal.user.name} will regain full access to the platform.
                  </div>
                )}

                {modal.type === "resolve" && (
                  <>
                    {modal.request?.message && (
                      <div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 14px", marginBottom:14, fontSize:13, color:"#374151" }}>
                        <div style={{ fontSize:11, fontWeight:700, color:"#94a3b8", marginBottom:4, textTransform:"uppercase" }}>Their message</div>
                        {modal.request.message}
                      </div>
                    )}
                    <div style={{ marginBottom:16 }}>
                      <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>Admin Note (optional)</label>
                      <textarea className="fi" rows={2} value={adminNote} onChange={e => setAdminNote(e.target.value)}
                        placeholder="Add a note visible to the requester…" style={{ resize:"none" }}/>
                    </div>
                  </>
                )}

               
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => { setModal(null); setAdminNote(""); }}
                    style={{ flex:1, padding:10, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button onClick={handleAction} disabled={acting}
                    style={{ flex:1, padding:10, border:"none", borderRadius:8, fontWeight:600, cursor:acting?"not-allowed":"pointer", color:"#fff", opacity:acting?.8:1,
                      background: isDestructive ? "#ef4444" : "#4f46e5" }}>
                    {modalBtnLabel()}
                  </button>
                </div>
              </div>
            </div>
          )}

        
          <div style={{ marginBottom:24 }}>
            <h2 style={{ fontWeight:700, fontSize:22, margin:0, color:"#1e293b" }}>Trial Management</h2>
            <p style={{ color:"#64748b", fontSize:13, margin:"4px 0 0" }}>Manage individual user access, company trials, and extension requests</p>
          </div>

        
          <div className="tr-stats">
            {[
              { icon:<Shield       size={20} color="#4f46e5"/>, bg:"#eef2ff", label:"Total Companies",   value:companies.length },
              { icon:<Clock        size={20} color="#0891b2"/>, bg:"#e0f2fe", label:"On Trial",          value:onTrial },
              { icon:<CheckCircle2 size={20} color="#16a34a"/>, bg:"#dcfce7", label:"Active Plans",      value:active },
              { icon:<XCircle      size={20} color="#ef4444"/>, bg:"#fee2e2", label:"Expired/Suspended", value:expired + suspended },
            ].map(s => (
              <div key={s.label} className="tr-stat">
                <div style={{ width:42, height:42, borderRadius:10, background:s.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize:11, color:"#64748b", fontWeight:600, marginBottom:3 }}>{s.label}</div>
                  <div style={{ fontSize:18, fontWeight:700, color:"#1e293b" }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tr-tabs">
            <button className={`tr-tab ${tab==="companies"?"active":""}`} onClick={() => setTab("companies")}>
              <Shield size={13}/> Companies
            </button>
            <button className={`tr-tab ${tab==="employees"?"active":""}`} onClick={() => setTab("employees")}>
              <Users size={13}/> Users
              <span style={{ background:"#e0e7ff", color:"#4f46e5", borderRadius:20, fontSize:10, fontWeight:700, padding:"1px 6px", marginLeft:2 }}>
                {employees.length}
              </span>
            </button>
            <button className={`tr-tab ${tab==="requests"?"active":""}`} onClick={() => setTab("requests")}>
              <Bell size={13}/> Extension Requests
              {pendingCnt > 0 && <span className="notif-dot"/>}
              {pendingCnt > 0 && (
                <span style={{ background:"#ef4444", color:"#fff", borderRadius:20, fontSize:10, fontWeight:700, padding:"1px 6px", marginLeft:2 }}>{pendingCnt}</span>
              )}
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:40, color:"#94a3b8" }}>Loading…</div>

          ) : tab === "companies" ? (
           
            companies.length === 0 ? (
              <div style={{ background:"#fff", borderRadius:14, padding:50, textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🏢</div>
                <div style={{ fontWeight:600, color:"#1e293b" }}>No companies registered yet</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize:12, color:"#92400e", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:8, padding:"8px 14px", marginBottom:12 }}>
                  💡 Company actions affect <strong>all users</strong>. Use the <strong>Users</strong> tab to manage a single user.
                </div>

                <div className="tr-table-wrap">
                  <table className="tr-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Admin</th>
                        <th>Trial Start</th>
                        <th>Trial End</th>
                        <th>Days Left</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map(c => {
                        const s = getCompanyBadge(c);
                        return (
                          <tr key={c.company_id}>
                            <td>
                              <div style={{ fontWeight:600, color:"#1e293b" }}>{c.company_name}</div>
                              <div style={{ fontSize:11, color:"#94a3b8" }}>{c.email}</div>
                              {parseInt(c.pending_requests) > 0 && (
                                <span style={{ fontSize:10, background:"#fef9c3", color:"#a16207", padding:"1px 7px", borderRadius:20, fontWeight:600, marginTop:3, display:"inline-block" }}>
                                  {c.pending_requests} pending request{c.pending_requests > 1 ? "s" : ""}
                                </span>
                              )}
                            </td>
                            <td>
                              <div style={{ fontSize:13, color:"#1e293b" }}>{c.admin_name  || "—"}</div>
                              <div style={{ fontSize:11, color:"#94a3b8" }}>{c.admin_email || ""}</div>
                            </td>
                            <td style={{ fontSize:12, color:"#64748b" }}>{fmtD(c.trial_start)}</td>
                            <td style={{ fontSize:12, color:"#64748b" }}>{fmtD(c.trial_end)}</td>
                            <td>
                              <span style={{ fontWeight:700, fontSize:14,
                                color: parseInt(c.days_left) <= 3 ? "#ef4444" : parseInt(c.days_left) <= 7 ? "#ca8a04" : "#16a34a" }}>
                                {c.is_trial ? (parseInt(c.days_left) > 0 ? `${parseInt(c.days_left)}d` : "0d") : "∞"}
                              </span>
                            </td>
                            <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                            <td><CompanyActionBtns company={c}/></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="tr-cards">
                  {companies.map(c => {
                    const s = getCompanyBadge(c);
                    return (
                      <div key={c.company_id} className="tr-card">
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div>
                            <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{c.company_name}</div>
                            <div style={{ fontSize:12, color:"#94a3b8", marginTop:2 }}>{c.admin_name || c.email}</div>
                          </div>
                          <span className={`badge ${s.cls}`}>{s.label}</span>
                        </div>
                        <div style={{ display:"flex", gap:16, fontSize:12, color:"#64748b", marginBottom:12 }}>
                          <span>Start: {fmtD(c.trial_start)}</span>
                          <span>End: {fmtD(c.trial_end)}</span>
                          {c.is_trial && (
                            <span style={{ fontWeight:700, color: parseInt(c.days_left) <= 3 ? "#ef4444" : "#16a34a" }}>
                              {parseInt(c.days_left)}d left
                            </span>
                          )}
                        </div>
                        <CompanyActionBtns company={c}/>
                      </div>
                    );
                  })}
                </div>
              </>
            )

          ) : tab === "employees" ? (
           
            <>
              {/* Search bar */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16, flexWrap:"wrap", gap:10 }}>
                <div className="search-wrap">
                  <Search size={14}/>
                  <input
                    placeholder="Search by name, email or company…"
                    value={empSearch}
                    onChange={e => setEmpSearch(e.target.value)}
                  />
                </div>
                <div style={{ fontSize:12, color:"#94a3b8" }}>
                  {filteredEmps.length} / {employees.length} users
                </div>
              </div>

              {filteredEmps.length === 0 ? (
                <div style={{ background:"#fff", borderRadius:14, padding:50, textAlign:"center" }}>
                  <div style={{ fontSize:36, marginBottom:10 }}>👥</div>
                  <div style={{ fontWeight:600, color:"#1e293b" }}>
                    {empSearch ? "No users match your search" : "No users found"}
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop table — only User, Role, Company, Actions */}
                  <div className="tr-table-wrap">
                    <table className="tr-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Role</th>
                          <th>Company</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmps.map((u, i) => (
                          <tr key={u.user_id || i} className={!u.is_active ? "row-suspended" : ""}>
                            {/* User */}
                            <td>
                              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                <div style={{ width:32, height:32, borderRadius:8, background:u.is_active?"#6366f1":"#94a3b8", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, flexShrink:0 }}>
                                  {(u.name||"?").charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontWeight:600, color:"#1e293b" }}>{u.name}</div>
                                  <div style={{ fontSize:11, color:"#94a3b8" }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            {/* Role */}
                            <td>
                              <span style={{ background:"#f1f5f9", color:"#475569", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, textTransform:"capitalize" }}>
                                {(u.role||"—").replace(/_/g," ")}
                              </span>
                            </td>
                            {/* Company */}
                            <td>
                              <span style={{ background:"#eef2ff", color:"#4f46e5", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 }}>
                                {u.company_name || "—"}
                              </span>
                            </td>
                            {/* Actions: Extend + Suspend/Reactivate */}
                            <td><UserActionBtns user={u}/></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards */}
                  <div className="tr-cards">
                    {filteredEmps.map((u, i) => (
                      <div key={u.user_id || i} className="tr-card" style={{ opacity:u.is_active ? 1 : .7 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                          <div>
                            <div style={{ fontWeight:700, fontSize:15, color:"#1e293b" }}>{u.name}</div>
                            <div style={{ fontSize:12, color:"#94a3b8" }}>{u.email}</div>
                            <span style={{ background:"#eef2ff", color:"#4f46e5", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, marginTop:4, display:"inline-block" }}>
                              {u.company_name || "—"}
                            </span>
                          </div>
                          <span style={{ background:"#f1f5f9", color:"#475569", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, textTransform:"capitalize", flexShrink:0 }}>
                            {(u.role||"—").replace(/_/g," ")}
                          </span>
                        </div>
                        <UserActionBtns user={u}/>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>

          ) : (
            /* ════════════════════ REQUESTS TAB ════════════════════ */
            requests.length === 0 ? (
              <div style={{ background:"#fff", borderRadius:14, padding:50, textAlign:"center" }}>
                <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
                <div style={{ fontWeight:600, color:"#1e293b" }}>No extension requests yet</div>
                <div style={{ fontSize:13, color:"#94a3b8", marginTop:4 }}>Requests from users will appear here</div>
              </div>
            ) : (
              <div>
                {requests.map(r => (
                  <div key={r.request_id} className={`req-card ${r.status}`}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:14, color:"#1e293b" }}>{r.company_name}</div>
                        <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
                          Requested by <strong>{r.requester_name}</strong>
                          <span style={{ marginLeft:6, background:"#f1f5f9", color:"#64748b", padding:"1px 7px", borderRadius:20, fontSize:10, fontWeight:600 }}>
                            {r.requester_role === "employee" ? "Employee" : "Admin"}
                          </span>
                        </div>
                      </div>
                      <span className={`badge badge-${r.status}`}>
                        {r.status === "pending"  ? <Clock size={10}/> :
                         r.status === "approved" ? <CheckCircle2 size={10}/> :
                         <XCircle size={10}/>}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </span>
                    </div>

                    <div style={{ display:"flex", gap:16, fontSize:12, color:"#64748b", marginBottom: r.message ? 10 : 12, flexWrap:"wrap" }}>
                      <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <Calendar size={11}/> {fmtDT(r.created_at)}
                      </span>
                      <span>Days requested: <strong>{r.days_requested}</strong></span>
                      <span>
                        Trial days left:{" "}
                        <strong style={{ color: parseInt(r.days_left) <= 3 ? "#ef4444" : "#16a34a" }}>
                          {r.days_left}d
                        </strong>
                      </span>
                    </div>

                    {r.message && (
                      <div style={{ background:"#f8fafc", borderRadius:8, padding:"9px 12px", fontSize:13, color:"#374151", marginBottom:12, display:"flex", gap:8, alignItems:"flex-start" }}>
                        <MessageSquare size={14} style={{ color:"#94a3b8", marginTop:1, flexShrink:0 }}/>
                        <span>{r.message}</span>
                      </div>
                    )}

                    {r.admin_note && (
                      <div style={{ background: r.status === "approved" ? "#f0fdf4" : "#fff1f2", borderRadius:8, padding:"9px 12px", fontSize:12, color: r.status === "approved" ? "#16a34a" : "#ef4444", marginBottom:12 }}>
                        <strong>Admin note:</strong> {r.admin_note}
                      </div>
                    )}

                    {r.status === "pending" && (
                      <div style={{ display:"flex", gap:8 }}>
                        <button onClick={() => setModal({ type:"resolve", resolution:"approved", request:r })}
                          style={{ padding:"7px 16px", background:"#dcfce7", color:"#16a34a", border:"1px solid #bbf7d0", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                          <CheckCircle2 size={13}/> Approve
                        </button>
                        <button onClick={() => setModal({ type:"resolve", resolution:"denied", request:r })}
                          style={{ padding:"7px 16px", background:"#fff1f2", color:"#ef4444", border:"1px solid #fecaca", borderRadius:8, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
                          <XCircle size={13}/> Deny
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </>
  );
}