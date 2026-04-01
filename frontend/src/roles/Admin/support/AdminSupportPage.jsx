import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import { Paperclip, MessageSquare } from "lucide-react";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const EMOJI_LIST = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];
const fmtSz = (b) => {
if (!b) return "";
if (b < 1024) return b + " B";
if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
return (b / 1048576).toFixed(1) + " MB";
};
const pArr = (d) => { if (!d) return []; if (Array.isArray(d)) return d; try { return JSON.parse(d); } catch { return []; } };
const pObj = (d) => { if (!d) return {}; if (typeof d === "object" && !Array.isArray(d)) return d; try { return JSON.parse(d); } catch { return {}; } };
const renderC = (c) => String(c || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

export default function AdminSupportPage() {
const [tickets, setTickets] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedTicket, setSelectedTicket] = useState(null);
const [reactions, setReactions] = useState({});
const [replyText, setReplyText] = useState("");
const [submitting, setSubmitting] = useState(false);
const [toast, setToast] = useState(null);
const [openCount, setOpenCount] = useState(0);
const [attachments, setAttachments] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [emojiPicker, setEmojiPicker] = useState(null);
const [contextMenu, setContextMenu] = useState(null);
const [editingMsg, setEditingMsg] = useState(null);
const [editContent, setEditContent] = useState("");
const [editSaving, setEditSaving] = useState(false);

const convEndRef = useRef(null);
const fileRef = useRef(null);
const selectedTicketRef = useRef(null);
selectedTicketRef.current = selectedTicket;

const token = localStorage.getItem("token");
const userId = (() => { try { return JSON.parse(atob(token.split(".")[1])).id; } catch { return null; } })();
const headers = { "x-auth-token": token };

const showToast = (m, t = "success") => { setToast({ message: m, type: t }); setTimeout(() => setToast(null), 3000); };

const fetchTickets = useCallback(async () => {
try {
const [tr, cr] = await Promise.all([axios.get(`${API}/api/support`, { headers }), axios.get(`${API}/api/support/count`, { headers })]);
const all = tr.data.data || [];
setTickets(all);
setOpenCount(cr.data.count || 0);
const current = selectedTicketRef.current;
if (current) {
const updated = all.find(t => t.ticket_id === current.ticket_id);
if (updated) { setSelectedTicket(updated); setReactions(pObj(updated.reactions)); }
}
} catch { showToast("Failed to load", "error"); } finally { setLoading(false); }
}, []);

useEffect(() => {
fetchTickets();
const iv = setInterval(fetchTickets, 15000);
return () => clearInterval(iv);
}, [fetchTickets]);

useEffect(() => { convEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicket]);

useEffect(() => {
if (!selectedTicket) { setAttachments([]); return; }
axios.get(`${API}/api/attachments/${selectedTicket.ticket_id}`, { headers }).then(r => setAttachments(r.data.data || [])).catch(() => {});
}, [selectedTicket]);

const selectTicket = (t) => {
setSelectedTicket(t);
setReactions(pObj(t.reactions));
setReplyText("");
setSelectedFile(null);
setContextMenu(null);
setEmojiPicker(null);
setEditingMsg(null);
};

const handleReact = async (msgKey, emoji) => {
try {
const res = await axios.post(`${API}/api/support/${selectedTicket.ticket_id}/react`, { messageKey: msgKey, emoji }, { headers });
setReactions(res.data.reactions || {});
setEmojiPicker(null);
} catch { showToast("React failed", "error"); }
};

const handleDeleteMsg = async (msgIdx, msgSrc, scope) => {
setContextMenu(null);
try {
await axios.delete(`${API}/api/support/${selectedTicket.ticket_id}/message`, { headers, data: { messageIndex: msgIdx, messageSource: msgSrc, scope } });
showToast(scope === "everyone" ? "Deleted for everyone" : "Deleted for you");
fetchTickets();
} catch { showToast("Delete failed", "error"); }
};

const openEditMsg = (msg) => {
setContextMenu(null);
setEditingMsg(msg);
setEditContent(msg.content || "");
};

const handleEditMsgSave = async () => {
if (!editContent.trim() || !editingMsg) return;
setEditSaving(true);
try {
await axios.put(`${API}/api/support/${selectedTicket.ticket_id}/edit-message`, {
messageIndex: editingMsg._index,
messageSource: editingMsg._source,
newContent: editContent.trim(),
}, { headers });
showToast("Message updated");
setEditingMsg(null);
fetchTickets();
} catch { showToast("Edit failed", "error"); } finally { setEditSaving(false); }
};

const handleReply = async (e) => {
e.preventDefault();
if (!replyText.trim()) return;
setSubmitting(true);
try {
await axios.post(`${API}/api/support/${selectedTicket.ticket_id}/reply`, { reply_text: replyText }, { headers });
showToast("Reply sent!");
setReplyText("");
fetchTickets();
} catch (err) { showToast(err.response?.data?.message || "Failed", "error"); } finally { setSubmitting(false); }
};

const handleDeleteTicket = async (tid) => {
if (!window.confirm("Delete this ticket?")) return;
try {
await axios.delete(`${API}/api/support/${tid}`, { headers });
showToast("Ticket deleted");
setSelectedTicket(null);
fetchTickets();
} catch { showToast("Delete failed", "error"); }
};

const handleFileSelect = (e) => {
const f = e.target.files[0];
if (f && f.size > 5242880) { showToast("Max 5MB", "error"); return; }
setSelectedFile(f);
};

const uploadFile = async () => {
if (!selectedFile || !selectedTicket) return;
setUploading(true);
try {
const fd = new FormData(); fd.append("file", selectedFile);
await axios.post(`${API}/api/attachments/${selectedTicket.ticket_id}`, fd, { headers: { ...headers, "Content-Type": "multipart/form-data" } });
showToast("Uploaded!");
setSelectedFile(null);
const res = await axios.get(`${API}/api/attachments/${selectedTicket.ticket_id}`, { headers });
setAttachments(res.data.data || []);
} catch { showToast("Upload failed", "error"); } finally { setUploading(false); }
};

const buildThread = (ticket) => {
const initial = pArr(ticket.messages).map((m, i) => ({ ...m, _source: "messages", _index: i })).filter(m => !(m.deletedFor || []).includes(userId));
const replies = pArr(ticket.conversation).map((c, i) => ({ ...c, _source: "conversation", _index: i })).filter(c => !(c.deletedFor || []).includes(userId)).map(c => ({
role: "admin", content: `**${c.sender || "Admin"} replied:** ${c.content}`, timestamp: c.timestamp, _source: "conversation", _index: c._index,
}));
return [...initial, ...replies].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const getMsgKey = (msg) => msg._source && msg._index !== undefined ? `${msg._source}-${msg._index}` : null;
const thread = selectedTicket ? buildThread(selectedTicket) : [];

return (
<div className="d-flex bg-light min-vh-100" onClick={() => { setContextMenu(null); setEmojiPicker(null); }}>
<Sidebar />
<PageContent style={{ backgroundColor: "#f8f9fa" }}>
<div className="container-fluid p-2 p-md-4">

{toast && (
<div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
{toast.message}
</div>
)}

<div className="mb-4">
<h2 className="fw-bold mb-1 fs-4">Support Tickets {openCount > 0 && <span className="badge bg-danger ms-2" style={{ fontSize: 12 }}>{openCount} New</span>}</h2>
<p className="text-muted mb-0 small">Manage and reply to employee support requests</p>
</div>

<div className="row g-3">
<div className="col-12 col-lg-4">
<div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
<div className="card-body p-0" style={{ maxHeight: "60vh", overflowY: "auto" }}>
{loading && <div className="text-center p-4">Loading...</div>}
{!loading && tickets.length === 0 && <div className="text-center p-4">No tickets.</div>}
{tickets.map(ticket => (
<div key={ticket.ticket_id} onClick={() => selectTicket(ticket)} style={{ padding: "14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: selectedTicket?.ticket_id === ticket.ticket_id ? "#f0f4ff" : "#fff", borderLeft: selectedTicket?.ticket_id === ticket.ticket_id ? "4px solid #4f46e5" : "4px solid transparent" }}>
<div className="d-flex justify-content-between">
<span style={{ fontWeight: 600, fontSize: 13 }}>{ticket.user_name} {ticket.status === "open" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />}</span>
</div>
<div className="text-truncate small text-muted">{ticket.subject}</div>
</div>
))}
</div>
</div>
</div>

<div className="col-12 col-lg-8">
{!selectedTicket ? (
<div className="card border-0 shadow-sm d-none d-lg-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
<div className="text-center text-muted"><MessageSquare size={48} className="opacity-25 mb-3" /><h6>Select a ticket</h6></div>
</div>
) : (
<div className="card border-0 shadow-sm">
<div className="card-body p-3 p-md-4">
<div className="d-flex justify-content-between mb-3">
<div><h6 className="fw-bold mb-0">{selectedTicket.subject}</h6><small className="text-muted">{selectedTicket.user_email}</small></div>
<button className="btn btn-sm btn-light text-danger" onClick={() => handleDeleteTicket(selectedTicket.ticket_id)}>Delete</button>
</div>

<div style={{ background: "#f8fafc", borderRadius: 12, padding: 12, height: 350, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 15 }} onClick={e => e.stopPropagation()}>
{thread.map((msg, idx) => {
const isUser = msg.role === "user";
const msgKey = getMsgKey(msg);
const mr = msgKey && reactions[msgKey] ? reactions[msgKey] : {};
return (
<div key={idx} style={{ alignSelf: isUser ? "flex-end" : "flex-start", maxWidth: "85%" }}>
<div style={{ position: "relative" }}>
<div style={{ background: isUser ? "#4f46e5" : "#fff", color: isUser ? "#fff" : "#1e293b", padding: "8px 12px", borderRadius: 12, fontSize: 13, border: isUser ? "none" : "1px solid #e2e8f0" }} dangerouslySetInnerHTML={{ __html: renderC(msg.content) }} />
{msg.edited && <span style={{ fontSize: 10, color: isUser ? "#c7d2fe" : "#94a3b8", marginTop: 2, display: "block" }}>edited</span>}

<div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: isUser ? "flex-end" : "flex-start" }}>
<button onClick={(e) => { e.stopPropagation(); setEmojiPicker(emojiPicker === idx ? null : idx); setContextMenu(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", padding: "2px 5px", borderRadius: 6, lineHeight: 1 }}>😊</button>
<button onClick={(e) => { e.stopPropagation(); setContextMenu(contextMenu === idx ? null : idx); setEmojiPicker(null); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", padding: "2px 5px", borderRadius: 6, lineHeight: 1 }}>⋯</button>
</div>

{emojiPicker === idx && (
<div style={{ position: "absolute", zIndex: 9999, bottom: "calc(100% + 6px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: "6px 8px", display: "flex", gap: 2 }} onClick={e => e.stopPropagation()}>
{EMOJI_LIST.map(e => (
<button key={e} onClick={() => { handleReact(msgKey, e); setEmojiPicker(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 5px", borderRadius: 8, lineHeight: 1 }}>{e}</button>
))}
</div>
)}

{contextMenu === idx && (
<div style={{ position: "absolute", zIndex: 9999, top: 0, [isUser ? "right" : "left"]: "calc(100% + 6px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", minWidth: 160, overflow: "hidden" }} onClick={e => e.stopPropagation()}>
<button onClick={() => openEditMsg(msg)} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", textAlign: "left", fontSize: 13, cursor: "pointer", color: "#4f46e5", fontWeight: 500 }}>✏️ Edit Message</button>
<button onClick={() => handleDeleteMsg(msg._index, msg._source, "me")} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", textAlign: "left", fontSize: 13, cursor: "pointer", color: "#64748b" }}>🙈 Delete for me</button>
<button onClick={() => handleDeleteMsg(msg._index, msg._source, "everyone")} style={{ display: "block", width: "100%", padding: "9px 14px", background: "none", border: "none", textAlign: "left", fontSize: 13, cursor: "pointer", color: "#ef4444" }}>🗑️ Delete for everyone</button>
</div>
)}
</div>

{Object.keys(mr).length > 0 && (
<div className="d-flex gap-1 mt-1">
{Object.entries(mr).map(([em, uids]) => <span key={em} className="badge bg-light text-dark border" style={{ fontSize: 10 }}>{em} {uids.length}</span>)}
</div>
)}
</div>
);
})}
<div ref={convEndRef} />
</div>

<div className="mb-3">
<div className="d-flex justify-content-between align-items-center mb-2">
<span className="small fw-bold">Attachments ({attachments.length})</span>
<button className="btn btn-sm btn-outline-primary" onClick={() => fileRef.current.click()}><Paperclip size={12} /> Attach</button>
</div>
{selectedFile && <div className="alert alert-info py-1 px-2 small d-flex justify-content-between">{selectedFile.name} <button className="btn btn-sm p-0" onClick={uploadFile}>{uploading ? "..." : "Upload"}</button></div>}
</div>

<form onSubmit={handleReply}>
<textarea className="form-control mb-2" rows={3} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Reply..." style={{ fontSize: 13 }} />
<button type="submit" className="btn btn-primary w-100 w-md-auto" disabled={submitting || !replyText.trim()}>{submitting ? "Sending..." : "Send Reply"}</button>
</form>
</div>
</div>
)}
</div>
</div>
</div>
</PageContent>

{editingMsg && (
<div onClick={() => setEditingMsg(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
<div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: "28px", width: "100%", maxWidth: 460, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
<div className="d-flex justify-content-between align-items-center mb-3">
<h6 className="fw-bold mb-0" style={{ color: "#0f172a" }}>Edit Message</h6>
<button onClick={() => setEditingMsg(null)} style={{ background: "none", border: "none", fontSize: 22, color: "#94a3b8", cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>
</div>
<textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} style={{ width: "100%", borderRadius: 10, fontSize: 14, border: "1.5px solid #e2e8f0", padding: "10px 12px", outline: "none", color: "#1e293b", resize: "vertical" }} />
<div style={{ display: "flex", gap: 10, marginTop: 14 }}>
<button onClick={() => setEditingMsg(null)} style={{ flex: 1, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, fontWeight: 600, fontSize: 14, padding: "10px 0", cursor: "pointer", color: "#64748b" }}>Cancel</button>
<button onClick={handleEditMsgSave} disabled={editSaving || !editContent.trim()} style={{ flex: 1, background: editSaving ? "#a5b4fc" : "#4f46e5", border: "none", borderRadius: 10, fontWeight: 600, fontSize: 14, padding: "10px 0", cursor: editSaving ? "not-allowed" : "pointer", color: "#fff" }}>
{editSaving ? "Saving..." : "Save"}
</button>
</div>
</div>
</div>
)}

<input ref={fileRef} type="file" style={{ display: "none" }} onChange={handleFileSelect} />
</div>
);
}