
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Heart, Send, Clock, Eye, CheckCircle, Search,
  Pencil, X, Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight, Award,
} from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const typeConfig = {
  general:          { label: "General",          color: "#f59e0b", bg: "#fffbeb" },
  performance:      { label: "Performance",       color: "#6366f1", bg: "#f5f3ff" },
  teamwork:         { label: "Teamwork",          color: "#10b981", bg: "#f0fdf4" },
  innovation:       { label: "Innovation",        color: "#3b82f6", bg: "#eff6ff" },
  leadership:       { label: "Leadership",        color: "#8b5cf6", bg: "#f5f3ff" },
  customer_service: { label: "Customer Service",  color: "#ec4899", bg: "#fdf2f8" },
};

const buildPreviewHTML = (emp, title, message, type) => {
const c = typeConfig[type] || typeConfig.general;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
const firstName = (emp?.name || "Employee").split(" ")[0];
  return `<div style="font-family:'DM Sans',Arial,sans-serif;color:#1e293b;font-size:13.5px;line-height:1.85;">
<div style="background:${c.color};height:6px;border-radius:4px 4px 0 0;margin-bottom:24px;"></div>
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;flex-wrap:wrap;gap:10px;">
<div>
<div style="font-size:20px;font-weight:900;color:${c.color};">SHNOOR INTERNATIONAL LLC</div>
<div style="font-size:11px;color:#94a3b8;">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div>
</div>
<div style="text-align:right;font-size:12px;color:#64748b;">Date: ${today}<br/>Ref: SHNOOR/APR/${Date.now().toString().slice(-6)}</div>
</div>
<div style="border-top:1px solid #f1f5f9;padding-top:16px;margin-bottom:16px;">
<strong>To,</strong><br/><strong>${emp?.name || ""}</strong><br/>${emp?.email || ""}
${emp?.designation ? "<br/>" + emp.designation : ""}
${emp?.department ? " &mdash; " + emp.department : ""}
</div>
<div style="font-weight:700;margin-bottom:12px;">Sub: Letter of Appreciation &mdash; ${title || c.label}</div>
<p>Dear <strong>${firstName}</strong>,</p>
<p>We are pleased to present you this <strong>Letter of Appreciation</strong> in recognition of your outstanding contribution and dedication to <strong>SHNOOR INTERNATIONAL LLC</strong>.</p>
<div style="background:${c.bg};border-left:4px solid ${c.color};border-radius:0 10px 10px 0;padding:16px 20px;margin:20px 0;">
<div style="font-size:15px;font-weight:700;color:${c.color};margin-bottom:6px;">&#x1F3C6; ${title || "Outstanding Contribution"}</div>
<div style="color:#334155;font-size:13px;">Category: <strong>${c.label}</strong></div>
</div>
${message ? `<p>${message}</p>` : ""}
<p>Your efforts reflect the values and standards that make our organisation thrive. We are truly grateful to have you as a part of our team.</p>
<p>Keep up the exceptional work!</p>
<div style="margin-top:32px;padding-top:20px;border-top:1px solid #f1f5f9;">
<strong>Authorised Signatory</strong><br/>
<span style="color:#64748b;font-size:12px;">HR Department, SHNOOR INTERNATIONAL LLC</span>
</div>
</div>`;
};
const EditModal = ({ item, onClose, onSaved, showToast }) => {
  const emp = {
    name:        item.employee_name  || item.employeeName  || "",
  email:       item.employee_email || item.employeeEmail || "",
designation: item.designation    || "",
    department:  item.department     || "",
  };

const [editTitle,   setEditTitle]   = useState(item.title   || "");
  const [editMessage, setEditMessage] = useState(item.message || "");
const [editType,    setEditType]    = useState(item.appreciation_type || item.appreciationType || "general");
const [saving,      setSaving]      = useState(false);
  const [isEdited,    setIsEdited]    = useState(false);
  const editorRef = useRef(null);

const [editableHtml, setEditableHtml] = useState(
    buildPreviewHTML(emp, item.title || "", item.message || "", item.appreciation_type || item.appreciationType || "general")
  );
useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = editableHtml;
  }, []); 
const handleTitleChange = (newTitle) => {
    setEditTitle(newTitle);
    if (!isEdited) {
const newHtml = buildPreviewHTML(emp, newTitle, editMessage, editType);
      setEditableHtml(newHtml);
      if (editorRef.current) editorRef.current.innerHTML = newHtml;
    }
 };

const handleMessageChange = (newMessage) => {
    setEditMessage(newMessage);
    if (!isEdited) {
      const newHtml = buildPreviewHTML(emp, editTitle, newMessage, editType);
      setEditableHtml(newHtml);
      if (editorRef.current) editorRef.current.innerHTML = newHtml;
    }
  };
const handleTypeChange = (newType) => {
    setEditType(newType);
    const newHtml = buildPreviewHTML(emp, editTitle, editMessage, newType);
    setEditableHtml(newHtml);
    setIsEdited(false);
    if (editorRef.current) editorRef.current.innerHTML = newHtml;
  };
const handleResetContent = () => {
    const fresh = buildPreviewHTML(emp, editTitle, editMessage, editType);
    setEditableHtml(fresh);
    setIsEdited(false);
    if (editorRef.current) editorRef.current.innerHTML = fresh;
  };

const handleEditorInput = () => setIsEdited(true);
const execFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setEditableHtml(editorRef.current.innerHTML);
      setIsEdited(true);
    }
    editorRef.current?.focus();
  };
const doAction = async (action) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
    
      const htmlContent = editorRef.current ? editorRef.current.innerHTML : editableHtml;

      if (action === "update") {
        await axios.put(
          `${API}/api/appreciations/${item.id || item.appreciation_id}`,
          { title: editTitle, message: editMessage, appreciationType: editType },
          { headers: { "x-auth-token": token } }
        );
        showToast("Appreciation updated successfully");
      }  else if (action === "resend") {
  await axios.post(
    `${API}/api/appreciations/send`,
    {
      toEmail:          emp.email,
      subject:          editTitle,
      message:          editMessage,
      appreciationType: editType,
      htmlContent,      
    },
    { headers: { "x-auth-token": token } }
  );
  showToast(`Appreciation sent to ${emp.email}`);
}
      onSaved();
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || "Action failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const tbBtn = {
    background: "none", border: "1px solid #e2e8f0", borderRadius: "6px",
    padding: "5px 8px", cursor: "pointer", color: "#334155",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const cfg = typeConfig[editType] || typeConfig.general;

  return (
    <div
      onMouseDown={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",padding:"16px" }}
    >
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{ background:"#fff",borderRadius:"24px",width:"94vw",maxWidth:"1120px",height:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.22)",overflow:"hidden" }}
      >
       
        <div style={{ padding:"20px 28px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <div>
            <div style={{ fontSize:"17px",fontWeight:"800",color:"#0f172a" }}>Edit Appreciation</div>
            <div style={{ fontSize:"13px",color:"#64748b",marginTop:"2px" }}>
              For <strong>{emp.name}</strong> · {emp.email}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{ background:"#f1f5f9",border:"none",borderRadius:"8px",padding:"6px 10px",cursor:"pointer",color:"#64748b" }}>
            <X size={18} />
          </button>
        </div>


        <div style={{ display:"grid",gridTemplateColumns:"290px 1fr",flex:1,minHeight:0,overflow:"hidden" }}>

        
          <div style={{ padding:"20px",borderRight:"1px solid #f1f5f9",overflowY:"auto",display:"flex",flexDirection:"column",gap:"16px",background:"#fafafa" }}>

      
            <div>
              <label style={{ fontSize:"11px",fontWeight:"700",color:"#94a3b8",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.5px" }}>
                Appreciation Type
              </label>
              <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
                {Object.entries(typeConfig).map(([key, c]) => {
                  const active = editType === key;
                  return (
                    <button key={key} type="button" onClick={() => handleTypeChange(key)}
                      style={{ border:active?`2px solid ${c.color}`:"1.5px solid #e2e8f0",borderRadius:"10px",padding:"9px 12px",cursor:"pointer",background:active?c.bg:"#fff",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"8px",width:"100%",textAlign:"left" }}>
                      <div style={{ width:"10px",height:"10px",borderRadius:"50%",background:c.color,flexShrink:0 }} />
                      <span style={{ fontSize:"13px",fontWeight:"700",color:active?c.color:"#1e293b" }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

    
            <div>
              <label style={{ fontSize:"11px",fontWeight:"700",color:"#94a3b8",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px" }}>Title</label>
              <input
                value={editTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. Outstanding Performance"
                style={{ width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#1e293b",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box" }}
              />
            </div>

     
            <div>
              <label style={{ fontSize:"11px",fontWeight:"700",color:"#94a3b8",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px" }}>Message</label>
              <textarea
                value={editMessage}
                onChange={e => handleMessageChange(e.target.value)}
                placeholder="Write your appreciation message..."
                style={{ width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#1e293b",fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",minHeight:"90px",boxSizing:"border-box",background:"#fff" }}
              />
            </div>

      
            <div style={{ background:"#fff",borderRadius:"10px",border:"1px solid #e2e8f0",padding:"12px",fontSize:"13px",color:"#64748b" }}>
              <div style={{ fontWeight:"700",color:"#334155",marginBottom:"6px" }}>Employee Info</div>
              <div><span style={{ fontWeight:"600" }}>Name: </span>{emp.name}</div>
              <div><span style={{ fontWeight:"600" }}>Email: </span>{emp.email}</div>
            </div>

            {isEdited && (
              <button type="button" onClick={handleResetContent}
                style={{ background:"#fff5f5",color:"#dc2626",border:"1px solid #fecaca",borderRadius:"10px",padding:"9px 14px",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px",width:"100%",justifyContent:"center" }}>
                ↺ Reset to Template
              </button>
            )}
          </div>

    
          <div style={{ display:"flex",flexDirection:"column",overflow:"hidden",background:"#f8fafc" }}>
            {/* Toolbar */}
            <div style={{ padding:"10px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:"6px",background:"#fff",flexShrink:0,flexWrap:"wrap" }}>
              <span style={{ fontSize:"11px",fontWeight:"700",color:"#94a3b8",marginRight:"4px",textTransform:"uppercase",letterSpacing:"0.5px" }}>Format</span>
              {[{ icon:<Bold size={13}/>,cmd:"bold" },{ icon:<Italic size={13}/>,cmd:"italic" },{ icon:<Underline size={13}/>,cmd:"underline" }].map(({ icon, cmd }) => (
                <button key={cmd} type="button" onMouseDown={e => { e.preventDefault(); execFormat(cmd); }} style={tbBtn}>{icon}</button>
              ))}
              <div style={{ width:"1px",height:"20px",background:"#e2e8f0",margin:"0 2px" }} />
              {[{ icon:<AlignLeft size={13}/>,cmd:"justifyLeft" },{ icon:<AlignCenter size={13}/>,cmd:"justifyCenter" },{ icon:<AlignRight size={13}/>,cmd:"justifyRight" }].map(({ icon, cmd }) => (
                <button key={cmd} type="button" onMouseDown={e => { e.preventDefault(); execFormat(cmd); }} style={tbBtn}>{icon}</button>
              ))}
<div style={{ width:"1px",height:"20px",background:"#e2e8f0",margin:"0 2px" }} />
  <select defaultValue="" onChange={e => { execFormat("fontSize", e.target.value); e.target.value = ""; }}
 style={{ border:"1px solid #e2e8f0",borderRadius:"6px",padding:"4px 8px",fontSize:"12px",color:"#334155",cursor:"pointer",outline:"none",background:"#fff" }}>
                <option value="" disabled>Size</option>
                <option value="1">Small</option>
                <option value="3">Normal</option>
                <option value="4">Large</option>
                <option value="5">X-Large</option>
                <option value="6">XX-Large</option>
              </select>
              <div style={{ marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px" }}>
                {isEdited && <span style={{ fontSize:"11px",fontWeight:"600",color:"#f59e0b",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"6px",padding:"3px 8px" }}>✎ Edited</span>}
                <span style={{ background:cfg.bg,color:cfg.color,fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"6px" }}>{cfg.label}</span>
              </div>
            </div>
  <div style={{ flex:1,overflowY:"auto",padding:"24px" }}>
              <div style={{ background:"#fff",borderRadius:"14px",border:"1px solid #e2e8f0",padding:"28px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
                <div
                  ref={editorRef}
    contentEditable
    suppressContentEditableWarning
    onInput={handleEditorInput}
      style={{ outline:"none",minHeight:"300px",cursor:"text" }}
                />
              </div>
              <p style={{ fontSize:"11px",color:"#94a3b8",marginTop:"10px",textAlign:"center" }}>
                Click anywhere inside the letter to edit directly
              </p>
            </div>
          </div>
        </div>
  <div style={{ padding:"14px 28px",borderTop:"1px solid #f1f5f9",display:"flex",gap:"10px",justifyContent:"flex-end",flexShrink:0,background:"#fff" }}>
          <button type="button" onClick={onClose}
     style={{ background:"#f1f5f9",color:"#334155",border:"none",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:"pointer" }}>
            Cancel
          </button>
  <button type="button" onClick={() => doAction("update")} disabled={saving}
            style={{ background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:saving?0.6:1 }}>
            <Clock size={14} />Save Changes
          </button>
  <button type="button" onClick={() => doAction("resend")} disabled={saving}
            style={{ background:"#f59e0b",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 20px",fontSize:"14px",fontWeight:"700",cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:saving?0.6:1 }}>
            <Send size={14} />{saving ? "Sending…" : "Send Appreciation"}
          </button>
        </div>
      </div>
    </div>
  );
};
const PreviewSendModal = ({ emp, title, message, appType, onClose, onConfirm, onEdit, sending }) => {
  const c = typeConfig[appType] || typeConfig.general;
  return (
    <div
      onMouseDown={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed",inset:0,background:"rgba(15,23,42,0.6)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(6px)",padding:"16px" }}
    >
      <div
        onMouseDown={e => e.stopPropagation()}
        style={{ background:"#fff",borderRadius:"24px",width:"94vw",maxWidth:"820px",maxHeight:"92vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.25)",overflow:"hidden" }}
      >
<div style={{ padding:"20px 28px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <div>
   <div style={{ fontSize:"17px",fontWeight:"800",color:"#0f172a" }}>Review Before Sending</div> <div style={{ fontSize:"13px",color:"#64748b",marginTop:"2px" }}>
              To: <strong>{emp?.name}</strong> · {emp?.email}
</div>
          </div>
<button type="button" onClick={onClose} style={{ background:"#f1f5f9",border:"none",borderRadius:"8px",padding:"7px 10px",cursor:"pointer" }}>
            <X size={18} color="#64748b" />
          </button>
        </div>
  <div style={{ flex:1,overflowY:"auto",padding:"28px",background:"#f8fafc" }}>
          <div style={{ background:"#fff",borderRadius:"14px",border:"1px solid #e2e8f0",padding:"32px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)" }}>
            <div dangerouslySetInnerHTML={{ __html: buildPreviewHTML(emp, title, message, appType) }} />
</div>
<p style={{ fontSize:"11px",color:"#94a3b8",marginTop:"10px",textAlign:"center" }}>
    This is exactly what the employee will receive in their email.
          </p></div>

  <div style={{ padding:"16px 28px",borderTop:"1px solid #f1f5f9",display:"flex",gap:"10px",justifyContent:"flex-end",flexShrink:0,background:"#fff" }}>
          <button type="button" onClick={onClose}
            style={{ background:"#f1f5f9",color:"#334155",border:"none",borderRadius:"10px",padding:"11px 20px",fontSize:"14px",fontWeight:"600",cursor:"pointer" }}>
            Cancel
          </button>
<button type="button" onClick={onEdit}
            style={{ background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"11px 20px",fontSize:"14px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px" }}>
            <Pencil size={14} />Edit
  </button>
  <button type="button" onClick={onConfirm} disabled={sending}
            style={{ background:c.color,color:"#fff",border:"none",borderRadius:"10px",padding:"11px 22px",fontSize:"14px",fontWeight:"700",cursor:sending?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"7px",opacity:sending?0.65:1 }}>
            <Send size={14} />{sending ? "Sending…" : "Confirm & Send"}
          </button>
        </div>
   </div>
    </div>
  );
};
const AdminAppreciationPage = () => {
  const [employees,   setEmployees]   = useState([]);
const [selectedEmp, setSelectedEmp] = useState(null);
  const [appType,     setAppType]     = useState("general");
const [title,       setTitle]       = useState("");
  const [notes,       setNotes]       = useState("");
  const [searchTerm,  setSearchTerm]  = useState("");
const [activeTab,   setActiveTab]   = useState("compose");
  const [history,     setHistory]     = useState([]);
const [loading,     setLoading]     = useState(true);
  const [sending,     setSending]     = useState(false);
  const [toast,       setToast]       = useState(null);
const [editItem,    setEditItem]    = useState(null);  
const [showPreview, setShowPreview] = useState(false);  
const [editFromPreview, setEditFromPreview] = useState(false); 
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
const fetchHistory = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API}/api/appreciations/history`, { headers: { "x-auth-token": token } });
      const list = res.data?.data ?? res.data ?? [];
      setHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("History fetch failed:", err.message);
    }
  }, []);
useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setLoading(false); return; }
      try {
const res = await axios.get(`${API}/api/employees`, { headers: { "x-auth-token": token } });
 const list = res.data?.data ?? res.data ?? [];
        setEmployees(Array.isArray(list) ? list : []);
      } catch (err) {
        showToast("Failed to load employees", "error");  }
      await fetchHistory();
      setLoading(false);
    };
    load();
  }, [fetchHistory]);
  const handlePreviewClick = () => {
if (!selectedEmp) { showToast("Please select an employee first", "error"); return; }
if (!title.trim()) { showToast("Please enter a title", "error"); return; }
if (!notes.trim()) { showToast("Please enter a message", "error"); return; }
    setShowPreview(true);
  };

const handleConfirmSend = async () => {
try {
      setSending(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/appreciations/send`,
        { toEmail: selectedEmp.email, subject: title.trim(), message: notes.trim(), appreciationType: appType },
        { headers: { "x-auth-token": token } }
      );
if (res.data.success) {
        showToast(res.data.message || "Appreciation sent!");
        setTitle(""); setNotes(""); setSelectedEmp(null);
        setShowPreview(false); setEditFromPreview(false);
        await fetchHistory();
      } else {
showToast(res.data.error || "Failed to send", "error");
      }
    } catch (err) {
  showToast(err.response?.data?.error || "Failed to send", "error");
    } finally {
      setSending(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedEmp) { showToast("Please select an employee", "error"); return; }
    if (!title.trim()) { showToast("Please enter a title", "error"); return; }
    try {
const token = localStorage.getItem("token");
await axios.post(
        `${API}/api/appreciations/draft`,
        { employeeId: selectedEmp.employee_id, employeeName: selectedEmp.name, employeeEmail: selectedEmp.email, title: title.trim(), message: notes.trim(), appreciationType: appType },
        { headers: { "x-auth-token": token } }
      );
showToast("Draft saved successfully");
await fetchHistory();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save draft", "error");
    }
  };
const filteredEmps = employees.filter(e =>
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const s = {
label:   { fontSize:"13px",fontWeight:"600",color:"#64748b",display:"block",marginBottom:"6px" },
select:  { width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"14px",color:"#1e293b",background:"#fff",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer" },
input:   { width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"14px",color:"#1e293b",background:"#f8fafc",fontFamily:"'DM Sans',sans-serif",outline:"none",boxSizing:"border-box" },
textarea:{ width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#1e293b",background:"#fff",fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",minHeight:"80px",boxSizing:"border-box" },
    th:      { padding:"14px 20px",background:"#f8fafc",textAlign:"left",fontSize:"12px",fontWeight:"700",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.5px" },
td:      { padding:"14px 20px",fontSize:"14px",color:"#334155",borderBottom:"1px solid #f8fafc" },
badge:   (color, bg) => ({ background:bg,color,fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"6px",display:"inline-block" }),
    editBtn: { background:"#fffbeb",color:"#d97706",border:"1px solid #fde68a",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",fontWeight:"700",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"5px" },
  };

  return (
    <div className="d-flex bg-light min-vh-100" style={{ fontFamily:"'DM Sans',sans-serif" }}>
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          <div style={{ background:"#fff",borderRadius:"24px",border:"1px solid #e2e8f0",boxShadow:"0 20px 50px rgba(0,0,0,0.02)",overflow:"hidden",minHeight:"calc(100vh - 100px)" }}>
            <header style={{ padding:"32px 32px 20px",borderBottom:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"16px" }}>
                <div>
                  <h1 style={{ fontFamily:"Roboto,sans-serif",fontSize:"26px",fontWeight:"800",color:"#0f172a",margin:0,letterSpacing:"-0.8px" }}>Appreciations</h1>
                  <p style={{ color:"#64748b",fontSize:"14px",marginTop:"6px",marginBottom:0 }}>Send appreciation letters to employees</p>
                </div> <div style={{ display:"flex",gap:"10px" }}>
                  {[
   { label:"Total Sent", value:history.filter(h=>h.status==="sent").length,  color:"#f59e0b", bg:"#fffbeb" },
 { label:"Drafts",     value:history.filter(h=>h.status==="draft").length, color:"#6366f1", bg:"#f5f3ff" },
    ].map((pill, i) => (
                    <div key={i} style={{ background:pill.bg,color:pill.color,borderRadius:"12px",padding:"10px 18px",textAlign:"center" }}>
                      <div style={{ fontSize:"22px",fontWeight:"800" }}>{pill.value}</div>
                      <div style={{ fontSize:"11px",fontWeight:"600" }}>{pill.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </header>
 <div style={{ padding:"24px 32px" }}>
              <div style={{ display:"flex",gap:"4px",marginBottom:"24px",borderBottom:"1px solid #f1f5f9" }}>
                {["compose","history"].map(t => (
                  <button key={t} type="button" onClick={() => setActiveTab(t)}
                    style={{ padding:"10px 20px",fontSize:"14px",fontWeight:activeTab===t?"700":"500",color:activeTab===t?"#f59e0b":"#64748b",borderBottom:activeTab===t?"2px solid #f59e0b":"2px solid transparent",cursor:"pointer",background:"none",border:"none",marginBottom:"-1px",fontFamily:"'DM Sans',sans-serif" }}>
                    {t === "compose" ? "Compose" : "History"}
                  </button>
                ))}
              </div>
              {activeTab === "compose" && (
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"24px" }}>
                  <div style={{ background:"#fff",borderRadius:"18px",border:"1px solid #f1f5f9",padding:"24px" }}>
                    <div style={{ fontSize:"15px",fontWeight:"800",color:"#1e293b",marginBottom:"20px" }}>Details</div>

<label style={s.label}>Appreciation Type</label>
  <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"20px" }}>
{Object.entries(typeConfig).map(([key, c]) => {
                        const active = appType === key;
 return (
    <div key={key} onClick={() => setAppType(key)}
                            style={{ border:active?`2px solid ${c.color}`:"1.5px solid #f1f5f9",borderRadius:"10px",padding:"10px 12px",cursor:"pointer",background:active?c.bg:"#fff",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"8px" }}>
                            <div style={{ width:"8px",height:"8px",borderRadius:"50%",background:c.color,flexShrink:0 }} />
     <span style={{ fontSize:"12px",fontWeight:"700",color:active?c.color:"#64748b" }}>{c.label}</span>
                          </div>
                        );
                      })}</div>
<div style={{ marginBottom:"16px" }}>
                      <label style={s.label}>Select Employee</label>
                      <div style={{ position:"relative",marginBottom:"8px" }}>
                        <Search size={14} style={{ position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8" }} />
                        <input placeholder="Search by name or email…" style={{ ...s.input,paddingLeft:"34px" }} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                      </div>
                      <select style={s.select} value={selectedEmp?.employee_id || ""}
                        onChange={e => { const emp = employees.find(em => String(em.employee_id) === e.target.value); setSelectedEmp(emp || null); setSearchTerm(""); }}>
                        <option value="">-- Choose employee --</option>
                        {filteredEmps.map(emp => (
                          <option key={emp.employee_id} value={emp.employee_id}>{emp.name} — {emp.email}</option>
                        ))}
                      </select>
                    </div>
<div style={{ marginBottom:"16px" }}>
                      <label style={s.label}>Title</label>
                      <input style={s.input} placeholder="e.g. Outstanding Performance" value={title} onChange={e => setTitle(e.target.value)} />
    </div><div style={{ marginBottom:"20px" }}>
                      <label style={s.label}>Message</label>
                      <textarea style={s.textarea} placeholder="Write appreciation message…" value={notes} onChange={e => setNotes(e.target.value)} />
</div>

  <div style={{ display:"flex",gap:"10px",flexWrap:"wrap" }}>
    <button type="button" onClick={handlePreviewClick}
   style={{ background:"#f59e0b",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 20px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px" }}>
       <Eye size={14} />Preview & Send
    </button>
  <button type="button" onClick={handleSaveDraft}
                        style={{ background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px" }}>
                        <Clock size={14} />Draft
                      </button>
   <button type="button" onClick={() => setActiveTab("history")}
                        style={{ background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px" }}>
                        <Award size={14} />History
      </button>
                    </div>
                  </div>
    <div style={{ background:"#fff",borderRadius:"18px",border:"1px solid #f1f5f9",padding:"24px" }}>
                    <div style={{ fontSize:"15px",fontWeight:"800",color:"#1e293b",marginBottom:"16px" }}>Preview</div>
                    <div style={{ border:"1px solid #f1f5f9",borderRadius:"14px",background:"#fff",padding:"24px",minHeight:"380px",overflow:"auto" }}>
                      {selectedEmp && title ? (
                        <div dangerouslySetInnerHTML={{ __html: buildPreviewHTML(selectedEmp, title, notes, appType) }} />
                      ) : (
  <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"300px",color:"#94a3b8",gap:"12px" }}>
  <Award size={40} strokeWidth={1} />
<p style={{ fontSize:"14px" }}>Select employee and add title to preview</p>
 </div>
                      )}
 </div>
                  </div>
                </div>
              )}
{activeTab === "history" && (
  <div style={{ borderRadius:"16px",border:"1px solid #f1f5f9",overflow:"hidden" }}>
<div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%",borderCollapse:"collapse",minWidth:"750px" }}>
                      <thead>
                        <tr>{["Employee","Title","Message","Type","Date","Status","Action"].map(h => (<th key={h} style={s.th}>{h}</th>))}</tr>
  </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="7" style={{ textAlign:"center",padding:"60px",color:"#94a3b8" }}>Loading…</td></tr>
                        ) : history.length > 0 ? history.map((item, i) => {
                          const tc = typeConfig[item.appreciation_type] || typeConfig.general;
                          return (
                            <tr key={i}
                              onMouseOver={e => e.currentTarget.style.backgroundColor="#fcfdfe"}
                              onMouseOut={e  => e.currentTarget.style.backgroundColor="transparent"}>
                              <td style={s.td}>
<div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
  <div style={{ width:"36px",height:"36px",borderRadius:"10px",background:"#f59e0b",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"14px",flexShrink:0 }}>
                                    {item.employee_name?.charAt(0).toUpperCase()}
</div>
                                  <span style={{ fontWeight:"700",color:"#1e293b" }}>{item.employee_name}</span>
                                </div>
      </td>
                              <td style={s.td}>{item.title}</td>
                              <td style={{ ...s.td,maxWidth:"180px" }}>
                                <span style={{ display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{item.message}</span>
        </td>
                              <td style={s.td}>
                                <span style={s.badge(tc.color, tc.bg)}>{tc.label}</span>
        </td>
                              <td style={s.td}>{item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN") : "—"}</td>
                              <td style={s.td}>
    <span style={s.badge(item.status==="sent"?"#10b981":"#f59e0b", item.status==="sent"?"#f0fdf4":"#fffbeb")}>
                                  {item.status === "sent" ? "Sent" : "Draft"}
                                </span>
    </td>
<td style={s.td}>
<button type="button" style={s.editBtn}
  onClick={e => { e.stopPropagation(); setEditItem(item); }}>
                                  <Pencil size={12} />Edit
    </button>
                              </td>
                            </tr>
                          );
 }) : (
                          <tr><td colSpan="7" style={{ textAlign:"center",padding:"60px",color:"#94a3b8" }}>No appreciations yet.</td></tr>
                        )}
                      </tbody>
  </table>
                  </div>
                </div>
              )}
  </div>
          </div>
  </div>
      </PageContent>
      {toast && (
        <div style={{ position:"fixed",bottom:"24px",right:"24px",zIndex:9999,background:toast.type==="error"?"#fee2e2":"#f0fdf4",color:toast.type==="error"?"#dc2626":"#16a34a",border:`1px solid ${toast.type==="error"?"#fca5a5":"#bbf7d0"}`,borderRadius:"12px",padding:"14px 20px",fontSize:"14px",fontWeight:"600",boxShadow:"0 8px 24px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",gap:"8px" }}>
          {toast.type==="error" ? "✕" : <CheckCircle size={16} />}{toast.msg}
        </div>
      )}
      {showPreview && !editFromPreview && (
        <PreviewSendModal
          emp={selectedEmp}
title={title}
  message={notes}
    appType={appType}
onClose={() => setShowPreview(false)}
onConfirm={handleConfirmSend}
          sending={sending}
          onEdit={() => {
            setShowPreview(false);
            setEditFromPreview(true);
          }}
        />
      )}
  {editFromPreview && (
        <EditModal
          item={{
            id: null,
employee_name:  selectedEmp?.name  || "",
employee_email: selectedEmp?.email || "",
designation:    selectedEmp?.designation || "",
department:     selectedEmp?.department  || "",
title,
  message: notes,
appreciation_type: appType,
          }}
          onClose={() => setEditFromPreview(false)}
          onSaved={() => {}}
          showToast={showToast}
        />
      )}
{editItem && (
<EditModal
 item={editItem}
  onClose={() => setEditItem(null)}
  onSaved={fetchHistory}
  showToast={showToast}
        />
      )}
</div>
  );
};

export default AdminAppreciationPage;