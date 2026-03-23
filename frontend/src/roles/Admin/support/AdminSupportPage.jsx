
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { Paperclip, Download, FileText, Image, X, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const EMOJI_LIST = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];

const fmtSz = (b) => {
if (!b) return "";
if (b < 1024) return b + " B";
if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
return (b / 1048576).toFixed(1) + " MB";
};

const isImg = (ft) => ft && ft.startsWith("image/");

const pArr = (d) => {
if (!d) return [];
if (Array.isArray(d)) return d;
try { return JSON.parse(d); } catch { return []; }
};

const pObj = (d) => {
if (!d) return {};
if (typeof d === "object" && !Array.isArray(d)) return d;
try { return JSON.parse(d); } catch { return {}; }
};

const fmtT = (ts) => {
if (!ts) return "";
return new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

const renderC = (c) =>
String(c || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

function EmojiPicker({ onSelect, onClose }) {
useEffect(() => {
const h = (e) => { if (e.key === "Escape") onClose(); };
document.addEventListener("keydown", h);
return () => document.removeEventListener("keydown", h);
}, [onClose]);

return (
<div style={{ position: "absolute", zIndex: 9999, bottom: "calc(100% + 6px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: "6px 8px", display: "flex", gap: 2 }}>
{EMOJI_LIST.map(e => (
<button key={e} onClick={() => { onSelect(e); onClose(); }}
style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 5px", borderRadius: 8, lineHeight: 1 }}
onMouseEnter={ev => ev.currentTarget.style.background = "#f1f5f9"}
onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
{e}
</button>
))}
</div>
);
}

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

const convEndRef = useRef(null);
const fileRef = useRef(null);
const selectedTicketRef = useRef(null);
selectedTicketRef.current = selectedTicket;

const token = localStorage.getItem("token");
const userId = (() => { try { return JSON.parse(atob(token.split(".")[1])).id; } catch { return null; } })();
const headers = { "x-auth-token": token };

const showToast = (m, t = "success") => {
setToast({ message: m, type: t });
setTimeout(() => setToast(null), 3000);
};

const fetchTickets = useCallback(async () => {
try {
const [tr, cr] = await Promise.all([
axios.get(`${API}/api/support`, { headers }),
axios.get(`${API}/api/support/count`, { headers }),
]);
const all = tr.data.data || [];
setTickets(all);
setOpenCount(cr.data.count || 0);
const current = selectedTicketRef.current;
if (current) {
const updated = all.find(t => t.ticket_id === current.ticket_id);
if (updated) { setSelectedTicket(updated); setReactions(pObj(updated.reactions)); }
}
} catch {
showToast("Failed to load", "error");
}
finally {
setLoading(false);
}
}, []); 

useEffect(() => {
fetchTickets();
const iv = setInterval(fetchTickets, 15000);
return () => clearInterval(iv);
}, [fetchTickets]); // eslint-disable-line

useEffect(() => { convEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicket]);

useEffect(() => {
if (!selectedTicket) { setAttachments([]); return; }
axios.get(`${API}/api/attachments/${selectedTicket.ticket_id}`, { headers })
.then(r => setAttachments(r.data.data || []))
.catch(() => {});
}, [selectedTicket]); // eslint-disable-line

useEffect(() => {
const h = () => { setContextMenu(null); setEmojiPicker(null); };
document.addEventListener("click", h);
return () => document.removeEventListener("click", h);
}, []);

const selectTicket = (t) => {
setSelectedTicket(t);
setReactions(pObj(t.reactions));
setReplyText("");
setSelectedFile(null);
setContextMenu(null);
setEmojiPicker(null);
};

const handleReact = async (msgKey, emoji) => {
try {
const res = await axios.post(
`${API}/api/support/${selectedTicket.ticket_id}/react`,
{ messageKey: msgKey, emoji },
{ headers }
);
setReactions(res.data.reactions || {});
setEmojiPicker(null);
} catch {
showToast("React failed", "error");
}
};

const handleDeleteMsg = async (msgIdx, msgSrc, scope) => {
setContextMenu(null);
try {
await axios.delete(
`${API}/api/support/${selectedTicket.ticket_id}/message`,
{ headers, data: { messageIndex: msgIdx, messageSource: msgSrc, scope } }
);
showToast(scope === "everyone" ? "Deleted for everyone" : "Deleted for you");
const res = await axios.get(`${API}/api/support`, { headers });
const all = res.data.data || [];
setTickets(all);
const updated = all.find(t => t.ticket_id === selectedTicket.ticket_id);
if (updated) { setSelectedTicket(updated); setReactions(pObj(updated.reactions)); }
} catch {
showToast("Delete failed", "error");
}
};

const handleReply = async (e) => {
e.preventDefault();
if (!replyText.trim()) return;
setSubmitting(true);
try {
await axios.post(
`${API}/api/support/${selectedTicket.ticket_id}/reply`,
{ reply_text: replyText },
{ headers }
);
showToast("Reply sent!");
setReplyText("");
const res = await axios.get(`${API}/api/support`, { headers });
const all = res.data.data || [];
setTickets(all);
setOpenCount(all.filter(t => t.status === "open").length);
const updated = all.find(t => t.ticket_id === selectedTicket.ticket_id);
if (updated) { setSelectedTicket(updated); setReactions(pObj(updated.reactions)); }
} catch (err) {
showToast(err.response?.data?.message || "Failed", "error");
} finally {
setSubmitting(false);
}
};

const handleDeleteTicket = async (tid) => {
if (!window.confirm("Delete this ticket?")) return;
try {
await axios.delete(`${API}/api/support/${tid}`, { headers });
showToast("Ticket deleted");
setSelectedTicket(null);
fetchTickets();
} catch {
showToast("Delete failed", "error");
}
};

const handleFileSelect = (e) => {
const f = e.target.files[0];
if (!f) return;
if (f.size > 5242880) { showToast("Max 5MB", "error"); return; }
setSelectedFile(f);
};

const uploadFile = async () => {
if (!selectedFile || !selectedTicket) return;
setUploading(true);
try {
const fd = new FormData();
fd.append("file", selectedFile);
await axios.post(
`${API}/api/attachments/${selectedTicket.ticket_id}`,
fd,
{ headers: { ...headers, "Content-Type": "multipart/form-data" } }
);
showToast("Uploaded!");
setSelectedFile(null);
if (fileRef.current) fileRef.current.value = "";
const res = await axios.get(`${API}/api/attachments/${selectedTicket.ticket_id}`, { headers });
setAttachments(res.data.data || []);
} catch (err) {
showToast(err.response?.data?.message || "Upload failed", "error");
} finally {
setUploading(false);
}
};

const buildThread = (ticket) => {
const initial = pArr(ticket.messages)
.map((m, i) => ({ ...m, _source: "messages", _index: i }))
.filter(m => !(m.deletedFor || []).includes(userId));

const replies = pArr(ticket.conversation)
.map((c, i) => ({ ...c, _source: "conversation", _index: i }))
.filter(c => !(c.deletedFor || []).includes(userId))
.map(c => ({
role: "admin",
content: `**${c.sender || "Admin"} replied:** ${c.content}`,
timestamp: c.timestamp,
_source: "conversation",
_index: c._index,
}));

return [...initial, ...replies].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
};

const getMsgKey = (msg) =>
msg._source && msg._index !== undefined ? `${msg._source}-${msg._index}` : null;

const getBubbleStyle = (role) => {
if (role === "user") return { bg: "#4f46e5", color: "#fff", r: "12px 12px 3px 12px", align: "flex-end" };
if (role === "admin") return { bg: "#e0e7ff", color: "#1e293b", r: "12px 12px 12px 3px", align: "flex-start", border: "1px solid #c7d2fe" };
return { bg: "#fff", color: "#1e293b", r: "12px 12px 12px 3px", align: "flex-start" };
};

const thread = selectedTicket ? buildThread(selectedTicket) : [];

return (
<div className="d-flex bg-light min-vh-100" onClick={() => { setContextMenu(null); setEmojiPicker(null); }}>
<Sidebar />
<div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

{toast && (
<div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
{toast.message}
</div>
)}

<div className="mb-4">
<h2 className="fw-bold mb-1">
Support Tickets
{openCount > 0 && <span className="badge bg-danger ms-2" style={{ fontSize: 14 }}>{openCount} New</span>}
</h2>
<p className="text-muted mb-0">Manage and reply to employee support requests</p>
</div>

<div className="row g-3">
<div className="col-lg-4">
<div className="card border-0 shadow-sm">
<div className="card-body p-0">
{loading && <div className="text-center text-muted p-4">Loading...</div>}
{!loading && tickets.length === 0 && <div className="text-center text-muted p-4">No tickets yet.</div>}
{!loading && tickets.map(ticket => {
const isSel = selectedTicket?.ticket_id === ticket.ticket_id;
return (
<div key={ticket.ticket_id} onClick={() => selectTicket(ticket)}
style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: isSel ? "#f0f4ff" : "#fff", borderLeft: isSel ? "3px solid #4f46e5" : "3px solid transparent" }}>
<div className="d-flex justify-content-between align-items-start mb-1">
<span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
{ticket.user_name || "Unknown"}
{ticket.status === "open" && (
<span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginLeft: 6 }} />
)}
</span>
</div>
<div style={{ fontSize: 12, color: "#64748b", marginBottom: 3 }} className="text-truncate">{ticket.subject}</div>
<div style={{ fontSize: 11, color: "#94a3b8" }}>
{new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
</div>
</div>
);
})}
</div>
</div>
</div>

<div className="col-lg-8">
{!selectedTicket ? (
<div className="card border-0 shadow-sm" style={{ minHeight: 400 }}>
<div className="card-body d-flex align-items-center justify-content-center">
<div className="text-center text-muted">
<div style={{ fontSize: 48, marginBottom: 12 }}>--</div>
<div className="fw-semibold">Select a ticket to view and reply</div>
</div>
</div>
</div>
) : (
<div className="card border-0 shadow-sm">
<div className="card-body p-4">

<div className="d-flex justify-content-between align-items-start mb-3">
<div>
<h6 className="fw-bold mb-1">{selectedTicket.subject}</h6>
<div style={{ fontSize: 13, color: "#64748b" }}>
From: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
</div>
</div>
<button className="btn btn-sm" style={{ background: "#fff1f2", color: "#ef4444", fontWeight: 500 }}
onClick={() => handleDeleteTicket(selectedTicket.ticket_id)}>
Delete
</button>
</div>

<div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
Conversation
<span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400, marginLeft: 8 }}>hover to react or delete</span>
</div>

<div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}
onClick={e => e.stopPropagation()}>

{thread.length === 0 && (
<div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No messages yet.</div>
)}

{thread.map((msg, idx) => {
const bs = getBubbleStyle(msg.role);
const msgKey = getMsgKey(msg);
const isUser = msg.role === "user";
const mr = msgKey && reactions[msgKey] ? reactions[msgKey] : {};

return (
<div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: bs.align === "flex-end" ? "flex-end" : "flex-start" }}>
<div
style={{ display: "flex", alignItems: "flex-end", gap: 4, flexDirection: isUser ? "row-reverse" : "row", position: "relative" }}
onMouseEnter={e => { const b = e.currentTarget.querySelector(`[data-bar="${idx}"]`); if (b) b.style.opacity = "1"; }}
onMouseLeave={e => { const b = e.currentTarget.querySelector(`[data-bar="${idx}"]`); if (b && emojiPicker !== idx) b.style.opacity = "0"; }}
>
<div
style={{ maxWidth: "80%", padding: "8px 12px", borderRadius: bs.r, background: bs.bg, color: bs.color, fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: bs.border || "none" }}
dangerouslySetInnerHTML={{ __html: renderC(msg.content) }}
/>

{msgKey && (
<div data-bar={idx} style={{ display: "flex", gap: 3, opacity: 0, transition: "opacity 0.15s", flexShrink: 0, position: "relative" }}>
<button
onClick={e => { e.stopPropagation(); setContextMenu(null); setEmojiPicker(emojiPicker === idx ? null : idx); }}
style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "2px 5px", cursor: "pointer", fontSize: 14, lineHeight: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
react
</button>
<button
onClick={e => { e.stopPropagation(); setEmojiPicker(null); setContextMenu(contextMenu?.idx === idx ? null : { idx, source: msg._source, index: msg._index }); }}
style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "3px 5px", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
<Trash2 size={11} color="#94a3b8" />
</button>

{emojiPicker === idx && (
<div style={{ position: "absolute", [isUser ? "right" : "left"]: 0, bottom: "calc(100% + 6px)", zIndex: 9999 }}
onClick={e => e.stopPropagation()}>
<EmojiPicker onSelect={em => handleReact(msgKey, em)} onClose={() => setEmojiPicker(null)} />
</div>
)}

{contextMenu?.idx === idx && (
<div style={{ position: "absolute", [isUser ? "right" : "left"]: 0, bottom: "calc(100% + 4px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 9999, minWidth: 180, overflow: "hidden" }}
onClick={e => e.stopPropagation()}>
<button
onClick={() => handleDeleteMsg(contextMenu.index, contextMenu.source, "self")}
style={{ width: "100%", padding: "10px 14px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#374151" }}
onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
Delete for Me
</button>
<div style={{ height: 1, background: "#f1f5f9" }} />
<button
onClick={() => handleDeleteMsg(contextMenu.index, contextMenu.source, "everyone")}
style={{ width: "100%", padding: "10px 14px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#ef4444" }}
onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
Delete for Everyone
</button>
</div>
)}
</div>
)}
</div>

{Object.keys(mr).length > 0 && (
<div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
{Object.entries(mr).map(([em, uids]) => {
if (!uids?.length) return null;
const mine = uids.includes(userId);
return (
<button key={em} onClick={() => handleReact(msgKey, em)}
style={{ background: mine ? "#e0e7ff" : "#f1f5f9", border: mine ? "1px solid #a5b4fc" : "1px solid #e2e8f0", borderRadius: 20, padding: "2px 7px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}>
<span style={{ fontSize: 13 }}>{em}</span>
<span style={{ color: mine ? "#4f46e5" : "#64748b", fontWeight: mine ? 700 : 500 }}>{uids.length}</span>
</button>
);
})}
</div>
)}

<div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>
{msg.role === "admin" ? "Admin - " : msg.role === "user" ? selectedTicket.user_name + " - " : "AI - "}
{fmtT(msg.timestamp)}
</div>
</div>
);
})}

<div ref={convEndRef} />
</div>

<div style={{ marginBottom: 16 }}>
<div className="d-flex justify-content-between align-items-center mb-2">
<div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
Attachments {attachments.length > 0 && <span style={{ color: "#4f46e5" }}>({attachments.length})</span>}
</div>
<div>
<input ref={fileRef} type="file" style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileSelect} />
<button onClick={() => fileRef.current?.click()} className="btn btn-sm btn-outline-primary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
<Paperclip size={13} /> Attach
</button>
</div>
</div>

{selectedFile && (
<div style={{ background: "#f0f4ff", borderRadius: 8, padding: "8px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, border: "1px solid #e0e7ff" }}>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedFile.name}</div>
<div style={{ fontSize: 10, color: "#64748b" }}>{fmtSz(selectedFile.size)}</div>
</div>
<button onClick={uploadFile} disabled={uploading} className="btn btn-sm btn-primary" style={{ fontSize: 12 }}>
{uploading ? "Uploading..." : "Upload"}
</button>
<button onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = ""; }}
style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 2 }}>
<X size={14} />
</button>
</div>
)}

{attachments.length > 0 ? (
<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
{attachments.map(att => (
<div key={att.attachment_id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
{isImg(att.file_type) ? <Image size={16} color="#4f46e5" /> : <FileText size={16} color="#64748b" />}
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</div>
<div style={{ fontSize: 11, color: "#94a3b8" }}>By {att.uploader_name} - {fmtSz(att.file_size)}</div>
</div>
{isImg(att.file_type) && (
<a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" style={{ fontSize: 11 }}>View</a>
)}
<a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name} className="btn btn-sm btn-outline-primary" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
<Download size={12} /> Download
</a>
</div>
))}
</div>
) : (
<div style={{ fontSize: 12, color: "#94a3b8" }}>No attachments yet.</div>
)}
</div>

<div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Send Reply</div>
<form onSubmit={handleReply}>
<textarea className="form-control mb-2" rows={3}
placeholder="Type your reply to the employee..."
value={replyText} onChange={e => setReplyText(e.target.value)}
style={{ fontSize: 13, resize: "none" }}
/>
<button type="submit" className="btn btn-primary fw-semibold" disabled={submitting || !replyText.trim()}>
{submitting ? "Sending..." : "Send Reply"}
</button>
</form>

</div>
</div>
)}
</div>
</div>

</div>
</div>
);
}