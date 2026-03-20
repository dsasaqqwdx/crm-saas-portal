import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const NotificationContext = createContext(null);

const TYPE_ICONS = {
  new_ticket:      "🎫",
  admin_reply:     "💬",
  file_uploaded:   "📎",
  reaction_added:  "😊",
  message_deleted: "🗑️",
};

const TYPE_COLORS = {
  new_ticket:      "#4f46e5",
  admin_reply:     "#16a34a",
  file_uploaded:   "#d97706",
  reaction_added:  "#be185d",
  message_deleted: "#dc2626",
};

const TYPE_LABELS = {
  new_ticket:      "New Ticket",
  admin_reply:     "Admin Replied",
  file_uploaded:   "File Uploaded",
  reaction_added:  "New Reaction",
  message_deleted: "Message Deleted",
};

const formatTime = (ts) => {
  if (!ts) return "";
  const date = new Date(ts);
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastCountRef = useRef(-1);
  const dropdownRef = useRef(null);

  const getToken = () => localStorage.getItem("token");
  const getHeaders = () => ({ "x-auth-token": getToken() });

  const fetchNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        axios.get(`${API}/api/notifications`, { headers: getHeaders() }),
        axios.get(`${API}/api/notifications/unread-count`, { headers: getHeaders() }),
      ]);
      const newNotifs = notifRes.data.data || [];
      const newCount = countRes.data.count || 0;

      setNotifications(newNotifs);

      // Show toast only for genuinely new notifications (not on first load)
      if (lastCountRef.current >= 0 && newCount > lastCountRef.current) {
        const diff = newCount - lastCountRef.current;
        const newOnes = newNotifs.filter(n => !n.is_read).slice(0, diff);
        newOnes.forEach(n => addToast(n));
      }
      lastCountRef.current = newCount;
      setUnreadCount(newCount);
    } catch (err) {
      // Not logged in or network error — silent fail
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addToast = (notif) => {
    const toastId = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-4), { ...notif, toastId }]); // max 5 toasts
    setTimeout(() => setToasts(prev => prev.filter(t => t.toastId !== toastId)), 5000);
  };

  const dismissToast = (toastId) => setToasts(prev => prev.filter(t => t.toastId !== toastId));

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/api/notifications/${id}/read`, {}, { headers: getHeaders() });
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      lastCountRef.current = Math.max(0, lastCountRef.current - 1);
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API}/api/notifications/mark-all-read`, {}, { headers: getHeaders() });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
      lastCountRef.current = 0;
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API}/api/notifications/clear-all`, { headers: getHeaders() });
      setNotifications([]);
      setUnreadCount(0);
      lastCountRef.current = 0;
    } catch (err) { console.error(err); }
  };

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, markAsRead, markAllRead, clearAll,
      dropdownOpen, setDropdownOpen, dropdownRef, fetchNotifications,
      TYPE_ICONS, TYPE_COLORS, TYPE_LABELS, formatTime,
    }}>
      {children}

      {/* ── TOAST STACK (top-right corner, WhatsApp style) ───────────────── */}
      <div style={{
        position: "fixed", top: 16, right: 16, zIndex: 99999,
        display: "flex", flexDirection: "column", gap: 10,
        pointerEvents: "none",
      }}>
        {toasts.map(toast => (
          <div key={toast.toastId}
            style={{
              background: "#fff", borderRadius: 12,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              padding: "13px 14px",
              display: "flex", alignItems: "flex-start", gap: 10,
              borderLeft: `4px solid ${TYPE_COLORS[toast.type] || "#4f46e5"}`,
              animation: "slideInRight 0.3s ease",
              minWidth: 280, maxWidth: 340,
              pointerEvents: "all",
            }}>
            <div style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>
              {TYPE_ICONS[toast.type] || "🔔"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: TYPE_COLORS[toast.type] || "#4f46e5", marginBottom: 2 }}>
                {TYPE_LABELS[toast.type] || "Notification"}
              </div>
              <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {toast.message}
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>{formatTime(toast.created_at)}</div>
            </div>
            <button onClick={() => dismissToast(toast.toastId)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, fontSize: 18, flexShrink: 0, lineHeight: 1, marginTop: -2 }}>×</button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes bellFadeIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

// ── BELL ICON — drop this anywhere in the sidebar ─────────────────────────
export function NotificationBell() {
  const ctx = useNotifications();
  if (!ctx) return null;

  const { notifications, unreadCount, markAsRead, markAllRead, clearAll,
          dropdownOpen, setDropdownOpen, dropdownRef,
          TYPE_ICONS, TYPE_COLORS, formatTime } = ctx;

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        onClick={() => setDropdownOpen(prev => !prev)}
        style={{
          background: dropdownOpen ? "rgba(255,255,255,0.15)" : "transparent",
          border: "none", borderRadius: 8, padding: "6px 8px",
          cursor: "pointer", position: "relative",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", transition: "background 0.15s",
          width: 36, height: 36,
        }}
        title="Notifications"
      >
        {/* Bell SVG */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 2, right: 2,
            background: "#ef4444", color: "#fff",
            borderRadius: "50%", width: 16, height: 16,
            fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1.5px solid #212529",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {dropdownOpen && (
        <div style={{
          position: "fixed", left: 258, top: "auto",
          width: 340, background: "#fff",
          borderRadius: 14, boxShadow: "0 16px 48px rgba(0,0,0,0.22)",
          zIndex: 99998, overflow: "hidden",
          animation: "bellFadeIn 0.18s ease",
        }}>
          {/* Header */}
          <div style={{ padding: "14px 16px 10px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b", display: "flex", alignItems: "center", gap: 8 }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{ background: "#ef4444", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11 }}>{unreadCount}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 11, color: "#4f46e5", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} style={{ fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 16px", color: "#94a3b8" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🔔</div>
                <div style={{ fontSize: 13 }}>No notifications yet</div>
              </div>
            ) : notifications.map(n => (
              <div key={n.notification_id}
                onClick={() => markAsRead(n.notification_id)}
                style={{
                  padding: "11px 16px",
                  background: n.is_read ? "#fff" : "#f0f4ff",
                  borderBottom: "1px solid #f8fafc",
                  cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? "#fff" : "#f0f4ff"}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: `${TYPE_COLORS[n.type] || "#4f46e5"}18`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}>
                  {TYPE_ICONS[n.type] || "🔔"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#1e293b", lineHeight: 1.45, fontWeight: n.is_read ? 400 : 600 }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{formatTime(n.created_at)}</div>
                </div>
                {!n.is_read && (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4f46e5", flexShrink: 0, marginTop: 5 }} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
