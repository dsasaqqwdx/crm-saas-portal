import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { Paperclip, Download, FileText, Image, X, Trash2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

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

const isImageType = (fileType) => fileType && fileType.startsWith("image/");

// ── Context Menu ──────────────────────────────────────────────────────────────
function MessageContextMenu({ x, y, onDeleteForMe, onDeleteForEveryone, onClose }) {
  useEffect(() => {
    const handler = () => onClose();
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed", top: y, left: x, zIndex: 99999,
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)", minWidth: 190, overflow: "hidden",
      }}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={onDeleteForMe}
        style={ctxBtn}
        onMouseEnter={e => e.currentTarget.style.background = "#f1f5f9"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <Trash2 size={13} color="#64748b" style={{ flexShrink: 0 }} />
        Delete for me
      </button>
      <button
        onClick={onDeleteForEveryone}
        style={{ ...ctxBtn, color: "#ef4444", borderTop: "1px solid #f1f5f9" }}
        onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <Trash2 size={13} color="#ef4444" style={{ flexShrink: 0 }} />
        Delete for everyone
      </button>
    </div>
  );
}
const ctxBtn = {
  display: "flex", alignItems: "center", gap: 8, width: "100%",
  padding: "9px 14px", background: "transparent", border: "none",
  cursor: "pointer", fontSize: 13, color: "#1e293b", textAlign: "left",
};

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
  // Context menu
  const [contextMenu, setContextMenu]   = useState(null); // { x, y, source, index }
  const conversationEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

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
    } catch (err) { showToast("Failed to load tickets", "error"); }
    finally { setLoading(false); }
  };

  const fetchAttachments = async (ticketId) => {
    try {
      const res = await axios.get(`${API}/api/attachments/${ticketId}`, { headers });
      setAttachments(res.data.data || []);
    } catch (err) { console.error("Failed to fetch attachments:", err); }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (conversationEndRef.current)
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  useEffect(() => {
    if (selectedTicket) fetchAttachments(selectedTicket.ticket_id);
    else setAttachments([]);
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
      const allTickets = res.data.data || [];
      setTickets(allTickets);
      setOpenCount(allTickets.filter(t => t.status === "open").length);
      const updated = allTickets.find(t => t.ticket_id === selectedTicket.ticket_id);
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
    } catch (err) { showToast("Update failed", "error"); }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${API}/api/support/${ticketId}`, { headers });
      showToast("Ticket deleted");
      setSelectedTicket(null);
      setAttachments([]);
      fetchTickets();
    } catch (err) { showToast("Delete failed", "error"); }
  };

  // ── Delete individual message ─────────────────────────────────────────────
  const handleDeleteMessage = async (source, index, scope) => {
    setContextMenu(null);
    if (!selectedTicket) return;
    try {
      await axios.delete(
        `${API}/api/support/${selectedTicket.ticket_id}/message`,
        {
          headers,
          data: {
            messageIndex: index,
            messageSource: source,
            scope,
          },
        }
      );
      showToast(scope === "everyone" ? "Message deleted for everyone" : "Message deleted for you");
      // Refresh ticket data
      const res = await axios.get(`${API}/api/support`, { headers });
      const allTickets = res.data.data || [];
      setTickets(allTickets);
      const updated = allTickets.find(t => t.ticket_id === selectedTicket.ticket_id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  const handleRightClick = (e, source, index) => {
    e.preventDefault();
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
      const formData = new FormData();
      formData.append("file", selectedFile);
      await axios.post(`${API}/api/attachments/${selectedTicket.ticket_id}`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      showToast("File uploaded successfully!");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchAttachments(selectedTicket.ticket_id);
    } catch (err) { showToast(err.response?.data?.message || "Upload failed", "error"); }
    finally { setUploading(false); }
  };

  const parseJSON = (data) => {
    if (!data) return [];
    if (typeof data === "string") { try { return JSON.parse(data); } catch { return []; } }
    return Array.isArray(data) ? data : [];
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  const adminUserId = localStorage.getItem("user_id");

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        {toast && (
          <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", padding: "12px 20px", borderRadius: 8, fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            {toast.message}
          </div>
        )}

        {/* Context Menu */}
        {contextMenu && (
          <MessageContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
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
                        onClick={() => { setSelectedTicket(ticket); setReplyText(""); setSelectedFile(null); setContextMenu(null); }}
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
                  <div className="text-center text-muted">
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎫</div>
                    <div className="fw-semibold">Select a ticket to view and reply</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">

                  {/* Ticket Header */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">{selectedTicket.subject}</h6>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        From: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ background: "#fff1f2", color: "#ef4444", fontWeight: 500 }}
                      onClick={() => handleDelete(selectedTicket.ticket_id)}>Delete Ticket</button>
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

                  {/* Conversation hint */}
                  <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                    Right-click or hover any message to delete it.
                  </div>

                  {/* Full Conversation */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Full Conversation</div>
                  <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, maxHeight: 260, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>

                    {/* Initial messages (from chatbot) */}
                    {parseJSON(selectedTicket.messages)
                      .filter(msg => !(msg.deletedFor || []).includes(adminUserId))
                      .map((msg, idx) => (
                        <div key={`msg-${idx}`}
                          style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", position: "relative" }}
                          onContextMenu={(e) => handleRightClick(e, "messages", idx)}
                        >
                          <div
                            className="conv-msg-wrap"
                            style={{ maxWidth: "80%", position: "relative", cursor: "context-menu" }}
                          >
                            {/* Hover delete icon */}
                            <div
                              className="conv-del-btn"
                              style={{
                                position: "absolute",
                                top: -8,
                                [msg.role === "user" ? "left" : "right"]: -22,
                                opacity: 0,
                                transition: "opacity 0.15s",
                                cursor: "pointer",
                                padding: 3,
                                background: "#f1f5f9",
                                borderRadius: "50%",
                                zIndex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={(e) => { e.stopPropagation(); handleRightClick(e, "messages", idx); }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            >
                              <Trash2 size={11} color="#94a3b8" />
                            </div>
                            <div
                              style={{ padding: "8px 12px", borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px", background: msg.role === "user" ? "#4f46e5" : "#fff", color: msg.role === "user" ? "#fff" : "#1e293b", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                              onMouseEnter={e => {
                                const btn = e.currentTarget.parentElement.querySelector(".conv-del-btn");
                                if (btn) btn.style.opacity = "1";
                              }}
                              onMouseLeave={e => {
                                const btn = e.currentTarget.parentElement.querySelector(".conv-del-btn");
                                if (btn) btn.style.opacity = "0";
                              }}
                            >
                              <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2, fontWeight: 600 }}>
                                {msg.role === "user" ? selectedTicket.user_name : "AI Chatbot"}
                              </div>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}

                    {parseJSON(selectedTicket.messages).filter(m => !(m.deletedFor || []).includes(adminUserId)).length > 0 &&
                      parseJSON(selectedTicket.conversation).filter(c => !(c.deletedFor || []).includes(adminUserId)).length > 0 && (
                        <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", padding: "4px 0" }}>── Admin Replies ──</div>
                      )}

                    {/* Admin conversation replies */}
                    {parseJSON(selectedTicket.conversation)
                      .filter(msg => !(msg.deletedFor || []).includes(adminUserId))
                      .map((msg, idx) => (
                        <div key={`conv-${idx}`}
                          style={{ display: "flex", justifyContent: "flex-start", position: "relative" }}
                          onContextMenu={(e) => handleRightClick(e, "conversation", idx)}
                        >
                          <div
                            className="conv-msg-wrap"
                            style={{ maxWidth: "80%", position: "relative", cursor: "context-menu" }}
                          >
                            <div
                              className="conv-del-btn"
                              style={{
                                position: "absolute",
                                top: -8,
                                right: -22,
                                opacity: 0,
                                transition: "opacity 0.15s",
                                cursor: "pointer",
                                padding: 3,
                                background: "#f1f5f9",
                                borderRadius: "50%",
                                zIndex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={(e) => { e.stopPropagation(); handleRightClick(e, "conversation", idx); }}
                              onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                            >
                              <Trash2 size={11} color="#94a3b8" />
                            </div>
                            <div
                              style={{ padding: "8px 12px", borderRadius: "12px 12px 12px 3px", background: "#e0e7ff", color: "#1e293b", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                              onMouseEnter={e => {
                                const btn = e.currentTarget.parentElement.querySelector(".conv-del-btn");
                                if (btn) btn.style.opacity = "1";
                              }}
                              onMouseLeave={e => {
                                const btn = e.currentTarget.parentElement.querySelector(".conv-del-btn");
                                if (btn) btn.style.opacity = "0";
                              }}
                            >
                              <div style={{ fontSize: 10, color: "#4f46e5", marginBottom: 2, fontWeight: 700 }}>
                                {msg.sender || "Admin"} • {formatTime(msg.timestamp)}
                              </div>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      ))}

                    {parseJSON(selectedTicket.messages).filter(m => !(m.deletedFor || []).includes(adminUserId)).length === 0 &&
                      parseJSON(selectedTicket.conversation).filter(c => !(c.deletedFor || []).includes(adminUserId)).length === 0 && (
                        <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No messages yet.</div>
                      )}
                    <div ref={conversationEndRef} />
                  </div>

                  {/* Attachments Section */}
                  <div style={{ marginBottom: 16 }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                        📎 Attachments {attachments.length > 0 && <span style={{ color: "#4f46e5" }}>({attachments.length})</span>}
                      </div>
                      <div>
                        <input ref={fileInputRef} type="file" style={{ display: "none" }}
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={handleFileSelect} />
                        <button onClick={() => fileInputRef.current?.click()}
                          className="btn btn-sm btn-outline-primary"
                          style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
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
                        <button onClick={uploadFile} disabled={uploading} className="btn btn-sm btn-primary" style={{ fontSize: 12, flexShrink: 0 }}>
                          {uploading ? "Uploading..." : "Upload"}
                        </button>
                        <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 2 }}>
                          <X size={14} />
                        </button>
                      </div>
                    )}

                    {attachments.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {attachments.map((att) => (
                          <div key={att.attachment_id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 8, padding: "8px 12px", border: "1px solid #e2e8f0" }}>
                            {isImageType(att.file_type) ? <Image size={16} color="#4f46e5" /> : <FileText size={16} color="#64748b" />}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                By {att.uploader_name} • {formatFileSize(att.file_size)} • {new Date(att.uploaded_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                            {isImageType(att.file_type) && (
                              <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer"
                                className="btn btn-sm btn-outline-secondary" style={{ fontSize: 11 }}>View</a>
                            )}
                            <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name}
                              className="btn btn-sm btn-outline-primary" style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 3 }}>
                              <Download size={12} /> Download
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 12, color: "#94a3b8", padding: "8px 0" }}>No attachments yet.</div>
                    )}
                  </div>

                  {/* Reply Form */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Send Reply</div>
                  <form onSubmit={handleReply}>
                    <textarea className="form-control mb-2" rows={3}
                      placeholder="Type your reply to the employee..."
                      value={replyText} onChange={e => setReplyText(e.target.value)}
                      style={{ fontSize: 13, resize: "none" }} />
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
