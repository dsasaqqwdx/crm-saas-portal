import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { Paperclip, Download, FileText, Image, X, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const EMOJI_LIST = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];

const STATUS_COLORS = {
  open:       { bg: "#fef9c3", text: "#a16207" },
  inprogress: { bg: "#e0e7ff", text: "#4f46e5" },
  resolved:   { bg: "#dcfce7", text: "#16a34a" },
  closed:     { bg: "#f1f5f9", text: "#64748b" },
};

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};
const isImageType = (ft) => ft && ft.startsWith("image/");

const parseJSON = (data) => {
  if (!data) return [];
  if (typeof data === "string") { try { return JSON.parse(data); } catch { return []; } }
  return Array.isArray(data) ? data : [];
};
const parseObj = (raw) => {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) return raw;
  try { return JSON.parse(raw); } catch { return {}; }
};

// ── Emoji Picker ──────────────────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div style={{
      position: "absolute", zIndex: 9999, bottom: "calc(100% + 6px)",
      background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: "6px 8px",
      display: "flex", gap: 2,
    }} onClick={e => e.stopPropagation()}>
      {EMOJI_LIST.map(e => (
        <button key={e} onClick={() => { onSelect(e); onClose(); }}
          style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 5px", borderRadius: 8, lineHeight: 1, transition: "background 0.1s" }}
          onMouseEnter={ev => ev.currentTarget.style.background = "#f1f5f9"}
          onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
        >{e}</button>
      ))}
    </div>
  );
}

// ── Reaction Bar ──────────────────────────────────────────────────────────────
function ReactionBar({ reactions, messageKey, currentUserId, onReact }) {
  if (!reactions || !reactions[messageKey]) return null;
  const msgReactions = reactions[messageKey];
  const entries = Object.entries(msgReactions).filter(([, ids]) => ids.length > 0);
  if (!entries.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 4 }}>
      {entries.map(([emoji, userIds]) => {
        const mine = userIds.includes(currentUserId);
        return (
          <button key={emoji} onClick={() => onReact(messageKey, emoji)}
            style={{
              background: mine ? "#e0e7ff" : "#f1f5f9",
              border: mine ? "1px solid #a5b4fc" : "1px solid #e2e8f0",
              borderRadius: 20, padding: "2px 7px", cursor: "pointer",
              fontSize: 12, display: "flex", alignItems: "center", gap: 3,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = mine ? "#c7d2fe" : "#e2e8f0"}
            onMouseLeave={e => e.currentTarget.style.background = mine ? "#e0e7ff" : "#f1f5f9"}
          >
            <span style={{ fontSize: 13 }}>{emoji}</span>
            <span style={{ color: mine ? "#4f46e5" : "#64748b", fontWeight: mine ? 700 : 500 }}>{userIds.length}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Context Menu ──────────────────────────────────────────────────────────────
function MessageContextMenu({ x, y, onDeleteForMe, onDeleteForEveryone, onClose }) {
  useEffect(() => {
    const h = () => onClose();
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [onClose]);
  return (
    <div style={{ position: "fixed", top: y, left: x, zIndex: 99999, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", minWidth: 190, overflow: "hidden" }}
      onClick={e => e.stopPropagation()}>
      <button onClick={onDeleteForMe} style={ctxBtn}
        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <Trash2 size={13} color="#64748b" style={{ flexShrink: 0 }} /> Delete for me
      </button>
      <button onClick={onDeleteForEveryone} style={{ ...ctxBtn, color: "#ef4444", borderTop: "1px solid #f1f5f9" }}
        onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        <Trash2 size={13} color="#ef4444" style={{ flexShrink: 0 }} /> Delete for everyone
      </button>
    </div>
  );
}
const ctxBtn = {
  display: "flex", alignItems: "center", gap: 8, width: "100%",
  padding: "9px 14px", background: "transparent", border: "none",
  cursor: "pointer", fontSize: 13, color: "#1e293b", textAlign: "left",
};

// ── Message Bubble with hover actions ────────────────────────────────────────
function MessageBubble({ msg, source, index, isUser, userName, reactions, messageKey, currentUserId, onReact, onRightClick, activeEmojiPicker, setActiveEmojiPicker }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", position: "relative" }}
      onContextMenu={e => onRightClick(e, source, index)}>
      <div style={{ maxWidth: "80%", position: "relative" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); }}>

        {/* Action buttons */}
        {hovered && (
          <div style={{
            position: "absolute", top: -10,
            [isUser ? "left" : "right"]: 0,
            display: "flex", gap: 3, zIndex: 10,
          }}>
            {messageKey && (
              <button
                onClick={e => { e.stopPropagation(); setActiveEmojiPicker(activeEmojiPicker === messageKey ? null : messageKey); }}
                style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "2px 5px", cursor: "pointer", fontSize: 14, lineHeight: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
                title="React"
              >😊</button>
            )}
            <button
              onClick={e => { e.stopPropagation(); onRightClick(e, source, index); }}
              style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "3px 5px", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}
              title="Delete"
            ><Trash2 size={11} color="#94a3b8" /></button>
          </div>
        )}

        {/* Emoji Picker */}
        {activeEmojiPicker === messageKey && (
          <div style={{ position: "absolute", [isUser ? "right" : "left"]: 0, bottom: "calc(100% + 6px)", zIndex: 9999 }}>
            <EmojiPicker
              onSelect={emoji => { onReact(messageKey, emoji); setActiveEmojiPicker(null); }}
              onClose={() => setActiveEmojiPicker(null)}
            />
          </div>
        )}

        {/* Bubble */}
        <div style={{
          padding: "8px 12px",
          borderRadius: isUser ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
          background: isUser ? "#4f46e5" : source === "conversation" ? "#e0e7ff" : "#fff",
          color: isUser ? "#fff" : "#1e293b",
          fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          cursor: "context-menu",
        }}>
          <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 2, fontWeight: 600, color: source === "conversation" ? "#4f46e5" : undefined }}>
            {isUser ? userName : (msg.sender || "Admin")}
            {msg.timestamp && <span> • {new Date(msg.timestamp).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>}
          </div>
          {msg.content}
        </div>

        {/* Reaction bar */}
        {messageKey && (
          <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
            <ReactionBar reactions={reactions} messageKey={messageKey} currentUserId={currentUserId} onReact={onReact} />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSupportPage() {
  const [tickets, setTickets]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText]       = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [toast, setToast]               = useState(null);
  const [openCount, setOpenCount]       = useState(0);
  const [attachments, setAttachments]   = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading]       = useState(false);
  const [reactions, setReactions]       = useState({});
  const [contextMenu, setContextMenu]   = useState(null);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState(null);

  const conversationEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };
  const adminUserId = localStorage.getItem("user_id");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const [ticketsRes, countRes] = await Promise.all([
        axios.get(`${API}/api/support`, { headers }),
        axios.get(`${API}/api/support/count`, { headers }),
      ]);
      setTickets(ticketsRes.data.data || []);
      setOpenCount(countRes.data.count || 0);
    } catch { showToast("Failed to load tickets", "error"); }
    finally { setLoading(false); }
  };

  const fetchAttachments = async (ticketId) => {
    try {
      const res = await axios.get(`${API}/api/attachments/${ticketId}`, { headers });
      setAttachments(res.data.data || []);
    } catch {}
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  useEffect(() => {
    if (selectedTicket) {
      fetchAttachments(selectedTicket.ticket_id);
      setReactions(parseObj(selectedTicket.reactions));
    } else {
      setAttachments([]);
      setReactions({});
    }
  }, [selectedTicket]); // eslint-disable-line

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/api/support/${selectedTicket.ticket_id}/reply`, { reply_text: replyText }, { headers });
      showToast("Reply sent!");
      setReplyText("");
      const res = await axios.get(`${API}/api/support`, { headers });
      const all = res.data.data || [];
      setTickets(all);
      setOpenCount(all.filter(t => t.status === "open").length);
      const updated = all.find(t => t.ticket_id === selectedTicket.ticket_id);
      if (updated) setSelectedTicket(updated);
    } catch (err) { showToast(err.response?.data?.message || "Failed to send reply", "error"); }
    finally { setSubmitting(false); }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await axios.put(`${API}/api/support/${ticketId}/status`, { status }, { headers });
      showToast("Status updated");
      fetchTickets();
      if (selectedTicket?.ticket_id === ticketId) setSelectedTicket(prev => ({ ...prev, status }));
    } catch { showToast("Update failed", "error"); }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${API}/api/support/${ticketId}`, { headers });
      showToast("Ticket deleted");
      setSelectedTicket(null);
      setAttachments([]);
      setReactions({});
      fetchTickets();
    } catch { showToast("Delete failed", "error"); }
  };

  // ── Emoji react ────────────────────────────────────────────────────────────
  const handleReact = async (messageKey, emoji) => {
    if (!selectedTicket) return;
    try {
      const res = await axios.post(
        `${API}/api/support/${selectedTicket.ticket_id}/react`,
        { messageKey, emoji },
        { headers }
      );
      setReactions(res.data.reactions || {});
      // Also patch the ticket in state so it persists across re-renders
      setSelectedTicket(prev => ({ ...prev, reactions: JSON.stringify(res.data.reactions || {}) }));
    } catch { showToast("Reaction failed", "error"); }
  };

  // ── Delete message ─────────────────────────────────────────────────────────
  const handleDeleteMessage = async (source, index, scope) => {
    setContextMenu(null);
    if (!selectedTicket) return;
    try {
      await axios.delete(`${API}/api/support/${selectedTicket.ticket_id}/message`, {
        headers,
        data: { messageIndex: index, messageSource: source, scope },
      });
      showToast(scope === "everyone" ? "Deleted for everyone" : "Deleted for you");
      const res = await axios.get(`${API}/api/support`, { headers });
      const all = res.data.data || [];
      setTickets(all);
      const updated = all.find(t => t.ticket_id === selectedTicket.ticket_id);
      if (updated) { setSelectedTicket(updated); setReactions(parseObj(updated.reactions)); }
    } catch (err) { showToast(err.response?.data?.message || "Delete failed", "error"); }
  };

  const handleRightClick = (e, source, index) => {
    e.preventDefault();
    setActiveEmojiPicker(null);
    setContextMenu({ x: e.clientX, y: e.clientY, source, index });
  };

  // ── File Upload ────────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("File must be under 5MB", "error"); return; }
    setSelectedFile(file);
  };
  const uploadFile = async () => {
    if (!selectedFile || !selectedTicket) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      await axios.post(`${API}/api/attachments/${selectedTicket.ticket_id}`, fd, { headers: { ...headers, "Content-Type": "multipart/form-data" } });
      showToast("File uploaded!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchAttachments(selectedTicket.ticket_id);
    } catch (err) { showToast(err.response?.data?.message || "Upload failed", "error"); }
    finally { setUploading(false); }
  };

  const formatTime = (ts) => ts ? new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  const visibleMessages    = parseJSON(selectedTicket?.messages).filter(m => !(m.deletedFor || []).includes(adminUserId));
  const visibleConversation = parseJSON(selectedTicket?.conversation).filter(c => !(c.deletedFor || []).includes(adminUserId));

  return (
    <div className="d-flex bg-light min-vh-100" onClick={() => { setContextMenu(null); setActiveEmojiPicker(null); }}>
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        {toast && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            {toast.message}
          </div>
        )}

        {contextMenu && (
          <MessageContextMenu
            x={contextMenu.x} y={contextMenu.y}
            onDeleteForMe={() => handleDeleteMessage(contextMenu.source, contextMenu.index, "self")}
            onDeleteForEveryone={() => handleDeleteMessage(contextMenu.source, contextMenu.index, "everyone")}
            onClose={() => setContextMenu(null)}
          />
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Support Tickets
              {openCount > 0 && <span className="badge bg-danger ms-2" style={{ fontSize: 14 }}>{openCount} New</span>}
            </h2>
            <p className="text-muted mb-0">Reply to employee support requests</p>
          </div>
        </div>

        <div className="row g-3">
          {/* Ticket List */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? <div className="text-center text-muted p-4">Loading...</div>
                  : tickets.length === 0 ? <div className="text-center text-muted p-4">No tickets found.</div>
                  : tickets.map(ticket => {
                    const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
                    const isSelected = selectedTicket?.ticket_id === ticket.ticket_id;
                    const convCount = parseJSON(ticket.conversation).length;
                    return (
                      <div key={ticket.ticket_id}
                        onClick={() => { setSelectedTicket(ticket); setReplyText(""); setSelectedFile(null); setContextMenu(null); setActiveEmojiPicker(null); }}
                        style={{ padding: "12px 14px", borderBottom: "1px solid #f1f5f9", cursor: "pointer", background: isSelected ? "#f0f4ff" : "#fff", borderLeft: isSelected ? "3px solid #4f46e5" : "3px solid transparent" }}>
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                            {ticket.user_name || "Unknown"}
                            {ticket.status === "open" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginLeft: 6 }} />}
                          </span>
                          <span style={{ background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                            {ticket.status === "inprogress" ? "In Progress" : ticket.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 3 }} className="text-truncate">{ticket.subject}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>
                          {new Date(ticket.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                          {convCount > 0 && <span style={{ color: "#4f46e5", marginLeft: 8 }}>💬 {convCount} {convCount === 1 ? "reply" : "replies"}</span>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="col-lg-8">
            {!selectedTicket ? (
              <div className="card border-0 shadow-sm" style={{ minHeight: 400 }}>
                <div className="card-body d-flex align-items-center justify-content-center">
                  <div className="text-center text-muted"><div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div><div className="fw-semibold">Select a ticket to view and reply</div></div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">

                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">{selectedTicket.subject}</h6>
                      <div style={{ fontSize: 13, color: "#64748b" }}>From: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})</div>
                    </div>
                    <button className="btn btn-sm" style={{ background: "#fff1f2", color: "#ef4444", fontWeight: 500 }} onClick={() => handleDeleteTicket(selectedTicket.ticket_id)}>Delete Ticket</button>
                  </div>

                  {/* Status */}
                  <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Status:</span>
                    {["open", "inprogress", "resolved", "closed"].map(s => {
                      const sc = STATUS_COLORS[s];
                      const isActive = selectedTicket.status === s;
                      return (
                        <button key={s} onClick={() => handleStatusChange(selectedTicket.ticket_id, s)}
                          style={{ background: isActive ? sc.bg : "#f1f5f9", color: isActive ? sc.text : "#64748b", border: isActive ? `1px solid ${sc.text}` : "1px solid #e2e8f0", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {s === "inprogress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      );
                    })}
                  </div>

                  {/* Conversation */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Full Conversation</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>Hover a message to react 😊 or delete it.</div>

                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}
                    onClick={e => e.stopPropagation()}>

                    {visibleMessages.map((msg, idx) => (
                      <MessageBubble
                        key={`msg-${idx}`}
                        msg={msg}
                        source="messages"
                        index={idx}
                        isUser={msg.role === "user"}
                        userName={selectedTicket.user_name}
                        reactions={reactions}
                        messageKey={`messages-${idx}`}
                        currentUserId={adminUserId}
                        onReact={handleReact}
                        onRightClick={handleRightClick}
                        activeEmojiPicker={activeEmojiPicker}
                        setActiveEmojiPicker={setActiveEmojiPicker}
                      />
                    ))}

                    {visibleMessages.length > 0 && visibleConversation.length > 0 && (
                      <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", padding: "4px 0" }}>── Admin Replies ──</div>
                    )}

                    {visibleConversation.map((msg, idx) => (
                      <MessageBubble
                        key={`conv-${idx}`}
                        msg={msg}
                        source="conversation"
                        index={idx}
                        isUser={false}
                        userName={selectedTicket.user_name}
                        reactions={reactions}
                        messageKey={`conversation-${idx}`}
                        currentUserId={adminUserId}
                        onReact={handleReact}
                        onRightClick={handleRightClick}
                        activeEmojiPicker={activeEmojiPicker}
                        setActiveEmojiPicker={setActiveEmojiPicker}
                      />
                    ))}

                    {visibleMessages.length === 0 && visibleConversation.length === 0 && (
                      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No messages yet.</div>
                    )}
                    <div ref={conversationEndRef} />
                  </div>

                  {/* Attachments */}
                  <div style={{ marginBottom: 16 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        📎 Attachments {attachments.length > 0 && <span style={{ color: "#4f46e5" }}>({attachments.length})</span>}
                      </div>
                      <div>
                        <input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileSelect} />
                        <button onClick={() => fileInputRef.current?.click()} className="btn btn-sm btn-outline-primary" style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                          <Paperclip size={13} /> Attach File
                        </button>
                      </div>
                    </div>
                    {selectedFile && (
                      <div style={{ background: "#f0f4ff", borderRadius: 8, padding: "8px 12px", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, border: "1px solid #e0e7ff" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📎 {selectedFile.name}</div>
                          <div style={{ fontSize: 10, color: "#64748b" }}>{formatFileSize(selectedFile.size)}</div>
                        </div>
                        <button onClick={uploadFile} disabled={uploading} className="btn btn-sm btn-primary" style={{ fontSize: 12, flexShrink: 0 }}>{uploading ? "Uploading..." : "Upload"}</button>
                        <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 2 }}><X size={14} /></button>
                      </div>
                    )}
                    {attachments.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {attachments.map(att => (
                          <div key={att.attachment_id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
                            {isImageType(att.file_type) ? <Image size={16} color="#4f46e5" /> : <FileText size={16} color="#64748b" />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>By {att.uploader_name} • {formatFileSize(att.file_size)} • {formatTime(att.uploaded_at)}</div>
                            </div>
                            {isImageType(att.file_type) && <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary" style={{ fontSize: 11 }}>View</a>}
                            <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name} className="btn btn-sm btn-outline-primary" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}><Download size={12} /> Download</a>
                          </div>
                        ))}
                      </div>
                    ) : <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}>No attachments yet.</div>}
                  </div>

                  {/* Reply Form */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Send Reply</div>
                  <form onSubmit={handleReply}>
                    <textarea className="form-control mb-2" rows={3} placeholder="Type your reply to the employee..." value={replyText} onChange={e => setReplyText(e.target.value)} style={{ fontSize: 13, resize: "none" }} />
                    <button type="submit" className="btn btn-primary fw-semibold" disabled={submitting || !replyText.trim()}>{submitting ? "Sending..." : "Send Reply"}</button>
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