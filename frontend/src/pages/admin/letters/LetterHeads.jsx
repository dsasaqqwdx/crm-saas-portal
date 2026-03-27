import React,{useState,useEffect,useCallback,useRef} from "react";
import {FileText,Award,LogOut,Send,Eye,Clock,CheckCircle,Search,Pencil,X,Bold,Italic,Underline,AlignLeft,AlignCenter,AlignRight} from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

const API=process.env.REACT_APP_API_URL||"http://localhost:5001";
const templates={
offer:(emp,date,extra)=>`<div style="font-family:'DM Sans',sans-serif;padding:0;color:#1e293b;font-size:13.5px;line-height:1.85"><div style="background:#6366f1;height:6px;border-radius:4px 4px 0 0;margin-bottom:24px"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px"><div><div style="font-size:20px;font-weight:800;color:#6366f1;letter-spacing:-0.5px">SHNOOR INTERNATIONAL LLC</div><div style="font-size:11px;color:#94a3b8">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div></div><div style="text-align:right;font-size:12px;color:#64748b">Date: ${date}<br/>Ref: SHNOOR/OL/${Date.now().toString().slice(-6)}</div></div><div style="border-top:1px solid #f1f5f9;padding-top:16px;margin-bottom:16px"><strong>To,</strong><br/><strong>${emp.name}</strong><br/>${emp.email}</div><div style="font-weight:700;margin-bottom:12px">Sub: Offer of Employment</div><p>Dear <strong>${emp.name.split(" ")[0]}</strong>,</p><p>We are delighted to offer you the position of <strong>${emp.designation||"Software Engineer"}</strong> at <strong>SHNOOR INTERNATIONAL LLC</strong>. This offer is subject to satisfactory background verification.</p><table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:13px"><tr style="background:#f8fafc"><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600">Position</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${emp.designation||"Software Engineer"}</td></tr><tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600">Department</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${emp.department||"Engineering"}</td></tr><tr style="background:#f8fafc"><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600">CTC (Annual)</td><td style="padding:8px 12px;border:1px solid #e2e8f0">${emp.salary?`&#8377; ${(emp.salary*12).toLocaleString("en-IN")}`:"As per discussion"}</td></tr><tr><td style="padding:8px 12px;border:1px solid #e2e8f0;font-weight:600">Joining Date</td><td style="padding:8px 12px;border:1px solid #e2e8f0">To be communicated separately</td></tr></table>${extra?`<p style="background:#f5f3ff;padding:12px;border-radius:8px;border-left:3px solid #6366f1"><strong>Note:</strong> ${extra}</p>`:""}<p>Kindly sign and return a copy of this letter as your acceptance. We look forward to having you on board.</p><div style="margin-top:32px"><strong>Authorised Signatory</strong><br/><span style="color:#64748b;font-size:12px">HR Department, SHNOOR INTERNATIONAL LLC</span></div></div>`,
experience:(emp,date,extra)=>`<div style="font-family:'DM Sans',sans-serif;padding:0;color:#1e293b;font-size:13.5px;line-height:1.85"><div style="background:#10b981;height:6px;border-radius:4px 4px 0 0;margin-bottom:24px"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px"><div><div style="font-size:20px;font-weight:800;color:#10b981;letter-spacing:-0.5px">SHNOOR INTERNATIONAL LLC</div><div style="font-size:11px;color:#94a3b8">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div></div><div style="text-align:right;font-size:12px;color:#64748b">Date: ${date}<br/>Ref: SHNOOR/EXP/${Date.now().toString().slice(-6)}</div></div><div style="border-top:1px solid #f1f5f9;padding-top:16px;margin-bottom:16px"><strong>To Whom It May Concern</strong></div><div style="font-weight:700;margin-bottom:12px">Sub: Experience Certificate</div><p>This is to certify that <strong>${emp.name}</strong> was employed with <strong>SHNOOR INTERNATIONAL LLC</strong> as <strong>${emp.designation||"Software Engineer"}</strong> in the <strong>${emp.department||"Engineering"}</strong> department.</p><p>During their tenure, <strong>${emp.name.split(" ")[0]}</strong> demonstrated excellent professional skills and a strong work ethic. They have been a valuable contributor to the team.</p><p>We wish them the very best in all their future endeavors.</p>${extra?`<p style="background:#f0fdf4;padding:12px;border-radius:8px;border-left:3px solid #10b981"><strong>Note:</strong> ${extra}</p>`:""}<div style="margin-top:32px"><strong>Authorised Signatory</strong><br/><span style="color:#64748b;font-size:12px">HR Department, SHNOOR INTERNATIONAL LLC</span></div></div>`,
relieving:(emp,date,extra)=>`<div style="font-family:'DM Sans',sans-serif;padding:0;color:#1e293b;font-size:13.5px;line-height:1.85"><div style="background:#3b82f6;height:6px;border-radius:4px 4px 0 0;margin-bottom:24px"></div><div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px"><div><div style="font-size:20px;font-weight:800;color:#3b82f6;letter-spacing:-0.5px">SHNOOR INTERNATIONAL LLC</div><div style="font-size:11px;color:#94a3b8">Plot 12, Sector 44, Gurugram, Delhi NCR | hr@shnoor.com</div></div><div style="text-align:right;font-size:12px;color:#64748b">Date: ${date}<br/>Ref: SHNOOR/REL/${Date.now().toString().slice(-6)}</div></div><div style="border-top:1px solid #f1f5f9;padding-top:16px;margin-bottom:16px"><strong>To,</strong><br/><strong>${emp.name}</strong><br/>${emp.email}</div><div style="font-weight:700;margin-bottom:12px">Sub: Relieving Letter</div><p>Dear <strong>${emp.name.split(" ")[0]}</strong>,</p><p>This is to confirm that you have been formally relieved from your duties as <strong>${emp.designation||"Software Engineer"}</strong> in the <strong>${emp.department||"Engineering"}</strong> department at <strong>SHNOOR INTERNATIONAL LLC</strong> effective <strong>${date}</strong>.</p><p>All company assets and access credentials have been duly returned. Your full and final settlement will be processed within 45 working days.</p>${extra?`<p style="background:#eff6ff;padding:12px;border-radius:8px;border-left:3px solid #3b82f6"><strong>Note:</strong> ${extra}</p>`:""}<div style="margin-top:32px"><strong>Authorised Signatory</strong><br/><span style="color:#64748b;font-size:12px">HR Department, SHNOOR INTERNATIONAL LLC</span></div></div>`,
};
const letterTypeConfig={
offer:{label:"Offer Letter",icon:FileText,color:"#6366f1",bg:"#f5f3ff"},
experience:{label:"Experience Letter",icon:Award,color:"#10b981",bg:"#f0fdf4"},
relieving:{label:"Relieving Letter",icon:LogOut,color:"#3b82f6",bg:"#eff6ff"},
};
const EditModal=({item,onClose,onSaved,showToast})=>{
const today=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});
  const [editType,setEditType]=useState(item.letter_type||item.letterType||"offer");
const [editNotes,setEditNotes]=useState(item.notes||"");
    const [saving,setSaving]=useState(false);
  const [isEdited,setIsEdited]=useState(false);
const editorRef=useRef(null);
      const emp={name:item.employee_name||item.employeeName||"",email:item.employee_email||item.employeeEmail||"",designation:item.designation||"",department:item.department||"",salary:item.salary||null};
const [editableHtml,setEditableHtml]=useState(templates[editType](emp,today,editNotes));
    useEffect(()=>{if(editorRef.current)editorRef.current.innerHTML=editableHtml;},[]);
const handleTypeChange=(newType)=>{
setEditType(newType);
const newHtml=templates[newType](emp,today,editNotes);
setEditableHtml(newHtml);setIsEdited(false);
if(editorRef.current)editorRef.current.innerHTML=newHtml;
};
const handleNotesChange=(newNotes)=>{
setEditNotes(newNotes);
if(!isEdited){const newHtml=templates[editType](emp,today,newNotes);setEditableHtml(newHtml);if(editorRef.current)editorRef.current.innerHTML=newHtml;}
};
const handleResetContent=()=>{
const fresh=templates[editType](emp,today,editNotes);
setEditableHtml(fresh);setIsEdited(false);
if(editorRef.current)editorRef.current.innerHTML=fresh;
};const handleEditorInput=()=>setIsEdited(true);
const execFormat=(command,value=null)=>{
document.execCommand(command,false,value);
if(editorRef.current){setEditableHtml(editorRef.current.innerHTML);setIsEdited(true);}
editorRef.current?.focus();
};     const handleAction=async(action)=>{
setSaving(true);
try{
const token=localStorage.getItem("token");
      const htmlContent=editorRef.current?editorRef.current.innerHTML:editableHtml;
const endpoint=action==="resend"?`${API}/api/letters/send`:`${API}/api/letters/draft`;
await axios.post(endpoint,{employeeId:item.employee_id||item.employeeId,employeeEmail:emp.email,employeeName:emp.name,letterType:editType,htmlContent,notes:editNotes,...(item.id?{originalId:item.id}:{})},{headers:{"x-auth-token":token}});
showToast(action==="resend"?`Letter re-sent to ${emp.email}`:"Saved as draft");
onSaved(htmlContent);onClose();
}catch(err){showToast(err.response?.data?.message||"Action failed","error");}
finally{setSaving(false);}
};
const cfg=letterTypeConfig[editType];
const tbBtn={background:"none",border:"1px solid #e2e8f0",borderRadius:"6px",padding:"5px 8px",cursor:"pointer",color:"#334155",display:"flex",alignItems:"center",justifyContent:"center"};
return(
<div onMouseDown={e=>e.target===e.currentTarget&&onClose()}
style={{position:"fixed",inset:0,background:"rgba(15,23,42,0.55)",zIndex:10000,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",padding:"16px"}}>
<div onMouseDown={e=>e.stopPropagation()}
style={{background:"#fff",borderRadius:"24px",width:"94vw",maxWidth:"1120px",height:"90vh",display:"flex",flexDirection:"column",boxShadow:"0 32px 80px rgba(0,0,0,0.22)",overflow:"hidden"}}>
<div style={{padding:"20px 28px",borderBottom:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
<div>
<div style={{fontSize:"17px",fontWeight:"800",color:"#0f172a"}}>Edit Letter</div>
<div style={{fontSize:"13px",color:"#64748b",marginTop:"2px"}}>For <strong>{emp.name}</strong> · {emp.email}</div>
</div>
<button type="button" onClick={onClose} style={{background:"#f1f5f9",border:"none",borderRadius:"8px",padding:"6px 10px",cursor:"pointer",color:"#64748b"}}><X size={18}/></button>
</div>
<div style={{display:"grid",gridTemplateColumns:"290px 1fr",flex:1,minHeight:0,overflow:"hidden"}}>
<div style={{padding:"20px",borderRight:"1px solid #f1f5f9",overflowY:"auto",display:"flex",flexDirection:"column",gap:"16px",background:"#fafafa"}}>
<div>
<label style={{fontSize:"11px",fontWeight:"700",color:"#94a3b8",display:"block",marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Letter Type</label>
<div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
{Object.entries(letterTypeConfig).map(([key,c])=>{
const Icon=c.icon;const active=editType===key;
return(<button key={key} type="button" onClick={()=>handleTypeChange(key)}
style={{border:active?`2px solid ${c.color}`:"1.5px solid #e2e8f0",borderRadius:"10px",padding:"9px 12px",cursor:"pointer",background:active?c.bg:"#fff",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"8px",width:"100%",textAlign:"left"}}>
<div style={{width:"30px",height:"30px",borderRadius:"8px",background:active?c.bg:"#f1f5f9",color:c.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Icon size={14}/></div>
<span style={{fontSize:"13px",fontWeight:"700",color:active?c.color:"#1e293b"}}>{c.label}</span>
</button>);
})}
</div>
</div>
<div>
<label style={{fontSize:"11px",fontWeight:"700",color:"#94a3b8",display:"block",marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Additional Notes</label>
<textarea value={editNotes} onChange={e=>handleNotesChange(e.target.value)} placeholder="Add or update custom notes..."
style={{width:"100%",padding:"10px 12px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#1e293b",fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",minHeight:"90px",boxSizing:"border-box",background:"#fff"}}/>
</div>
<div style={{background:"#fff",borderRadius:"10px",border:"1px solid #e2e8f0",padding:"12px",fontSize:"13px",color:"#64748b"}}>
<div style={{fontWeight:"700",color:"#334155",marginBottom:"6px"}}>Employee Info</div>
<div><span style={{fontWeight:"600"}}>Name: </span>{emp.name}</div>
<div><span style={{fontWeight:"600"}}>Email: </span>{emp.email}</div>
{emp.designation&&<div><span style={{fontWeight:"600"}}>Designation: </span>{emp.designation}</div>}
{emp.department&&<div><span style={{fontWeight:"600"}}>Department: </span>{emp.department}</div>}
</div>
{isEdited&&(
<button type="button" onClick={handleResetContent}
style={{background:"#fff5f5",color:"#dc2626",border:"1px solid #fecaca",borderRadius:"10px",padding:"9px 14px",fontSize:"13px",fontWeight:"600",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"6px",width:"100%",justifyContent:"center"}}>
↺ Reset to Template
</button>
)}
</div>
<div style={{display:"flex",flexDirection:"column",overflow:"hidden",background:"#f8fafc"}}>
<div style={{padding:"10px 20px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",gap:"6px",background:"#fff",flexShrink:0,flexWrap:"wrap"}}>
<span style={{fontSize:"11px",fontWeight:"700",color:"#94a3b8",marginRight:"4px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Format</span>
{[{icon:<Bold size={13}/>,cmd:"bold"},{icon:<Italic size={13}/>,cmd:"italic"},{icon:<Underline size={13}/>,cmd:"underline"}].map(({icon,cmd})=>(
<button key={cmd} type="button" onMouseDown={e=>{e.preventDefault();execFormat(cmd);}} style={tbBtn}>{icon}</button>
))}
<div style={{width:"1px",height:"20px",background:"#e2e8f0",margin:"0 2px"}}/>
{[{icon:<AlignLeft size={13}/>,cmd:"justifyLeft"},{icon:<AlignCenter size={13}/>,cmd:"justifyCenter"},{icon:<AlignRight size={13}/>,cmd:"justifyRight"}].map(({icon,cmd})=>(
<button key={cmd} type="button" onMouseDown={e=>{e.preventDefault();execFormat(cmd);}} style={tbBtn}>{icon}</button>
))}
<div style={{width:"1px",height:"20px",background:"#e2e8f0",margin:"0 2px"}}/>
<select defaultValue="" onChange={e=>{execFormat("fontSize",e.target.value);e.target.value="";}}
style={{border:"1px solid #e2e8f0",borderRadius:"6px",padding:"4px 8px",fontSize:"12px",color:"#334155",cursor:"pointer",outline:"none",background:"#fff"}}>
<option value="" disabled>Size</option>
<option value="1">Small</option><option value="3">Normal</option><option value="4">Large</option><option value="5">X-Large</option><option value="6">XX-Large</option>
</select>
<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px"}}>
{isEdited&&<span style={{fontSize:"11px",fontWeight:"600",color:"#f59e0b",background:"#fffbeb",border:"1px solid #fde68a",borderRadius:"6px",padding:"3px 8px"}}>✎ Edited</span>}
<span style={{background:cfg.bg,color:cfg.color,fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"6px"}}>{cfg.label}</span>
</div>
</div>
<div style={{flex:1,overflowY:"auto",padding:"24px"}}>
<div style={{background:"#fff",borderRadius:"14px",border:"1px solid #e2e8f0",padding:"28px",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
<div ref={editorRef} contentEditable suppressContentEditableWarning onInput={handleEditorInput} style={{outline:"none",minHeight:"300px",cursor:"text"}}/>
</div>
<p style={{fontSize:"11px",color:"#94a3b8",marginTop:"10px",textAlign:"center"}}> Click anywhere inside the letter to edit directly</p>
</div>
</div>
</div>
<div style={{padding:"14px 28px",borderTop:"1px solid #f1f5f9",display:"flex",gap:"10px",justifyContent:"flex-end",flexShrink:0,background:"#fff"}}>
<button type="button" onClick={onClose} style={{background:"#f1f5f9",color:"#334155",border:"none",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>Cancel</button>
<button type="button" onClick={()=>handleAction("draft")} disabled={saving}
style={{background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:saving?0.6:1}}>
<Clock size={14}/>Save as Draft
</button>
<button type="button" onClick={()=>handleAction("resend")} disabled={saving}
style={{background:"#6366f1",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 20px",fontSize:"14px",fontWeight:"700",cursor:saving?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:"6px",opacity:saving?0.6:1}}>
<Send size={14}/>{saving?"Sending…":"Edited Letter Send"}
</button>
</div>
</div>
</div>
);
};

const LetterHeads=()=>{
const [employees,setEmployees]=useState([]);
const [loading,setLoading]=useState(true);
const [sending,setSending]=useState(false);
  const [selectedEmp,setSelectedEmp]=useState(null);
    const [letterType,setLetterType]=useState("offer");
const [notes,setNotes]=useState("");
const [searchTerm,setSearchTerm]=useState("");
const [activeTab,setActiveTab]=useState("compose");
      const [history,setHistory]=useState([]);
const [toast,setToast]=useState(null);
    const [editItem,setEditItem]=useState(null);
const [customHtml,setCustomHtml]=useState(null);
const today=new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"});

const fetchHistory=useCallback(async(token)=>{
try{
const res=await axios.get(`${API}/api/letters/history`,{headers:{"x-auth-token":token}});
const list=res.data?.data??res.data??[];
setHistory(Array.isArray(list)?list:[]);
}catch(err){console.warn("Letter history fetch failed:",err.message);}
},[]);

useEffect(()=>{
const load=async()=>{
const token=localStorage.getItem("token");
try{
const res=await axios.get(`${API}/api/employees`,{headers:{"x-auth-token":token}});
const list=res.data?.data??res.data??[];
setEmployees(Array.isArray(list)?list:[]);
}catch(err){console.error("Failed to load employees:",err);}
await fetchHistory(token);
setLoading(false);
};
load();
},[fetchHistory]);

const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3500);};
const handleSend=async()=>{
if(!selectedEmp)return showToast("Please select an employee","error");
setSending(true);
try{
const token=localStorage.getItem("token");
const htmlContent=customHtml||templates[letterType](selectedEmp,today,notes);
await axios.post(`${API}/api/letters/send`,{employeeId:selectedEmp.employee_id,employeeEmail:selectedEmp.email,employeeName:selectedEmp.name,letterType,htmlContent,notes},{headers:{"x-auth-token":token}});
showToast(`${letterTypeConfig[letterType].label} sent to ${selectedEmp.email}`);
await fetchHistory(token);setNotes("");
}catch(err){showToast(err.response?.data?.message||"Failed to send letter","error");}
finally{setSending(false);}
};

const handleSaveDraft=async()=>{
if(!selectedEmp)return showToast("Please select an employee","error");
try{
const token=localStorage.getItem("token");
const htmlContent=templates[letterType](selectedEmp,today,notes);
await axios.post(`${API}/api/letters/draft`,{employeeId:selectedEmp.employee_id,employeeName:selectedEmp.name,employeeEmail:selectedEmp.email,letterType,htmlContent,notes},{headers:{"x-auth-token":token}});
showToast("Draft saved successfully");
}catch(err){showToast("Failed to save draft","error");}
};

const filteredEmployees=employees.filter(e=>e.name?.toLowerCase().includes(searchTerm.toLowerCase())||e.email?.toLowerCase().includes(searchTerm.toLowerCase()));
const cfg=letterTypeConfig[letterType];

const s={
cardTitle:{fontSize:"15px",fontWeight:"800",color:"#1e293b",marginBottom:"20px"},
ltGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"20px"},
ltCard:(active,color,bg)=>({border:active?`2px solid ${color}`:"1.5px solid #f1f5f9",borderRadius:"12px",padding:"12px 14px",cursor:"pointer",background:active?bg:"#fff",transition:"all 0.15s",display:"flex",alignItems:"center",gap:"10px"}),
iconBox:(bg,color)=>({width:"36px",height:"36px",borderRadius:"10px",background:bg,color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}),
label:{fontSize:"13px",fontWeight:"600",color:"#64748b",display:"block",marginBottom:"6px"},
select:{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"14px",color:"#1e293b",background:"#fff",fontFamily:"'DM Sans',sans-serif",outline:"none",cursor:"pointer"},
input:{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"14px",color:"#1e293b",background:"#f8fafc",fontFamily:"'DM Sans',sans-serif",outline:"none"},
textarea:{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #e2e8f0",fontSize:"13px",color:"#1e293b",background:"#fff",fontFamily:"'DM Sans',sans-serif",outline:"none",resize:"vertical",minHeight:"80px"},
btnPrimary:{background:"#6d63f1",color:"#fff",border:"none",borderRadius:"10px",padding:"10px 20px",fontSize:"14px",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},
btnSec:{background:"#f8fafc",color:"#334155",border:"1px solid #e2e8f0",borderRadius:"10px",padding:"10px 18px",fontSize:"14px",fontWeight:"600",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px"},
previewBox:{border:"1px solid #f1f5f9",borderRadius:"14px",background:"#fff",padding:"24px",minHeight:"380px",overflow:"auto"},
th:{padding:"14px 20px",background:"#f8fafc",textAlign:"left",fontSize:"12px",fontWeight:"700",color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.5px"},
td:{padding:"14px 20px",fontSize:"14px",color:"#334155",borderBottom:"1px solid #f8fafc"},
badge:(color,bg)=>({background:bg,color,fontSize:"11px",fontWeight:"700",padding:"3px 10px",borderRadius:"6px",display:"inline-block"}),
editBtn:{background:"#f5f3ff",color:"#6366f1",border:"1px solid #ede9fe",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",fontWeight:"700",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:"5px"},
};

return(
<div className="d-flex bg-light min-vh-100" style={{fontFamily:"'DM Sans',sans-serif"}}>
<Sidebar/>
<PageContent>
<div className="container-fluid px-3 px-md-4 py-4">

<div style={{background:"#fff",borderRadius:"24px",border:"1px solid #e2e8f0",boxShadow:"0 20px 50px rgba(0,0,0,0.02)",overflow:"hidden",minHeight:"calc(100vh - 100px)"}}>

<header style={{padding:"32px 32px 20px",borderBottom:"1px solid #f1f5f9"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"16px"}}>
<div>
<h1 style={{fontFamily:"Roboto,sans-serif",fontSize:"26px",fontWeight:"800",color:"#0f172a",margin:0,letterSpacing:"-0.8px"}}>Letter Management</h1>
<p style={{color:"#64748b",fontSize:"14px",marginTop:"6px",marginBottom:0}}>Assign and send official letters to employees via email</p>
</div>
<div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
{[{label:"Total Sent",value:history.filter(h=>h.status==="sent").length,color:"#6366f1",bg:"#f5f3ff"},{label:"Drafts",value:history.filter(h=>h.status==="draft").length,color:"#f59e0b",bg:"#fffbeb"}].map((pill,i)=>(
<div key={i} style={{background:pill.bg,color:pill.color,borderRadius:"12px",padding:"10px 18px",textAlign:"center"}}>
<div style={{fontSize:"22px",fontWeight:"800"}}>{pill.value}</div>
<div style={{fontSize:"11px",fontWeight:"600"}}>{pill.label}</div>
</div>
))}
</div>
</div>
</header>

<div style={{padding:"24px 32px"}}>
<div style={{display:"flex",gap:"4px",marginBottom:"24px",borderBottom:"1px solid #f1f5f9"}}>
{["compose","history"].map(t=>(
<button key={t} type="button" onClick={()=>setActiveTab(t)}
style={{padding:"10px 20px",fontSize:"14px",fontWeight:activeTab===t?"700":"500",color:activeTab===t?"#6366f1":"#64748b",borderBottom:activeTab===t?"2px solid #6366f1":"2px solid transparent",cursor:"pointer",background:"none",border:"none",marginBottom:"-1px",transition:"color 0.2s",fontFamily:"'DM Sans',sans-serif"}}>
{t==="compose"?"Compose Letter":"Letter History"}
</button>
))}
</div>

{activeTab==="compose"&&(
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"24px"}}>
<div style={{background:"#fff",borderRadius:"18px",border:"1px solid #f1f5f9",padding:"24px"}}>
<div style={s.cardTitle}>Letter Details</div>
<label style={s.label}>Letter Type</label>
<div style={s.ltGrid}>
{Object.entries(letterTypeConfig).map(([key,cfg2])=>{
const Icon=cfg2.icon;const active=letterType===key;
return(<div key={key} style={s.ltCard(active,cfg2.color,cfg2.bg)} onClick={()=>setLetterType(key)}>
<div style={s.iconBox(active?cfg2.bg:"#f8fafc",cfg2.color)}><Icon size={16}/></div>
<div style={{fontSize:"13px",fontWeight:"700",color:active?cfg2.color:"#1e293b"}}>{cfg2.label}</div>
</div>);
})}
</div>
<div style={{marginBottom:"16px"}}>
<label style={s.label}>Select Employee</label>
<div style={{position:"relative",marginBottom:"8px"}}>
<Search size={14} style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"#94a3b8"}}/>
<input placeholder="Search by name or email..." style={{...s.input,paddingLeft:"34px"}} value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
</div>
<select style={s.select} value={selectedEmp?.employee_id||""} onChange={e=>{const emp=employees.find(em=>String(em.employee_id)===e.target.value);setSelectedEmp(emp||null);setSearchTerm("");}}>
<option value="">-- Choose employee --</option>
{filteredEmployees.map(emp=>(<option key={emp.employee_id} value={emp.employee_id}>{emp.name} — {emp.email}</option>))}
</select>
</div>
<div style={{marginBottom:"16px"}}>
<label style={s.label}>Send to Email</label>
<input style={{...s.input,background:"#f8fafc"}} value={selectedEmp?.email||""} readOnly placeholder="Auto-filled from employee record"/>
</div>
<div style={{marginBottom:"20px"}}>
<label style={s.label}>Additional Notes (optional)</label>
<textarea style={s.textarea} placeholder="Add any custom note..." value={notes} onChange={e=>setNotes(e.target.value)}/>
</div>
<div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
<button type="button" style={s.btnPrimary} onClick={handleSend} disabled={sending}><Send size={14}/>{sending?"Sending...":"Send via Email"}</button>
<button type="button" style={s.btnSec} onClick={handleSaveDraft}><Clock size={14}/>Save Draft</button>
<button type="button" style={s.btnSec} onClick={()=>setActiveTab("history")}><Eye size={14}/>View History</button>
</div>
</div>
<div style={{background:"#fff",borderRadius:"18px",border:"1px solid #f1f5f9",padding:"24px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px",flexWrap:"wrap",gap:"8px"}}>
<div style={s.cardTitle}>Letter Preview</div>
{selectedEmp&&(
<div style={{display:"flex",alignItems:"center",gap:"10px"}}>
<span style={s.badge(cfg.color,cfg.bg)}>{cfg.label}</span>
<button type="button" style={s.editBtn} onClick={()=>setEditItem({employee_id:selectedEmp.employee_id,employee_name:selectedEmp.name,employee_email:selectedEmp.email,designation:selectedEmp.designation,department:selectedEmp.department,salary:selectedEmp.salary,letterType,notes})}>
<Pencil size={12}/>Edit
</button>
</div>
)}
</div>
<div style={s.previewBox}>
{selectedEmp?(
<div dangerouslySetInnerHTML={{__html:templates[letterType](selectedEmp,today,notes)}}/>
):(
<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"300px",color:"#94a3b8",gap:"12px"}}>
<FileText size={40} strokeWidth={1}/>
<p style={{fontSize:"14px"}}>Select an employee to preview the letter</p>
</div>
)}
</div>
</div>
</div>
)}

{activeTab==="history"&&(
<div style={{borderRadius:"16px",border:"1px solid #f1f5f9",overflow:"hidden"}}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",minWidth:"650px"}}>
<thead>
<tr>{["Employee","Email","Letter Type","Date","Status","Action"].map(h=>(<th key={h} style={s.th}>{h}</th>))}</tr>
</thead>
<tbody>
{loading?(
<tr><td colSpan="6" style={{textAlign:"center",padding:"60px",color:"#94a3b8"}}>Loading history...</td></tr>
):history.length>0?history.map((item,i)=>{
const name=item.employee_name||item.employeeName||"";
const email=item.employee_email||item.employeeEmail||"";
const type=item.letter_type||item.letterType||"offer";
const date=item.created_at||item.createdAt||item.sent_at;
const lc=letterTypeConfig[type]||letterTypeConfig.offer;
return(
<tr key={i} onMouseOver={e=>e.currentTarget.style.backgroundColor="#fcfdfe"} onMouseOut={e=>e.currentTarget.style.backgroundColor="transparent"}>
<td style={s.td}>
<div style={{display:"flex",alignItems:"center",gap:"10px"}}>
<div style={{width:"36px",height:"36px",borderRadius:"10px",background:"#6366f1",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"700",fontSize:"14px",flexShrink:0}}>{name.charAt(0).toUpperCase()}</div>
<span style={{fontWeight:"700",color:"#1e293b"}}>{name}</span>
</div>
</td>
<td style={s.td}>{email}</td>
<td style={s.td}><span style={s.badge(lc.color,lc.bg)}>{lc.label}</span></td>
<td style={s.td}>{date?new Date(date).toLocaleDateString("en-IN"):"—"}</td>
<td style={s.td}><span style={s.badge(item.status==="sent"?"#10b981":"#f59e0b",item.status==="sent"?"#f0fdf4":"#fffbeb")}>{item.status==="sent"?"Sent":"Draft"}</span></td>
<td style={s.td}><button type="button" style={s.editBtn} onClick={e=>{e.stopPropagation();setEditItem(item);}}><Pencil size={12}/>Edit</button></td>
</tr>
);
}):(
<tr><td colSpan="6" style={{textAlign:"center",padding:"60px",color:"#94a3b8"}}>No letters sent yet.</td></tr>
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

{toast&&(
<div style={{position:"fixed",bottom:"24px",right:"24px",zIndex:9999,background:toast.type==="error"?"#fee2e2":"#f0fdf4",color:toast.type==="error"?"#dc2626":"#16a34a",border:`1px solid ${toast.type==="error"?"#fca5a5":"#bbf7d0"}`,borderRadius:"12px",padding:"14px 20px",fontSize:"14px",fontWeight:"600",boxShadow:"0 8px 24px rgba(0,0,0,0.08)",display:"flex",alignItems:"center",gap:"8px"}}>
{toast.type==="error"?"✕":<CheckCircle size={16}/>}{toast.msg}
</div>
)}
{editItem&&(
<EditModal item={editItem} onClose={()=>setEditItem(null)} onSaved={(html)=>{setCustomHtml(html);fetchHistory(localStorage.getItem("token"));}} showToast={showToast}/>
)}
</div>
);
};

export default LetterHeads;
