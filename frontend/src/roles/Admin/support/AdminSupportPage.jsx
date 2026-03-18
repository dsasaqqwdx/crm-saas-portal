
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const STATUS_COLORS = {
  open:       { bg: "#fef9c3", text: "#a16207" },
  inprogress: { bg: "#e0e7ff", text: "#4f46e5" },
  resolved:   { bg: "#dcfce7", text: "#16a34a" },
  closed:     { bg: "#f1f5f9", text: "#64748b" },
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);
  const [openCount, setOpenCount] = useState(0);
  const conversationEndRef = useRef(null);

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
    } catch (err) {
      showToast("Failed to load tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (conversationEndRef.current)
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

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
      const allTickets = res.data.data || [];
      setTickets(allTickets);
      setOpenCount(allTickets.filter(t => t.status === "open").length);
      const updated = allTickets.find(t => t.ticket_id === selectedTicket.ticket_id);
      if (updated) setSelectedTicket(updated);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send reply", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await axios.put(`${API}/api/support/${ticketId}/status`, { status }, { headers });
      showToast("Status updated");
      fetchTickets();
      if (selectedTicket?.ticket_id === ticketId)
        setSelectedTicket(prev => ({ ...prev, status }));
    } catch (err) {
      showToast("Update failed", "error");
    }
  };

  const handleDelete = async (ticketId) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await axios.delete(`${API}/api/support/${ticketId}`, { headers });
      showToast("Ticket deleted");
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };

  const parseJSON = (data) => {
    if (!data) return [];
    if (typeof data === "string") {
      try { return JSON.parse(data); } catch { return []; }
    }
    return Array.isArray(data) ? data : [];
  };

  const filtered = tickets.filter(t =>
    filterStatus === "all" ? true : t.status === filterStatus
  );

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short",
      hour: "2-digit", minute: "2-digit"
    });
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <div className="container-fluid p-4" style={{ marginLeft: "250px" }}>

        {toast && (
          <div style={{
            position: "fixed", top: 20, right: 20, zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#10b981",
            color: "#fff", padding: "12px 20px", borderRadius: 8,
            fontWeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            {toast.message}
          </div>
        )}

        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">
              Support Tickets
              {openCount > 0 && (
                <span className="badge bg-danger ms-2" style={{ fontSize: 14 }}>
                  {openCount} New
                </span>
              )}
            </h2>
            <p className="text-muted mb-0">Reply to employee support requests</p>
          </div>
        </div>

        
        <div className="row g-3 mb-4">
          {[
            { label: "Open", status: "open", color: "#a16207", bg: "#fef9c3" },
            { label: "In Progress", status: "inprogress", color: "#4f46e5", bg: "#e0e7ff" },
            { label: "Resolved", status: "resolved", color: "#16a34a", bg: "#dcfce7" },
            { label: "Total", status: "all", color: "#334155", bg: "#f1f5f9" },
          ].map(item => (
            <div key={item.label} className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100"
                style={{ cursor: "pointer", background: filterStatus === item.status ? item.bg : "#fff" }}
                onClick={() => setFilterStatus(item.status)}>
                <div className="card-body py-3 px-4">
                  <div style={{ fontSize: 24, fontWeight: 700, color: item.color }}>
                    {item.status === "all" ? tickets.length : tickets.filter(t => t.status === item.status).length}
                  </div>
                  <div className="text-muted small">{item.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          
          <div className="col-lg-4">
            <div className="d-flex gap-1 mb-2 flex-wrap">
              {["all", "open", "inprogress", "resolved", "closed"].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`btn btn-sm fw-semibold ${filterStatus === s ? "btn-primary" : "btn-outline-secondary"}`}>
                  {s === "inprogress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {loading ? (
                  <div className="text-center text-muted p-4">Loading...</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center text-muted p-4">No tickets found.</div>
                ) : filtered.map(ticket => {
                  const sc = STATUS_COLORS[ticket.status] || STATUS_COLORS.open;
                  const isSelected = selectedTicket?.ticket_id === ticket.ticket_id;
                  const convCount = parseJSON(ticket.conversation).length;
                  return (
                    <div key={ticket.ticket_id}
                      onClick={() => { setSelectedTicket(ticket); setReplyText(""); }}
                      style={{
                        padding: "12px 14px", borderBottom: "1px solid #f1f5f9",
                        cursor: "pointer",
                        background: isSelected ? "#f0f4ff" : "#fff",
                        borderLeft: isSelected ? "3px solid #4f46e5" : "3px solid transparent",
                      }}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>
                          {ticket.user_name || "Unknown"}
                          {ticket.status === "open" && (
                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "inline-block", marginLeft: 6 }} />
                          )}
                        </span>
                        <span style={{ background: sc.bg, color: sc.text, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {ticket.status === "inprogress" ? "In Progress" : ticket.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 3 }} className="text-truncate">
                        {ticket.subject}
                      </div>
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

          
          <div className="col-lg-8">
            {!selectedTicket ? (
              <div className="card border-0 shadow-sm" style={{ minHeight: 400 }}>
                <div className="card-body d-flex align-items-center justify-content-center">
                  <div className="text-center text-muted">
                    <div style={{ fontSize: 48, marginBottom: 12 }}></div>
                    <div className="fw-semibold">Select a ticket to view and reply</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">#{selectedTicket.ticket_id} — {selectedTicket.subject}</h6>
                      <div style={{ fontSize: 13, color: "#64748b" }}>
                        From: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                      </div>
                    </div>
                    <button className="btn btn-sm" style={{ background: "#fff1f2", color: "#ef4444", fontWeight: 500 }}
                      onClick={() => handleDelete(selectedTicket.ticket_id)}>Delete</button>
                  </div>

                 
                  <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Status:</span>
                    {["open", "inprogress", "resolved", "closed"].map(s => {
                      const sc = STATUS_COLORS[s];
                      const isActive = selectedTicket.status === s;
                      return (
                        <button key={s} onClick={() => handleStatusChange(selectedTicket.ticket_id, s)}
                          style={{
                            background: isActive ? sc.bg : "#f1f5f9",
                            color: isActive ? sc.text : "#64748b",
                            border: isActive ? `1px solid ${sc.text}` : "1px solid #e2e8f0",
                            borderRadius: 20, padding: "3px 12px",
                            fontSize: 12, fontWeight: 600, cursor: "pointer",
                          }}>
                          {s === "inprogress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Full Conversation
                  </div>
                  <div style={{
                    background: "#f8fafc", borderRadius: 10, padding: 12,
                    maxHeight: 320, overflowY: "auto",
                    display: "flex", flexDirection: "column", gap: 8, marginBottom: 16,
                  }}>
                    
                    {parseJSON(selectedTicket.messages).map((msg, idx) => (
                      <div key={`msg-${idx}`} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "80%", padding: "8px 12px",
                          borderRadius: msg.role === "user" ? "12px 12px 3px 12px" : "12px 12px 12px 3px",
                          background: msg.role === "user" ? "#4f46e5" : "#fff",
                          color: msg.role === "user" ? "#fff" : "#1e293b",
                          fontSize: 13, lineHeight: 1.5,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}>
                          <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 2, fontWeight: 600 }}>
                            {msg.role === "user" ? selectedTicket.user_name : "AI Chatbot"}
                          </div>
                          {msg.content}
                        </div>
                      </div>
                    ))}

                
                    {parseJSON(selectedTicket.messages).length > 0 && parseJSON(selectedTicket.conversation).length > 0 && (
                      <div style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", padding: "4px 0" }}>
                        ── Admin Replies ──
                      </div>
                    )}

                    
                    {parseJSON(selectedTicket.conversation).map((msg, idx) => (
                      <div key={`conv-${idx}`} style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div style={{
                          maxWidth: "80%", padding: "8px 12px",
                          borderRadius: "12px 12px 12px 3px",
                          background: "#e0e7ff",
                          color: "#1e293b",
                          fontSize: 13, lineHeight: 1.5,
                          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}>
                          <div style={{ fontSize: 10, color: "#4f46e5", marginBottom: 2, fontWeight: 700 }}>
                            👤 {msg.sender || "Admin"} • {formatTime(msg.timestamp)}
                          </div>
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {parseJSON(selectedTicket.messages).length === 0 && parseJSON(selectedTicket.conversation).length === 0 && (
                      <div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No messages yet.</div>
                    )}
                    <div ref={conversationEndRef} />
                  </div>

                  
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                    Send Reply
                  </div>
                  <form onSubmit={handleReply}>
                    <textarea className="form-control mb-2" rows={3}
                      placeholder="Type your reply to the employee..."
                      value={replyText} onChange={e => setReplyText(e.target.value)}
                      style={{ fontSize: 13, resize: "none" }} />
                    <button type="submit" className="btn btn-primary fw-semibold"
                      disabled={submitting || !replyText.trim()}>
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
