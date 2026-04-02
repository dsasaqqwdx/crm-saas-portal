import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, AlertTriangle, CheckCircle2, Send, X, ChevronDown } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export default function TrialWidget() {
  const [trial,      setTrial     ] = useState(null);
  const [requests,   setRequests  ] = useState([]);
  const [loading,    setLoading   ] = useState(true);
  const [showModal,  setShowModal ] = useState(false);
  const [message,    setMessage   ] = useState("");
  const [daysReq,    setDaysReq   ] = useState("30");
  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast     ] = useState(null);

  const token   = localStorage.getItem("token");
  const role    = localStorage.getItem("role");
  const headers = { "x-auth-token": token };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadTrial = async () => {
    if (role === "super_admin" || role === "software_owner") { setLoading(false); return; }
    try {
      const [t, r] = await Promise.all([
        axios.get(`${API}/api/saas/my-trial`,          { headers }),
        axios.get(`${API}/api/saas/my-trial/requests`, { headers }),
      ]);
      setTrial(t.data.data    || null);
      setRequests(r.data.data || []);
    } catch (err) { console.error("TrialWidget fetch error:", err); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadTrial(); }, []); // eslint-disable-line

  if (loading || !trial)                  return null;
  if (!trial.is_trial && trial.is_active) return null; // full paid plan → hide

  const days    = parseInt(trial.days_left ?? 0);
  const expired = days <= 0 || !trial.is_active;
  const urgent  = !expired && days <= 5;
  const warning = !expired && !urgent && days <= 10;

  const pendingReq = requests.find(r => r.status === "pending");
  const lastReq    = requests[0];

  const fmtD = d => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  const palette = expired
    ? { bg:"#fef2f2", border:"#fecaca", color:"#dc2626", btnBg:"#fee2e2", btnColor:"#dc2626", btnBorder:"#fecaca", ic:"#ef4444" }
    : urgent
    ? { bg:"#fff7ed", border:"#fed7aa", color:"#c2410c", btnBg:"#ffedd5", btnColor:"#c2410c", btnBorder:"#fed7aa", ic:"#f97316" }
    : warning
    ? { bg:"#fffbeb", border:"#fde68a", color:"#a16207", btnBg:"#fef9c3", btnColor:"#a16207", btnBorder:"#fde68a", ic:"#eab308" }
    : { bg:"#f0fdf4", border:"#bbf7d0", color:"#15803d", btnBg:"#dcfce7", btnColor:"#15803d", btnBorder:"#86efac", ic:"#22c55e" };

  const icon = expired || urgent
    ? <AlertTriangle size={18} color={palette.ic} style={{ flexShrink:0 }}/>
    : <Clock size={18} color={palette.ic} style={{ flexShrink:0 }}/>;

  const handleSubmit = async () => {
    if (!daysReq || parseInt(daysReq) <= 0) { showToast("Enter valid days", "error"); return; }
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/saas/my-trial/request-extension`, { message, days_requested: parseInt(daysReq) }, { headers });
      showToast("Extension request sent to administrator ✓");
      setShowModal(false); setMessage(""); setDaysReq("30");
      loadTrial();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send request", "error");
    } finally { setSubmitting(false); }
  };

  return (
    <>
      {toast && (
        <div style={{ position:"fixed", top:16, right:16, zIndex:9999, background:toast.type==="error"?"#ef4444":"#10b981", color:"#fff", padding:"12px 20px", borderRadius:8, fontWeight:500, boxShadow:"0 4px 12px rgba(0,0,0,.15)", maxWidth:"calc(100vw - 32px)", fontSize:14 }}>
          {toast.msg}
        </div>
      )}

      {showModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:9998, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
          <div style={{ background:"#fff", borderRadius:16, padding:28, width:"100%", maxWidth:440, boxShadow:"0 20px 60px rgba(0,0,0,.2)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div style={{ fontWeight:700, fontSize:16, color:"#1e293b" }}>Request Trial Extension</div>
              <button onClick={() => setShowModal(false)} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#94a3b8" }}><X size={18}/></button>
            </div>
            <p style={{ fontSize:13, color:"#64748b", marginBottom:18 }}>Your request will be sent to the platform administrator. You'll be notified once reviewed.</p>
            <div style={{ background:"#f8fafc", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:13 }}>
              <div style={{ display:"flex", justifyContent:"space-between", color:"#374151" }}>
                <span style={{ color:"#64748b" }}>Trial ends:</span><strong>{fmtD(trial.trial_end)}</strong>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:4, color:"#374151" }}>
                <span style={{ color:"#64748b" }}>Days remaining:</span>
                <strong style={{ color:expired?"#ef4444":urgent?"#f97316":"#16a34a" }}>{expired?"Expired":`${days}d`}</strong>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>Days Requested</label>
              <div style={{ position:"relative" }}>
                <select value={daysReq} onChange={e => setDaysReq(e.target.value)}
                  style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:9, padding:"9px 36px 9px 12px", fontSize:13, outline:"none", background:"#f8fafc", appearance:"none", boxSizing:"border-box" }}>
                  <option value="15">15 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
                <ChevronDown size={13} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:"#94a3b8", pointerEvents:"none" }}/>
              </div>
            </div>
            <div style={{ marginBottom:20 }}>
              <label style={{ fontSize:12, fontWeight:600, color:"#64748b", display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:".04em" }}>Message (optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3}
                placeholder="Tell the admin why you need more time…"
                style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:9, padding:"9px 12px", fontSize:13, outline:"none", background:"#f8fafc", resize:"none", boxSizing:"border-box" }}/>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={() => setShowModal(false)} style={{ flex:1, padding:11, background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:9, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting}
                style={{ flex:1, padding:11, background:"#4f46e5", color:"#fff", border:"none", borderRadius:9, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, opacity:submitting?.7:1 }}>
                <Send size={14}/> {submitting?"Sending…":"Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ background:palette.bg, border:`1px solid ${palette.border}`, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"flex-start", gap:12, color:palette.color }}>
        <span style={{ paddingTop:2 }}>{icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <div style={{ fontWeight:700, fontSize:14 }}>
              {expired ? "Trial Expired — Access Restricted" : `Free Trial: ${days} day${days!==1?"s":""} remaining`}
            </div>
            {!expired && (
              <div style={{ background:palette.btnBg, color:palette.btnColor, border:`1px solid ${palette.btnBorder}`, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700, flexShrink:0 }}>
                {days}d left · Ends {fmtD(trial.trial_end)}
              </div>
            )}
          </div>
          <div style={{ fontSize:13, opacity:.85, marginTop:3, marginBottom:8 }}>
            {expired  ? "Your trial period has ended. Request an extension or contact your administrator."
            : urgent  ? `⚠️ Trial ends on ${fmtD(trial.trial_end)} — request an extension now.`
            : warning ? `Trial ends on ${fmtD(trial.trial_end)}. Request an extension if you need more time.`
            :           `Your trial is active and ends on ${fmtD(trial.trial_end)}.`}
          </div>
          {lastReq && (
            <div style={{ display:"inline-flex", alignItems:"center", gap:6,
              background: lastReq.status==="approved"?"#dcfce7":lastReq.status==="denied"?"#fee2e2":"#fef9c3",
              color:      lastReq.status==="approved"?"#16a34a":lastReq.status==="denied"?"#dc2626":"#a16207",
              padding:"4px 10px", borderRadius:20, fontSize:12, fontWeight:600, marginBottom:10 }}>
              {lastReq.status==="approved"?<CheckCircle2 size={11}/>:lastReq.status==="denied"?<X size={11}/>:<Clock size={11}/>}
              {lastReq.status==="pending"  ? "Extension request pending review" :
               lastReq.status==="approved" ? `Extension approved (+${lastReq.days_requested} days)` : "Last request was denied"}
              {lastReq.admin_note && ` — "${lastReq.admin_note}"`}
            </div>
          )}
          <div>
            {!pendingReq ? (
              <button onClick={() => setShowModal(true)} style={{ padding:"7px 16px", background:palette.btnBg, color:palette.btnColor, border:`1px solid ${palette.btnBorder}`, borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:6 }}>
                <Send size={13}/> Request Extension
              </button>
            ) : (
              <div style={{ padding:"7px 14px", background:palette.btnBg, color:palette.btnColor, border:`1px solid ${palette.btnBorder}`, borderRadius:8, fontSize:13, fontWeight:600, display:"inline-flex", alignItems:"center", gap:6 }}>
                <Clock size={13}/> Request sent — awaiting admin response
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}