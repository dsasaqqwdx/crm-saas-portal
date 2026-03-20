import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import { MessageCircle, X, Send, AlertCircle, RefreshCw, Paperclip, Download, FileText, Image, History, Plus, ChevronLeft, Clock, MessageSquare, Loader, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const EMOJIS = ["👍","👎","❤️","😂","😮","😢","🔥","✅"];

const QA = [
  { kw:["hi","hello","hey","good morning","good afternoon","good evening","howdy"], ans:" Hello! Welcome to Shnoor chatbot. How can I help you today? I am able to help u with questions related to  company policies, leave, attendance, or technical support." },
  { kw:["bye","goodbye","see you","take care","thanks bye","thank you bye"], ans:"Goodbye! Have a great day! Feel free to come back anytime you need help. " },
  { kw:["how are you","how r u","how are u","how do you do","what's up","whats up"], ans:"I'm doing great, thank you for asking!  I'm here and ready to help you with any  questions. What can I assist you with today?" },
  { kw:["thank you","thanks","thank u","thankyou","thx","ty"], ans:"You're welcome! Is there anything else I can help you with?" },
  { kw:["who are you","what are you","what is your name","who r u"], ans:"I'm the Shnoor chatbot — an AI-powered chatbot here to help employees  with company policies, leave, attendance, and technical support. How can I help you?" },
  { kw:["how many leaves","total leaves","leave balance","annual leave","how many days leave","leave days"], ans:" **Leave Entitlements:**\n\n• **Annual Leave:** 20 days per year\n• **Sick Leave:** 10 days per year\n• **Casual Leave:** 5 days per year\n• **Maternity Leave:** 90 days\n• **Paternity Leave:** 5 days\n\nLeave balances reset every January 1st. Unused annual leave can be carried forward up to 5 days." },
  { kw:["how to apply leave","apply for leave","leave application","how do i apply","request leave","leave request"], ans:"**How to Apply for Leave:**\n\n1. Login to your Employee Dashboard\n2. Click on **'Leaves'** in the sidebar\n3. Click **'Apply Leave'** button\n4. Select leave type, start date, and end date\n5. Add a reason and submit\n\nYour admin will be notified and will approve or reject within 24 hours." },
  { kw:["sick leave","medical leave","i am sick","not feeling well","doctor leave"], ans:"**Sick Leave Policy:**\n\n• You are entitled to **10 sick days** per year\n• For sick leave up to 2 days: No medical certificate required\n• For sick leave 3+ days: Medical certificate must be submitted within 3 days of returning\n• Notify your manager via the leave system before 9 AM if possible" },
  { kw:["leave approval","who approves","leave status","pending leave","leave approved"], ans:" **Leave Approval Process:**\n\n• Leave requests are reviewed by your **Company Admin**\n• Approval typically takes **24 hours**\n• You'll see status as Pending → Approved/Rejected in your dashboard\n• For urgent leave, please contact your admin directly" },
  { kw:["how to mark attendance","mark attendance","attendance","check in","how to check in"], ans:"**How to Mark Attendance:**\n\n1. Login to your Employee Dashboard\n2. Click **'My Attendance'** in the sidebar\n3. Click **'Mark Present'** button\n4. Attendance must be marked **before 10:00 AM** daily\n\n Late marking (after 10 AM) will be recorded as Late. Missing marking will be recorded as Absent." },
  { kw:["attendance not marked","forgot attendance","missed attendance","attendance correction","wrong attendance"], ans:"**Attendance Not Marked?**\n\nIf you forgot to mark attendance or it shows incorrectly:\n\n1. Contact your **Admin immediately**\n2. Provide the date and reason\n3. Admin can manually correct attendance records\n\nFor repeated issues, please raise a support ticket by clicking **Contact Support Team** below." },
  { kw:["working hours","office hours","what time","office timing","work time","shift timing"], ans:"**Working Hours:**\n\n• **Monday to Friday:** 9:00 AM – 6:00 PM\n• **Saturday & Sunday:** Off (Weekend)\n• **Lunch Break:** 1:00 PM – 2:00 PM\n• Total working hours: **8 hours per day**\n\nFlexible timing may apply for certain roles — check with your manager." },
  { kw:["work from home","wfh","remote work","work remotely","home office","work from home policy"], ans:"**Work From Home Policy:**\n\n• WFH is available **every Friday** with prior manager approval\n• Request must be submitted **by Thursday 5 PM**\n• Maximum **4 WFH days per month**\n• Internet and equipment are employee's responsibility during WFH\n• Full availability on calls and messages is required during WFH" },
  { kw:["notice period","resignation","how to resign","last working day","exit","quit job"], ans:"**Resignation & Notice Period:**\n\n• **Notice Period:** 30 days (1 month)\n• Submit your resignation letter to HR and your manager\n• Notice period buyout is possible with management approval\n• Full & Final settlement is processed within 45 days of last working day\n\nFor resignation formalities, please contact HR directly." },
  { kw:["probation","probation period","new employee","joining","probationary"], ans:"**Probation Period Policy:**\n\n• All new employees serve a **3-month probation period**\n• Performance review is conducted at end of probation\n• Leave entitlements are limited during probation (5 days only)\n• Confirmation letter is issued after successful completion" },
  { kw:["salary","payroll","when is salary","salary date","pay day","when do i get paid"], ans:"**Payroll Information:**\n\n• Salary is processed on the **last working day** of every month\n• Salary slip is available in your Employee Dashboard under **Payroll**\n• Salary is credited to your registered bank account\n• Any salary discrepancies must be reported within **5 days** of credit" },
  { kw:["salary slip","payslip","pay slip","download salary","salary document"], ans:"**To Access Your Salary Slip:**\n\n1. Login to Employee Dashboard\n2. Click **'Payroll'** in the sidebar\n3. Select the month\n4. Click **Download** to get your salary slip as PDF\n\nSlips are available from the date of joining onwards." },
  { kw:["holiday","holidays","public holiday","national holiday","holiday list","upcoming holiday"], ans:" **Company Holidays:**\n\nYou can view all upcoming holidays in your dashboard:\n\n1. Login to Employee Dashboard\n2. Click **'Holidays'** in the sidebar\n3. Full holiday calendar for the year is listed there\n\nThe company follows national public holidays plus additional company-specific holidays." },
];

const OUTSCOPE = ["weather","news","cricket","movie","film","food","recipe","sports","stock","bitcoin","crypto","politics","election","song","music","game","meme","joke","love","relationship","marriage","personal"];
const QQUICK = ["What is the leave policy?","How to mark attendance?","What are the working hours?","Work from home policy?","When is salary credited?","How to apply for leave?"];

const WELCOME = { role:"assistant", content:" Hi! I'm your Shnoor Chatbot. I can answer questions about **company policies, leave, attendance, and payroll**.\n\nWhat would you like to know?", timestamp:new Date().toISOString() };

const getTok = () => localStorage.getItem("token");
const getUid = () => localStorage.getItem("user_id") || null;
const getName = () => localStorage.getItem("name") || "User";
const hdrs = () => ({ "x-auth-token": getTok() });

function toArr(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch { return []; }
}
function toObj(x) {
  if (!x) return {};
  if (typeof x==="object"&&!Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch { return {}; }
}

function buildThread(ticket, uid) {
  const msgs = toArr(ticket.messages)
    .map((m,i) => ({...m, _src:"messages", _i:i}))
    .filter(m => !(m.deletedFor||[]).includes(uid))
    .map(m => ({ role: m.role==="admin"?"admin":m.role==="assistant"?"assistant":"user", content:String(m.content||""), timestamp:m.timestamp||ticket.created_at, _src:m._src, _i:m._i }));

  const conv = toArr(ticket.conversation)
    .map((c,i) => ({...c, _src:"conversation", _i:i}))
    .filter(c => !(c.deletedFor||[]).includes(uid))
    .map(c => ({ role:"admin", content:` **${c.sender||"Admin"} replied:** ${c.content}`, timestamp:c.timestamp||ticket.updated_at, _src:c._src, _i:c._i }));

  return [...msgs, ...conv];
}

function findQA(txt) {
  const low = txt.toLowerCase().trim();
  for (const q of QA) { if (q.kw.some(k => low.includes(k))) return q.ans; }
  return null;
}
function outScope(txt) { return OUTSCOPE.some(k => txt.toLowerCase().includes(k)); }
function fileSz(b) {
  if (!b) return "";
  if (b<1024) return b+" B";
  if (b<1048576) return (b/1024).toFixed(1)+" KB";
  return (b/1048576).toFixed(1)+" MB";
}
function isImg(ft) { return ft&&ft.startsWith("image/"); }
const fmtTime = iso => new Date(iso).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
const fmtDate = iso => {
  const d=new Date(iso), t=new Date(), y=new Date(t);
  y.setDate(t.getDate()-1);
  if (d.toDateString()===t.toDateString()) return "Today";
  if (d.toDateString()===y.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
};
const renderTxt = c => String(c).replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br/>");
const dot = d => ({ width:7, height:7, borderRadius:"50%", background:"#94a3b8", display:"inline-block", animation:`bounce 1.2s ${d}s infinite` });

const SC = { open:"#22c55e", inprogress:"#f59e0b", closed:"#94a3b8" };
const SL = { open:"Open", inprogress:"In Progress", closed:"Closed" };

function EmojiBar({ onPick, onClose }) {
  useEffect(() => {
    const fn = e => { if(e.key==="Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div style={{ position:"absolute", zIndex:9999, bottom:"calc(100% + 6px)", background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", padding:"6px 8px", display:"flex", gap:2 }}>
      {EMOJIS.map(e=>(
        <button key={e} onClick={() => { onPick(e); onClose(); }}
          style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:18, padding:"4px 5px", borderRadius:8, lineHeight:1 }}
          onMouseEnter={ev=>ev.currentTarget.style.background="#f1f5f9"}
          onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>{e}</button>
      ))}
    </div>
  );
}

function RxnBar({ rxns, msgKey, uid, onReact }) {
  if (!rxns?.[msgKey]) return null;
  const entries = Object.entries(rxns[msgKey]).filter(([,ids])=>ids.length);
  if (!entries.length) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:4 }}>
      {entries.map(([emoji,ids]) => {
        const mine = ids.includes(uid);
        return (
          <button key={emoji} onClick={()=>onReact(msgKey,emoji)}
            style={{ background:mine?"#e0e7ff":"#f1f5f9", border:mine?"1px solid #a5b4fc":"1px solid #e2e8f0", borderRadius:20, padding:"2px 7px", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:3 }}
            onMouseEnter={e=>e.currentTarget.style.background=mine?"#c7d2fe":"#e2e8f0"}
            onMouseLeave={e=>e.currentTarget.style.background=mine?"#e0e7ff":"#f1f5f9"}>
            <span style={{ fontSize:13 }}>{emoji}</span>
            <span style={{ color:mine?"#4f46e5":"#64748b", fontWeight:mine?700:500 }}>{ids.length}</span>
          </button>
        );
      })}
    </div>
  );
}

function DelMenu({ x, y, canAll, onMe, onAll, onClose }) {
  useEffect(() => {
    const fn = () => onClose();
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [onClose]);
  const b = { display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, textAlign:"left" };
  return (
    <div onClick={e=>e.stopPropagation()}
      style={{ position:"fixed", top:y, left:x, zIndex:99999, background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", minWidth:180, overflow:"hidden" }}>
      <button onClick={onMe} style={{ ...b, color:"#1e293b" }}
        onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <Trash2 size={13} color="#64748b" /> Delete for me
      </button>
      {canAll && (
        <button onClick={onAll} style={{ ...b, color:"#ef4444", borderTop:"1px solid #f1f5f9" }}
          onMouseEnter={e=>e.currentTarget.style.background="#fff1f2"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <Trash2 size={13} color="#ef4444" /> Delete for everyone
        </button>
      )}
    </div>
  );
}

function HistPanel({ tickets, activeTid, onSel, onNew, onClose, loading }) {
  const grp = {};
  tickets.forEach(t => { const l=fmtDate(t.created_at); if(!grp[l])grp[l]=[]; grp[l].push(t); });
  return (
    <div style={{ position:"absolute", inset:0, zIndex:10, background:"#fff", display:"flex", flexDirection:"column", borderRadius:16, overflow:"hidden" }}>
      <div style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", padding:"14px 16px", display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={onClose} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#fff", display:"flex", padding:4 }}><ChevronLeft size={18} /></button>
        <span style={{ color:"#fff", fontWeight:700, fontSize:15, flex:1 }}>Chat History</span>
        <button onClick={onNew} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, padding:"5px 10px", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
          <Plus size={13} /> New Chat
        </button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        {loading && <div style={{ display:"flex", justifyContent:"center", alignItems:"center", padding:32, gap:8, color:"#94a3b8", fontSize:13 }}><Loader size={14} style={{ animation:"spin 1s linear infinite" }} /> Loading…</div>}
        {!loading && !tickets.length && <div style={{ textAlign:"center", color:"#94a3b8", fontSize:13, padding:32 }}>No chat history yet.<br />Start a new conversation!</div>}
        {!loading && Object.entries(grp).map(([label,group]) => (
          <div key={label}>
            <div style={{ fontSize:10, fontWeight:700, color:"#94a3b8", letterSpacing:"0.08em", textTransform:"uppercase", padding:"10px 16px 4px" }}>{label}</div>
            {group.map(t => {
              const active = t.ticket_id===activeTid;
              return (
                <div key={t.ticket_id} onClick={()=>onSel(t)}
                  style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px", cursor:"pointer", background:active?"#ede9fe":"transparent", borderLeft:active?"3px solid #7c3aed":"3px solid transparent" }}
                  onMouseEnter={e=>{ if(!active) e.currentTarget.style.background="#f8fafc"; }}
                  onMouseLeave={e=>{ if(!active) e.currentTarget.style.background="transparent"; }}>
                  <MessageSquare size={15} color={active?"#7c3aed":"#94a3b8"} style={{ flexShrink:0 }} />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:active?600:500, color:active?"#4f46e5":"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.subject}</div>
                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:2, display:"flex", alignItems:"center", gap:4 }}>
                      <Clock size={9} /> {fmtTime(t.created_at)}
                      <span style={{ marginLeft:4, padding:"1px 6px", borderRadius:10, fontSize:9, fontWeight:700, background:(SC[t.status]||"#94a3b8")+"20", color:SC[t.status]||"#94a3b8", textTransform:"uppercase" }}>{SL[t.status]||t.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatbotWidget() {
  const [open, setOpen]           = useState(false);
  const [showHist, setShowHist]   = useState(false);
  const [tickets, setTickets]     = useState([]);
  const [tLoading, setTLoading]   = useState(false);
  const [tid, setTid]             = useState(null);
  const [msgs, setMsgs]           = useState([WELCOME]);
  const [rxns, setRxns]           = useState({});
  const [seenCnt, setSeenCnt]     = useState(0);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [showQ, setShowQ]         = useState(true);
  const [showCtc, setShowCtc]     = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [checking, setChecking]   = useState(false);
  const [unread, setUnread]       = useState(0);
  const [atts, setAtts]           = useState([]);
  const [selFile, setSelFile]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ctxMenu, setCtxMenu]     = useState(null);
  const [picker, setPicker]       = useState(null);

  const endRef  = useRef(null);
  const inpRef  = useRef(null);
  const fileRef = useRef(null);
  const uid     = getUid();

  const fetchTickets = useCallback(async () => {
    try {
      const r = await axios.get(`${API}/api/support/my`, { headers: hdrs() });
      const sorted = (r.data.data||[]).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
      setTickets(sorted);
      return sorted;
    } catch { return []; }
  }, []);

  useEffect(() => {
    if (!open) return;
    setTLoading(true);
    fetchTickets().finally(()=>setTLoading(false));
  }, [open, fetchTickets]);

  useEffect(() => {
    if (!open) return;
    const iv = setInterval(fetchTickets, 15000);
    return () => clearInterval(iv);
  }, [open, fetchTickets]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);
  useEffect(() => { if(open){ setUnread(0); setTimeout(()=>inpRef.current?.focus(),100); } }, [open]);

  useEffect(() => {
    if (!tid) { setAtts([]); return; }
    const go = async () => {
      try { const r=await axios.get(`${API}/api/attachments/${tid}`,{headers:hdrs()}); setAtts(r.data.data||[]); } catch {}
    };
    go();
    const iv = setInterval(go, 15000);
    return () => clearInterval(iv);
  }, [tid]);

  useEffect(() => {
    if (!tid) return;
    const iv = setInterval(async () => {
      try {
        const r = await axios.get(`${API}/api/support/my`, {headers:hdrs()});
        const sorted = (r.data.data||[]).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
        setTickets(sorted);
        const t = sorted.find(t=>t.ticket_id===tid);
        if (!t) return;
        setRxns(toObj(t.reactions));
        const conv = toArr(t.conversation);
        if (conv.length>seenCnt) {
          const fresh = conv.slice(seenCnt);
          setSeenCnt(conv.length);
          fresh.forEach((r,i) => {
            const m = { role:"admin", content:` **${r.sender||"Admin"} replied:** ${r.content}`, timestamp:r.timestamp||new Date().toISOString(), _src:"conversation", _i:seenCnt+i };
            setMsgs(p=>[...p,m]);
            if(!open) setUnread(p=>p+1);
          });
        }
      } catch {}
    }, 15000);
    return () => clearInterval(iv);
  }, [tid, seenCnt, open]);

  const addMsg = useCallback((role, content, meta={}) => {
    setMsgs(p=>[...p, { role, content, timestamp:new Date().toISOString(), ...meta }]);
    if(role!=="user"&&!open) setUnread(p=>p+1);
  }, [open]);

  const pingAdmin = async txt => {
    if (!tid) return;
    try { await axios.post(`${API}/api/support/${tid}/employee-message`, {message:txt}, {headers:hdrs()}); } catch {}
  };

  const newChat = () => {
    setTid(null);
    setMsgs([{...WELCOME, timestamp:new Date().toISOString()}]);
    setRxns({});
    setShowQ(true);
    setShowCtc(false);
    setSeenCnt(0);
    setAtts([]);
    setInput("");
    setShowHist(false);
    setCtxMenu(null);
    setPicker(null);
  };

  const loadTick = t => {
    const thread = buildThread(t, uid);
    setTid(t.ticket_id);
    setMsgs(thread.length>0 ? thread : [{role:"assistant", content:"Conversation loaded. You can continue chatting.", timestamp:t.created_at}]);
    setRxns(toObj(t.reactions));
    setSeenCnt(toArr(t.conversation).length);
    setShowQ(false);
    setShowCtc(false);
    setInput("");
    setShowHist(false);
    setCtxMenu(null);
    setPicker(null);
  };

  const doReact = async (msgKey, emoji) => {
    if (!tid) return;
    try {
      const r = await axios.post(`${API}/api/support/${tid}/react`, {messageKey:msgKey, emoji}, {headers:hdrs()});
      setRxns(r.data.reactions||{});
    } catch {}
  };

  const doDelete = async (idx, scope) => {
    setCtxMenu(null);
    const msg = msgs[idx];
    if (!tid||msg._src===undefined) { setMsgs(p=>p.filter((_,i)=>i!==idx)); return; }
    try {
      await axios.delete(`${API}/api/support/${tid}/message`, { headers:hdrs(), data:{ messageIndex:msg._i, messageSource:msg._src, scope } });
      setMsgs(p=>p.filter((_,i)=>i!==idx));
    } catch {}
  };

  const rightClick = (e, idx) => {
    e.preventDefault();
    const msg = msgs[idx];
    if (msg.role==="assistant"&&msg._src===undefined) return;
    setPicker(null);
    setCtxMenu({ x:e.clientX, y:e.clientY, idx });
  };

  const pickFile = e => {
    const f=e.target.files[0];
    if(!f) return;
    if(f.size>5242880){ addMsg("assistant","File must be under **5MB**."); return; }
    setSelFile(f);
  };

  const uploadFile = async () => {
    if(!selFile) return;
    if(!tid){ addMsg("assistant","Create a support ticket first, then attach files."); setSelFile(null); return; }
    setUploading(true);
    try {
      const fd=new FormData(); fd.append("file",selFile);
      const r=await axios.post(`${API}/api/attachments/${tid}`,fd,{headers:{...hdrs(),"Content-Type":"multipart/form-data"}});
      setAtts(p=>[...p,r.data.data]);
      addMsg("user",`Sent file: **${selFile.name}** (${fileSz(selFile.size)})`);
      setSelFile(null);
      if(fileRef.current) fileRef.current.value="";
    } catch(err){ addMsg("assistant",`Upload failed: ${err.response?.data?.message||"Please try again."}`); }
    finally { setUploading(false); }
  };

  const sendMsg = async txt => {
    const ut = txt||input.trim();
    if(!ut||loading) return;
    setInput(""); setShowQ(false); setShowCtc(false);
    addMsg("user", ut);
    if(tid) pingAdmin(ut);
    setLoading(true);
    await new Promise(r=>setTimeout(r,400));

    const escKW = ["contact support","human","live agent","speak to someone","real person","support team","contact admin","talk to admin"];
    if(escKW.some(k=>ut.toLowerCase().includes(k))){ setLoading(false); addMsg("assistant","Sure! Click **Contact Support Team** below to create a ticket. 🎫"); setShowCtc(true); return; }
    if(outScope(ut)){ setLoading(false); addMsg("assistant","I'm sorry, that topic is outside my scope. I'm specifically designed to help with **HR-related queries** like leave, attendance, company policies, and payroll.\n\nWould you like to contact our support team for further assistance?"); setShowCtc(true); return; }
    const pre = findQA(ut);
    if(pre){ setLoading(false); addMsg("assistant",pre); return; }

    try {
      const hist = [...msgs, {role:"user",content:ut}];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:500,
          system:"You are a chatbot for Shnoor International. Answer only HR-related questions about company policies, leave, attendance, payroll, and technical support. If asked something unrelated to HR, say you cannot help with that topic and suggest contacting support. Be concise and friendly.",
          messages: hist.filter(m=>m.role==="user"||m.role==="assistant").map(m=>({role:m.role,content:m.content})),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text||"I'm not sure about that. Please contact support for help.";
      addMsg("assistant", reply);
      const unc = ["not sure","don't know","cannot answer","contact support","unable to","i'm sorry","outside my"];
      if(unc.some(p=>reply.toLowerCase().includes(p))) setTimeout(()=>setShowCtc(true),500);
    } catch { addMsg("assistant","Trouble connecting. Please try again or contact support."); setShowCtc(true); }
    finally { setLoading(false); }
  };

  const escalate = async () => {
    setEscalating(true); setShowCtc(false);
    try {
      const hist = msgs.map(m=>({ role:m.role==="admin"?"assistant":m.role, content:m.content, timestamp:m.timestamp }));
      const r = await axios.post(`${API}/api/support`, { subject:`Support Request from ${getName()}`, messages:hist }, {headers:hdrs()});
      const newTid = r.data.data?.ticket_id;
      setTid(newTid);
      setSeenCnt(0);
      fetchTickets();
      addMsg("assistant", `Ticket **#${newTid}** sent to the admin team.\n\nI'll notify you when they reply. You can also click **"Check"** anytime.\n\nAttach files using the paperclip below.`);
    } catch { addMsg("assistant","Issue creating ticket. Please try again."); }
    finally { setEscalating(false); }
  };

  const checkReply = async () => {
    if(!tid) return;
    setChecking(true);
    try {
      const r = await axios.get(`${API}/api/support/my`,{headers:hdrs()});
      const t = (r.data.data||[]).find(t=>t.ticket_id===tid);
      if(!t){ addMsg("assistant","Couldn't find your ticket."); return; }
      setRxns(toObj(t.reactions));
      const conv = toArr(t.conversation);
      if(!conv.length){ addMsg("assistant","No reply yet. Admin will get back to you soon."); return; }
      if(conv.length>seenCnt){
        const fresh=conv.slice(seenCnt);
        setSeenCnt(conv.length);
        fresh.forEach((r,i)=>addMsg("admin",` **${r.sender||"Admin"} replied:** ${r.content}`,{_src:"conversation",_i:seenCnt+i}));
      } else { addMsg("assistant","All replies shown above. Anything else?"); }
    } catch { addMsg("assistant","Couldn't check replies right now."); }
    finally { setChecking(false); }
  };

  const keyDown = e => { if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMsg(); } };

  const bubStyle = role => {
    if(role==="user")  return { bg:"linear-gradient(135deg,#4f46e5,#7c3aed)", c:"#fff",    r:"16px 16px 4px 16px",  al:"flex-end" };
    if(role==="admin") return { bg:"#e0e7ff",                                  c:"#1e293b", r:"16px 16px 16px 4px",  al:"flex-start", br:"1px solid #c7d2fe" };
    return                    { bg:"#f1f5f9",                                  c:"#1e293b", r:"16px 16px 16px 4px",  al:"flex-start" };
  };

  const getMsgKey = m => m._src&&m._i!==undefined ? `${m._src}-${m._i}` : null;
  const activeTick = tickets.find(t=>t.ticket_id===tid);

  const HBtn = { background:"rgba(255,255,255,0.2)", border:"none", borderRadius:8, padding:"5px 8px", color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:4, flexShrink:0 };

  return (
    <>
      <div onClick={()=>setOpen(!open)}
        style={{ position:"fixed", bottom:28, right:28, zIndex:9999, width:56, height:56, borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 4px 20px rgba(79,70,229,0.5)", transition:"transform 0.2s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
        {!open&&unread>0&&<div style={{ position:"absolute", top:-4, right:-4, background:"#ef4444", color:"#fff", borderRadius:"50%", width:20, height:20, fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread}</div>}
      </div>

      {open && (
        <div style={{ position:"fixed", bottom:96, right:28, zIndex:9998, width:375, height:590, borderRadius:16, background:"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.2)", display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Segoe UI',sans-serif", animation:"slideUp 0.2s ease" }}>

          {showHist && <HistPanel tickets={tickets} activeTid={tid} onSel={loadTick} onNew={newChat} onClose={()=>setShowHist(false)} loading={tLoading} />}

          <div style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", padding:"14px 18px", color:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>S</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:15 }}>SHNOOR Chatbot</div>
                <div style={{ fontSize:11, opacity:0.85, display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80", display:"inline-block" }} /> Queries + Admin Support
                </div>
              </div>
              <button onClick={()=>setShowHist(true)} style={HBtn}><History size={12} /> History</button>
              <button onClick={newChat} title="New chat" style={HBtn}><Plus size={13} /></button>
              {tid && <button onClick={checkReply} disabled={checking} style={HBtn}><RefreshCw size={11} /> {checking?"…":"Check"}</button>}
            </div>
            {activeTick && (
              <div style={{ marginTop:8, padding:"5px 10px", background:"rgba(255,255,255,0.12)", borderRadius:8, fontSize:11, color:"rgba(255,255,255,0.9)", display:"flex", alignItems:"center", gap:6 }}>
                <MessageSquare size={11} style={{ flexShrink:0 }} />
                <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>#{tid} · {activeTick.subject}</span>
                <span style={{ flexShrink:0, fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:10, background:"rgba(255,255,255,0.2)", textTransform:"uppercase" }}>{SL[activeTick.status]||activeTick.status}</span>
              </div>
            )}
          </div>

          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10 }}
            onClick={()=>{ setCtxMenu(null); setPicker(null); }}>
            {msgs.map((msg, idx) => {
              const s = bubStyle(msg.role);
              const isDel = !(msg.role==="assistant"&&msg._src===undefined);
              const canAll = msg.role==="user"&&!!tid;
              const mKey = getMsgKey(msg);
              const showRct = !!tid&&!!mKey;

              return (
                <div key={idx} style={{ display:"flex", justifyContent:s.al }}>
                  <div style={{ maxWidth:"85%", position:"relative" }}>
                    <div style={{ position:"absolute", top:-10, [s.al==="flex-end"?"left":"right"]:0, display:"flex", gap:3, opacity:0, transition:"opacity 0.15s", zIndex:5 }}
                      className={`act-${idx}`}>
                      {showRct && (
                        <button onClick={e=>{ e.stopPropagation(); setCtxMenu(null); setPicker(picker===idx?null:idx); }}
                          style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"2px 5px", cursor:"pointer", fontSize:14, lineHeight:1, boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }}>😊</button>
                      )}
                      {isDel && (
                        <button onClick={e=>{ e.stopPropagation(); setPicker(null); rightClick(e,idx); }}
                          style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"3px 5px", cursor:"pointer", display:"flex", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }}>
                          <Trash2 size={11} color="#94a3b8" />
                        </button>
                      )}
                    </div>

                    {picker===idx && (
                      <div style={{ position:"absolute", [s.al==="flex-end"?"right":"left"]:0, bottom:"calc(100% + 6px)", zIndex:9999 }}
                        onClick={e=>e.stopPropagation()}>
                        <EmojiBar onPick={e=>doReact(mKey,e)} onClose={()=>setPicker(null)} />
                      </div>
                    )}

                    <div style={{ padding:"10px 13px", borderRadius:s.r, background:s.bg, color:s.c, fontSize:13.5, lineHeight:1.6, border:s.br||"none", cursor:"default" }}
                      dangerouslySetInnerHTML={{ __html:renderTxt(msg.content) }}
                      onContextMenu={e=>isDel&&rightClick(e,idx)}
                      onMouseEnter={e=>{ const el=e.currentTarget.parentElement.querySelector(`.act-${idx}`); if(el) el.style.opacity="1"; }}
                      onMouseLeave={e=>{ const el=e.currentTarget.parentElement.querySelector(`.act-${idx}`); if(el&&picker!==idx) el.style.opacity="0"; }} />

                    <div style={{ fontSize:10, color:"#94a3b8", marginTop:3, textAlign:s.al==="flex-end"?"right":"left" }}>
                      {msg.role==="admin"?"Admin • ":""}{fmtTime(msg.timestamp)}
                    </div>

                    {mKey && (
                      <div style={{ display:"flex", justifyContent:s.al }}>
                        <RxnBar rxns={rxns} msgKey={mKey} uid={uid} onReact={doReact} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {atts.length>0 && (
              <div style={{ background:"#f8fafc", borderRadius:10, padding:10, border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:11, fontWeight:600, color:"#64748b", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.04em" }}>Attachments ({atts.length})</div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {atts.map(att=>(
                    <div key={att.attachment_id} style={{ display:"flex", alignItems:"center", gap:8, background:"#fff", borderRadius:8, padding:"6px 10px", border:"1px solid #e2e8f0" }}>
                      {isImg(att.file_type)?<Image size={16} color="#4f46e5" />:<FileText size={16} color="#64748b" />}
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:500, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.file_name}</div>
                        <div style={{ fontSize:10, color:"#94a3b8" }}>{att.uploader_name} • {fileSz(att.file_size)}</div>
                      </div>
                      {isImg(att.file_type)&&<a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#4f46e5", textDecoration:"none", flexShrink:0 }}>View</a>}
                      <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name} style={{ color:"#64748b", display:"flex", alignItems:"center", flexShrink:0 }}><Download size={14} /></a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{ display:"flex" }}>
                <div style={{ padding:"10px 14px", borderRadius:"16px 16px 16px 4px", background:"#f1f5f9", display:"flex", gap:4, alignItems:"center" }}>
                  <span style={dot(0)} /><span style={dot(0.2)} /><span style={dot(0.4)} />
                </div>
              </div>
            )}

            {showCtc&&!loading && (
              <div style={{ background:"#fff7ed", border:"1px solid #fed7aa", borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontSize:13, color:"#92400e", fontWeight:600, marginBottom:8 }}>Would you like to contact our support team?</div>
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={escalate} disabled={escalating} style={{ flex:1, padding:"7px 12px", background:"#4f46e5", color:"#fff", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>{escalating?"Creating...":"Yes, Contact Support"}</button>
                  <button onClick={()=>setShowCtc(false)} style={{ padding:"7px 12px", background:"#f1f5f9", color:"#64748b", border:"none", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer" }}>No Thanks</button>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {selFile && (
            <div style={{ padding:"8px 12px", background:"#f0f4ff", borderTop:"1px solid #e0e7ff", display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selFile.name}</div>
                <div style={{ fontSize:10, color:"#64748b" }}>{fileSz(selFile.size)}</div>
              </div>
              <button onClick={uploadFile} disabled={uploading} style={{ background:"#4f46e5", color:"#fff", border:"none", borderRadius:6, padding:"5px 12px", fontSize:12, fontWeight:600, cursor:"pointer", flexShrink:0 }}>{uploading?"Uploading...":"Send File"}</button>
              <button onClick={()=>{ setSelFile(null); if(fileRef.current) fileRef.current.value=""; }} style={{ background:"transparent", border:"none", cursor:"pointer", color:"#ef4444", padding:2, display:"flex", alignItems:"center" }}><X size={14} /></button>
            </div>
          )}

          {showQ && (
            <div style={{ padding:"0 12px 8px" }}>
              <div style={{ fontSize:11, color:"#94a3b8", marginBottom:6, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>Quick Questions</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {QQUICK.map((q,i)=>(
                  <button key={i} onClick={()=>sendMsg(q)}
                    style={{ background:"#e0e7ff", color:"#4f46e5", border:"none", borderRadius:20, padding:"4px 10px", fontSize:11.5, cursor:"pointer", fontWeight:500 }}
                    onMouseEnter={e=>e.currentTarget.style.background="#c7d2fe"}
                    onMouseLeave={e=>e.currentTarget.style.background="#e0e7ff"}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {!showCtc && (
            <div style={{ padding:"0 12px 8px" }}>
              <button onClick={()=>setShowCtc(true)} style={{ width:"100%", padding:"7px", background:"#fff7ed", color:"#ea580c", border:"1px solid #fed7aa", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <AlertCircle size={13} /> Contact Support Team
              </button>
            </div>
          )}

          <div style={{ padding:"10px 12px 12px", borderTop:"1px solid #f1f5f9", display:"flex", gap:8, alignItems:"center" }}>
            <input ref={fileRef} type="file" style={{ display:"none" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={pickFile} />
            <button onClick={()=>fileRef.current?.click()} title={tid?"Attach file":"Create ticket first"}
              style={{ background:"transparent", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center", color:tid?"#4f46e5":"#cbd5e1", flexShrink:0 }}>
              <Paperclip size={18} />
            </button>
            <input ref={inpRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={keyDown}
              placeholder="Ask me anything about HR..." disabled={loading}
              style={{ flex:1, border:"1px solid #e2e8f0", borderRadius:24, padding:"8px 14px", fontSize:13, outline:"none", background:"#f8fafc" }} />
            <button onClick={()=>sendMsg()} disabled={!input.trim()||loading}
              style={{ width:36, height:36, borderRadius:"50%", flexShrink:0, background:input.trim()&&!loading?"linear-gradient(135deg,#4f46e5,#7c3aed)":"#e2e8f0", border:"none", cursor:input.trim()&&!loading?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Send size={15} color={input.trim()&&!loading?"#fff":"#94a3b8"} />
            </button>
          </div>
        </div>
      )}

      {ctxMenu && (
        <DelMenu x={ctxMenu.x} y={ctxMenu.y}
          canAll={msgs[ctxMenu.idx]?.role==="user"&&!!tid}
          onMe={()=>doDelete(ctxMenu.idx,"self")}
          onAll={()=>doDelete(ctxMenu.idx,"everyone")}
          onClose={()=>setCtxMenu(null)} />
      )}

      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce  { 0%,80%,100% { transform:translateY(0); } 40% { transform:translateY(-6px); } }
        @keyframes spin    { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      `}</style>
    </>
  );
}