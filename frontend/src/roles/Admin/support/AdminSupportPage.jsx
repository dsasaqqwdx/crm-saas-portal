import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { Paperclip, Download, FileText, Image, X, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const EMOJIS = ["👍","👎","❤️","😂","😮","😢","🔥","✅"];

function fileSz(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes/1024).toFixed(1) + " KB";
  return (bytes/1048576).toFixed(1) + " MB";
}
function isImg(ft) { return ft && ft.startsWith("image/"); }
function toArr(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch { return []; }
}
function toObj(x) {
  if (!x) return {};
  if (typeof x === "object" && !Array.isArray(x)) return x;
  try { return JSON.parse(x); } catch { return {}; }
}

function EmojiBar({ onPick, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div onClick={e => e.stopPropagation()}
      style={{ position:"absolute", zIndex:9999, bottom:"calc(100% + 6px)", background:"#fff", border:"1px solid #e2e8f0", borderRadius:12, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", padding:"6px 8px", display:"flex", gap:2 }}>
      {EMOJIS.map(e => (
        <button key={e} onClick={() => { onPick(e); onClose(); }}
          style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:18, padding:"4px 5px", borderRadius:8 }}
          onMouseEnter={ev => ev.currentTarget.style.background="#f1f5f9"}
          onMouseLeave={ev => ev.currentTarget.style.background="transparent"}>{e}</button>
      ))}
    </div>
  );
}

function Reactions({ rxns, msgKey, uid, onReact }) {
  if (!rxns?.[msgKey]) return null;
  const entries = Object.entries(rxns[msgKey]).filter(([,ids]) => ids.length);
  if (!entries.length) return null;
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:3, marginTop:4 }}>
      {entries.map(([emoji, ids]) => {
        const mine = ids.includes(uid);
        return (
          <button key={emoji} onClick={() => onReact(msgKey, emoji)}
            style={{ background: mine?"#e0e7ff":"#f1f5f9", border: mine?"1px solid #a5b4fc":"1px solid #e2e8f0", borderRadius:20, padding:"2px 7px", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:3 }}
            onMouseEnter={e => e.currentTarget.style.background=mine?"#c7d2fe":"#e2e8f0"}
            onMouseLeave={e => e.currentTarget.style.background=mine?"#e0e7ff":"#f1f5f9"}>
            <span style={{ fontSize:13 }}>{emoji}</span>
            <span style={{ color:mine?"#4f46e5":"#64748b", fontWeight:mine?700:500 }}>{ids.length}</span>
          </button>
        );
      })}
    </div>
  );
}

function DelMenu({ x, y, onDelMe, onDelAll, onClose }) {
  useEffect(() => {
    const fn = () => onClose();
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, [onClose]);
  const base = { display:"flex", alignItems:"center", gap:8, width:"100%", padding:"9px 14px", background:"transparent", border:"none", cursor:"pointer", fontSize:13, textAlign:"left" };
  return (
    <div onClick={e => e.stopPropagation()}
      style={{ position:"fixed", top:y, left:x, zIndex:99999, background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, boxShadow:"0 4px 20px rgba(0,0,0,0.15)", minWidth:190, overflow:"hidden" }}>
      <button onClick={onDelMe} style={{ ...base, color:"#1e293b" }}
        onMouseEnter={e => e.currentTarget.style.background="#f1f5f9"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
        <Trash2 size={13} color="#64748b" /> Delete for me
      </button>
      <button onClick={onDelAll} style={{ ...base, color:"#ef4444", borderTop:"1px solid #f1f5f9" }}
        onMouseEnter={e => e.currentTarget.style.background="#fff1f2"}
        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
        <Trash2 size={13} color="#ef4444" /> Delete for everyone
      </button>
    </div>
  );
}

function Bubble({ msg, src, idx, isUser, uname, rxns, msgKey, uid, onReact, onRightClick, activePicker, setActivePicker }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start", position:"relative" }}
      onContextMenu={e => onRightClick(e, src, idx)}>
      <div style={{ maxWidth:"80%", position:"relative" }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}>
        {hov && (
          <div style={{ position:"absolute", top:-10, [isUser?"left":"right"]:0, display:"flex", gap:3, zIndex:10 }}>
            {msgKey && (
              <button onClick={e => { e.stopPropagation(); setActivePicker(activePicker===msgKey?null:msgKey); }}
                style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"2px 5px", cursor:"pointer", fontSize:14, lineHeight:1, boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }}>😊</button>
            )}
            <button onClick={e => { e.stopPropagation(); onRightClick(e, src, idx); }}
              style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:8, padding:"3px 5px", cursor:"pointer", display:"flex", alignItems:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.1)" }}>
              <Trash2 size={11} color="#94a3b8" />
            </button>
          </div>
        )}
        {activePicker === msgKey && (
          <div style={{ position:"absolute", [isUser?"right":"left"]:0, bottom:"calc(100% + 6px)", zIndex:9999 }}>
            <EmojiBar onPick={e => { onReact(msgKey, e); setActivePicker(null); }} onClose={() => setActivePicker(null)} />
          </div>
        )}
        <div style={{ padding:"8px 12px", borderRadius: isUser?"12px 12px 3px 12px":"12px 12px 12px 3px",
          background: isUser?"#4f46e5":src==="conversation"?"#e0e7ff":"#fff",
          color: isUser?"#fff":"#1e293b", fontSize:13, lineHeight:1.5,
          boxShadow:"0 1px 3px rgba(0,0,0,0.08)", cursor:"context-menu" }}>
          <div style={{ fontSize:10, opacity:0.75, marginBottom:2, fontWeight:600, color:src==="conversation"&&!isUser?"#4f46e5":undefined }}>
            {isUser ? uname : (msg.sender || "Admin")}
            {msg.timestamp && <span> • {new Date(msg.timestamp).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})}</span>}
          </div>
          {msg.content}
        </div>
        {msgKey && (
          <div style={{ display:"flex", justifyContent:isUser?"flex-end":"flex-start" }}>
            <Reactions rxns={rxns} msgKey={msgKey} uid={uid} onReact={onReact} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [replyTxt, setReplyTxt] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [openCnt, setOpenCnt] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [selFile, setSelFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [rxns, setRxns] = useState({});
  const [ctxMenu, setCtxMenu] = useState(null);
  const [activePicker, setActivePicker] = useState(null);

  const endRef = useRef(null);
  const fileRef = useRef(null);
  const token = localStorage.getItem("token");
  const hdrs = { "x-auth-token": token };
  const adminUid = localStorage.getItem("user_id");

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadTickets = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        axios.get(`${API}/api/support`, { headers: hdrs }),
        axios.get(`${API}/api/support/count`, { headers: hdrs }),
      ]);
      setTickets(a.data.data || []);
      setOpenCnt(b.data.count || 0);
    } catch { showToast("Failed to load", "error"); }
    finally { setLoading(false); }
  };

  const loadAttachments = async (tid) => {
    try {
      const r = await axios.get(`${API}/api/attachments/${tid}`, { headers: hdrs });
      setAttachments(r.data.data || []);
    } catch {}
  };

  useEffect(() => {
    loadTickets();
    const iv = setInterval(loadTickets, 30000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [selected]);

  useEffect(() => {
    if (selected) { loadAttachments(selected.ticket_id); setRxns(toObj(selected.reactions)); }
    else { setAttachments([]); setRxns({}); }
  }, [selected]);

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyTxt.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API}/api/support/${selected.ticket_id}/reply`, { reply_text: replyTxt }, { headers: hdrs });
      showToast("Reply sent!");
      setReplyTxt("");
      const r = await axios.get(`${API}/api/support`, { headers: hdrs });
      const all = r.data.data || [];
      setTickets(all);
      setOpenCnt(all.filter(t=>t.status==="open").length);
      const upd = all.find(t=>t.ticket_id===selected.ticket_id);
      if (upd) setSelected(upd);
    } catch(err) { showToast(err.response?.data?.message||"Failed","error"); }
    finally { setSending(false); }
  };

  const changeStatus = async (tid, status) => {
    try {
      await axios.put(`${API}/api/support/${tid}/status`, { status }, { headers: hdrs });
      showToast("Updated");
      loadTickets();
      if (selected?.ticket_id===tid) setSelected(p=>({...p,status}));
    } catch { showToast("Failed","error"); }
  };

  const delTicket = async (tid) => {
    if (!window.confirm("Delete ticket?")) return;
    try {
      await axios.delete(`${API}/api/support/${tid}`, { headers: hdrs });
      showToast("Deleted");
      setSelected(null); setAttachments([]); setRxns({});
      loadTickets();
    } catch { showToast("Failed","error"); }
  };

  const doReact = async (msgKey, emoji) => {
    if (!selected) return;
    try {
      const r = await axios.post(`${API}/api/support/${selected.ticket_id}/react`, { messageKey:msgKey, emoji }, { headers: hdrs });
      setRxns(r.data.reactions||{});
      setSelected(p=>({...p, reactions:JSON.stringify(r.data.reactions||{})}));
    } catch { showToast("Reaction failed","error"); }
  };

  const doDelete = async (src, idx, scope) => {
    setCtxMenu(null);
    if (!selected) return;
    try {
      await axios.delete(`${API}/api/support/${selected.ticket_id}/message`, {
        headers: hdrs,
        data: { messageIndex:idx, messageSource:src, scope },
      });
      showToast(scope==="everyone"?"Deleted for everyone":"Deleted for you");
      const r = await axios.get(`${API}/api/support`, { headers: hdrs });
      const all = r.data.data||[];
      setTickets(all);
      const upd = all.find(t=>t.ticket_id===selected.ticket_id);
      if (upd) { setSelected(upd); setRxns(toObj(upd.reactions)); }
    } catch(err) { showToast(err.response?.data?.message||"Failed","error"); }
  };

  const rightClick = (e, src, idx) => {
    e.preventDefault();
    setActivePicker(null);
    setCtxMenu({ x:e.clientX, y:e.clientY, src, idx });
  };

  const pickFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5242880) { showToast("Max 5MB","error"); return; }
    setSelFile(f);
  };

  const uploadFile = async () => {
    if (!selFile||!selected) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selFile);
      await axios.post(`${API}/api/attachments/${selected.ticket_id}`, fd, { headers:{ ...hdrs, "Content-Type":"multipart/form-data" } });
      showToast("Uploaded!");
      setSelFile(null);
      if (fileRef.current) fileRef.current.value="";
      loadAttachments(selected.ticket_id);
    } catch(err) { showToast(err.response?.data?.message||"Failed","error"); }
    finally { setUploading(false); }
  };

  const visMsg = toArr(selected?.messages).filter(m=>!(m.deletedFor||[]).includes(adminUid));
  const visConv = toArr(selected?.conversation).filter(c=>!(c.deletedFor||[]).includes(adminUid));

  return (
    <div className="d-flex bg-light min-vh-100" onClick={() => { setCtxMenu(null); setActivePicker(null); }}>
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft:250 }}>
        {toast && (
          <div style={{ position:"fixed", top:20, right:20, zIndex:9999, background:toast.type==="error"?"#ef4444":"#10b981", color:"#fff", padding:"12px 20px", borderRadius:8, fontWeight:500, boxShadow:"0 4px 12px rgba(0,0,0,0.15)" }}>
            {toast.msg}
          </div>
        )}
        {ctxMenu && (
          <DelMenu x={ctxMenu.x} y={ctxMenu.y}
            onDelMe={() => doDelete(ctxMenu.src, ctxMenu.idx, "self")}
            onDelAll={() => doDelete(ctxMenu.src, ctxMenu.idx, "everyone")}
            onClose={() => setCtxMenu(null)} />
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Support Tickets
              {openCnt>0 && <span className="badge bg-danger ms-2" style={{ fontSize:14 }}>{openCnt} New</span>}
            </h2>
            <p className="text-muted mb-0">Reply to employee support requests</p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading
                  ? <div className="text-center text-muted p-4">Loading...</div>
                  : !tickets.length
                    ? <div className="text-center text-muted p-4">No tickets found.</div>
                    : tickets.map(t => {
                        const isSel = selected?.ticket_id===t.ticket_id;
                        const replies = toArr(t.conversation).length;
                        return (
                          <div key={t.ticket_id}
                            onClick={() => { setSelected(t); setReplyTxt(""); setSelFile(null); setCtxMenu(null); setActivePicker(null); }}
                            style={{ padding:"12px 14px", borderBottom:"1px solid #f1f5f9", cursor:"pointer", background:isSel?"#f0f4ff":"#fff", borderLeft:isSel?"3px solid #4f46e5":"3px solid transparent" }}>
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <span style={{ fontWeight:600, fontSize:13, color:"#1e293b" }}>
                                {t.user_name||"Unknown"}
                                {t.status==="open" && <span style={{ width:7, height:7, borderRadius:"50%", background:"#ef4444", display:"inline-block", marginLeft:6 }} />}
                              </span>
                              <select value={t.status} onClick={e=>e.stopPropagation()} onChange={e=>changeStatus(t.ticket_id,e.target.value)}
                                className="form-select form-select-sm" style={{ fontSize:11, width:"auto", padding:"1px 4px" }}>
                                <option value="open">Open</option>
                                <option value="inprogress">In Progress</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                            <div style={{ fontSize:12, color:"#64748b", marginBottom:3 }} className="text-truncate">{t.subject}</div>
                            <div style={{ fontSize:11, color:"#94a3b8" }}>
                              {new Date(t.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                              {replies>0 && <span style={{ color:"#4f46e5", marginLeft:8 }}>💬 {replies} {replies===1?"reply":"replies"}</span>}
                            </div>
                          </div>
                        );
                      })
                }
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            {!selected
              ? <div className="card border-0 shadow-sm" style={{ minHeight:400 }}>
                  <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="fw-semibold text-muted">Select a ticket to view and reply</div>
                  </div>
                </div>
              : <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h6 className="fw-bold mb-1">{selected.subject}</h6>
                        <div style={{ fontSize:13, color:"#64748b" }}>From: <strong>{selected.user_name}</strong> ({selected.user_email})</div>
                      </div>
                      <button className="btn btn-sm" style={{ background:"#fff1f2", color:"#ef4444", fontWeight:500 }}
                        onClick={() => delTicket(selected.ticket_id)}>Delete Ticket</button>
                    </div>

                    <div style={{ fontSize:13, fontWeight:600, color:"#374151", marginBottom:4 }}>Conversation</div>
                    <div style={{ fontSize:11, color:"#94a3b8", marginBottom:8 }}>Hover to react or delete a message.</div>

                    <div style={{ background:"#f8fafc", borderRadius:10, padding:12, maxHeight:300, overflowY:"auto", display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}
                      onClick={e=>e.stopPropagation()}>
                      {visMsg.map((msg, i) => (
                        <Bubble key={`m-${i}`} msg={msg} src="messages" idx={i}
                          isUser={msg.role==="user"} uname={selected.user_name}
                          rxns={rxns} msgKey={`messages-${i}`} uid={adminUid}
                          onReact={doReact} onRightClick={rightClick}
                          activePicker={activePicker} setActivePicker={setActivePicker} />
                      ))}

                      {visMsg.length>0 && visConv.length>0 && (
                        <div style={{ textAlign:"center", fontSize:11, color:"#94a3b8", padding:"4px 0" }}>── Admin Replies ──</div>
                      )}

                      {visConv.map((msg, i) => (
                        <Bubble key={`c-${i}`} msg={msg} src="conversation" idx={i}
                          isUser={false} uname={selected.user_name}
                          rxns={rxns} msgKey={`conversation-${i}`} uid={adminUid}
                          onReact={doReact} onRightClick={rightClick}
                          activePicker={activePicker} setActivePicker={setActivePicker} />
                      ))}

                      {!visMsg.length && !visConv.length && (
                        <div style={{ textAlign:"center", color:"#94a3b8", fontSize:13 }}>No messages yet.</div>
                      )}
                      <div ref={endRef} />
                    </div>

                    <div style={{ marginBottom:16 }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>
                          Attachments {attachments.length>0&&<span style={{ color:"#4f46e5" }}>({attachments.length})</span>}
                        </div>
                        <div>
                          <input ref={fileRef} type="file" style={{ display:"none" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={pickFile} />
                          <button onClick={() => fileRef.current?.click()} className="btn btn-sm btn-outline-primary" style={{ fontSize:12, display:"flex", alignItems:"center", gap:4 }}>
                            <Paperclip size={13} /> Attach
                          </button>
                        </div>
                      </div>

                      {selFile && (
                        <div style={{ background:"#f0f4ff", borderRadius:8, padding:"8px 12px", marginBottom:8, display:"flex", alignItems:"center", gap:8, border:"1px solid #e0e7ff" }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:12, fontWeight:500, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{selFile.name}</div>
                            <div style={{ fontSize:10, color:"#64748b" }}>{fileSz(selFile.size)}</div>
                          </div>
                          <button onClick={uploadFile} disabled={uploading} className="btn btn-sm btn-primary" style={{ fontSize:12 }}>{uploading?"Uploading...":"Upload"}</button>
                          <button onClick={() => { setSelFile(null); if(fileRef.current) fileRef.current.value=""; }}
                            style={{ background:"transparent", border:"none", cursor:"pointer", color:"#ef4444", padding:2 }}><X size={14} /></button>
                        </div>
                      )}

                      {attachments.length>0
                        ? <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                            {attachments.map(att => (
                              <div key={att.attachment_id} style={{ display:"flex", alignItems:"center", gap:8, background:"#f8fafc", borderRadius:8, padding:"8px 12px", border:"1px solid #e2e8f0" }}>
                                {isImg(att.file_type) ? <Image size={16} color="#4f46e5" /> : <FileText size={16} color="#64748b" />}
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ fontSize:13, fontWeight:500, color:"#1e293b", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{att.file_name}</div>
                                  <div style={{ fontSize:11, color:"#94a3b8" }}>By {att.uploader_name} • {fileSz(att.file_size)}</div>
                                </div>
                                {isImg(att.file_type) && <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" style={{ fontSize:11 }}>View</a>}
                                <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name} className="btn btn-sm btn-outline-primary" style={{ fontSize:11, display:"flex", alignItems:"center", gap:3 }}>
                                  <Download size={12} /> Download
                                </a>
                              </div>
                            ))}
                          </div>
                        : <div style={{ fontSize:12, color:"#94a3b8", padding:"8px 0" }}>No attachments yet.</div>
                      }
                    </div>

                    <div style={{ fontSize:13, fontWeight:600, color:"#374151", marginBottom:8 }}>Send Reply</div>
                    <form onSubmit={sendReply}>
                      <textarea className="form-control mb-2" rows={3}
                        placeholder="Type your reply..." value={replyTxt}
                        onChange={e=>setReplyTxt(e.target.value)}
                        style={{ fontSize:13, resize:"none" }} />
                      <button type="submit" className="btn btn-primary fw-semibold" disabled={sending||!replyTxt.trim()}>
                        {sending?"Sending...":"Send Reply"}
                      </button>
                    </form>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}