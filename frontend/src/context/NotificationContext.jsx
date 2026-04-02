
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Bell, Ticket, MessageSquare, FileText, Heart, Trash2, Info, Clock, X, CheckCheck, Trash } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
const NotificationContext = createContext(null);

const TYPE_CONFIG = {
  new_ticket: { icon: <Ticket size={16}/>, color: "#4f46e5", label: "New Ticket" },
  admin_reply: { icon: <MessageSquare size={16}/>, color: "#16a34a", label: "Admin Replied" },
  employee_message: { icon: <MessageSquare size={16}/>, color: "#0369a1", label: "New Message" },
  file_uploaded: { icon: <FileText size={16}/>, color: "#d97706", label: "File Uploaded" },
  reaction_added: { icon: <Heart size={16}/>, color: "#be185d", label: "Reaction" },
  message_deleted: { icon: <Trash2 size={16}/>, color: "#dc2626", label: "Deleted" },
  default: { icon: <Info size={16}/>, color: "#64748b", label: "Update" },
};

const formatTime = (ts) => {
  if (!ts) return "";
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-IN", { day:"2-digit", month:"short" });
};

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within a NotificationProvider");
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadAppCount, setUnreadAppCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const lastCountRef = useRef(-1);
  const dropdownRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const [notifRes, countRes] = await Promise.all([
        axios.get(`${API}/api/notifications`, { headers: { "x-auth-token": token } }),
        axios.get(`${API}/api/notifications/unread-count`, { headers: { "x-auth-token": token } }),
      ]);
      const freshNotifs = notifRes.data.data || [];
      const freshCount = countRes.data.count || 0;

      if (lastCountRef.current >= 0 && freshCount > lastCountRef.current) {
        const newest = freshNotifs[0];
        const id = Date.now();
        setToasts(prev => [...prev.slice(-2), { ...newest, toastId: id }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.toastId !== id)), 5000);
      }
      setNotifications(freshNotifs);
      setUnreadCount(freshCount);
      lastCountRef.current = freshCount;
    } catch (err) { console.error(err); }
  }, []);

  const fetchAppCount = useCallback(async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "employee") return;
    try {
      const res = await axios.get(`${API}/api/appreciations/my`, { headers: { "x-auth-token": token } });
      const list = res.data?.data ?? [];
      const readIds = JSON.parse(localStorage.getItem("readAppreciationIds") || "[]");
      setUnreadAppCount(list.filter(a => !readIds.includes(String(a.id || a.appreciation_id))).length);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    fetchAppCount();
    const interval = setInterval(fetchAppCount, 15000);
    return () => clearInterval(interval);
  }, [fetchAppCount]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API}/api/notifications/${id}/read`, {}, { headers: { "x-auth-token": localStorage.getItem("token") } });
      setNotifications(prev => prev.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) { console.error(err); }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${API}/api/notifications/mark-all-read`, {}, { headers: { "x-auth-token": localStorage.getItem("token") } });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${API}/api/notifications/clear-all`, { headers: { "x-auth-token": localStorage.getItem("token") } });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) { console.error(err); }
  };

  const markAppreciationRead = (id) => {
    const existing = JSON.parse(localStorage.getItem("readAppreciationIds") || "[]");
    if (!existing.includes(String(id))) {
      localStorage.setItem("readAppreciationIds", JSON.stringify([...existing, String(id)]));
      setUnreadAppCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, markAsRead, markAllRead, clearAll,
      dropdownOpen, setDropdownOpen, dropdownRef, TYPE_CONFIG, formatTime,
      unreadAppCount, markAppreciationRead,
    }}>
      {children}

      <div className="notif-toast-wrapper">
        {toasts.map(t => {
          const cfg = TYPE_CONFIG[t.type] || TYPE_CONFIG.default;
          return (
            <div key={t.toastId} className="modern-toast shadow-lg">
              <div className="toast-accent" style={{ backgroundColor: cfg.color }}></div>
              <div className="toast-body">
                <div className="toast-icon" style={{ backgroundColor:`${cfg.color}15`, color:cfg.color }}>{cfg.icon}</div>
                <div className="toast-info">
                  <div className="toast-label" style={{ color:cfg.color }}>{cfg.label}</div>
                  <div className="toast-text">{t.message}</div>
                </div>
                <button className="toast-close" onClick={() => setToasts(p => p.filter(x => x.toastId !== t.toastId))}><X size={14}/></button>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .notif-toast-wrapper { position:fixed;top:20px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:12px;width:100%;max-width:340px;pointer-events:none; }
        .modern-toast { background:white;border-radius:12px;overflow:hidden;display:flex;pointer-events:auto;animation:slideInNotif 0.3s ease-out;border:1px solid #e2e8f0; }
        .toast-accent { width:4px;flex-shrink:0; }
        .toast-body { display:flex;align-items:center;padding:12px;gap:12px;width:100%; }
        .toast-icon { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .toast-info { flex:1;min-width:0; }
        .toast-label { font-size:10px;font-weight:800;text-transform:uppercase;margin-bottom:2px; }
        .toast-text { font-size:12.5px;color:#334155;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
        .toast-close { background:none;border:none;color:#94a3b8;cursor:pointer; }
        @keyframes slideInNotif { from{transform:translateX(50px);opacity:0} to{transform:translateX(0);opacity:1} }
        @media(max-width:576px){.notif-toast-wrapper{top:auto;bottom:20px;right:10px;left:10px;max-width:calc(100% - 20px);}}
      `}</style>
    </NotificationContext.Provider>
  );
}

export function NotificationBell() {
  const { notifications, unreadCount, dropdownOpen, setDropdownOpen, dropdownRef, TYPE_CONFIG, markAsRead, markAllRead, clearAll, formatTime } = useNotifications();

  useEffect(() => {
    const handler = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownRef, setDropdownOpen]);

  return (
    <div ref={dropdownRef} className="position-relative">
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="btn-bell shadow-none"
        style={{ background: dropdownOpen ? "rgba(255,255,255,0.15)" : "transparent" }}>
        <Bell size={20} strokeWidth={2.5}/>
        {unreadCount > 0 && <span className="bell-dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
      </button>

      {dropdownOpen && (
        <div className="notif-panel shadow-lg">
          <div className="panel-header">
            <div>
              <h6 className="fw-bold mb-0">Notifications</h6>
              <p className="text-muted small mb-0">{unreadCount} unread</p>
            </div>
            <div className="d-flex gap-2">
              {unreadCount > 0 && <button onClick={markAllRead} className="action-btn text-primary"><CheckCheck size={14}/> Read all</button>}
              {notifications.length > 0 && <button onClick={clearAll} className="action-btn text-danger"><Trash size={14}/> Clear</button>}
            </div>
          </div>

          <div className="panel-list">
            {notifications.length === 0 ? (
              <div className="empty-notif"><Bell size={32} strokeWidth={1}/><p>No notifications yet</p></div>
            ) : notifications.map(n => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.default;
              return (
                <div key={n.notification_id} onClick={() => markAsRead(n.notification_id)} className={`list-item ${!n.is_read ? "unread" : ""}`}>
                  <div className="item-icon" style={{ background:`${cfg.color}15`, color:cfg.color }}>{cfg.icon}</div>
                  <div className="item-content">
                    <div className="item-msg">{n.message}</div>
                    <div className="item-time"><Clock size={10}/> {formatTime(n.created_at)}</div>
                  </div>
                  {!n.is_read && <div className="unread-status"></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .btn-bell{background:transparent;border:none;color:white;padding:8px;border-radius:10px;position:relative;display:flex;align-items:center;transition:0.2s;}
        .btn-bell:hover{background:rgba(255,255,255,0.1);}
        .bell-dot{position:absolute;top:4px;right:4px;background:#ef4444;color:white;font-size:9px;font-weight:800;padding:2px 5px;border-radius:10px;border:2px solid #1e293b;}
        .notif-panel{position:absolute;top:50px;right:0;width:340px;background:white;border-radius:16px;border:1px solid #e2e8f0;z-index:9999;overflow:hidden;animation:panelIn 0.2s ease-out;}
        .panel-header{padding:14px 16px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;}
        .action-btn{background:none;border:none;font-size:11px;font-weight:700;display:flex;align-items:center;gap:4px;cursor:pointer;}
        .panel-list{max-height:380px;overflow-y:auto;}
        .list-item{padding:12px 16px;display:flex;gap:12px;align-items:flex-start;border-bottom:1px solid #f8fafc;cursor:pointer;transition:0.2s;}
        .list-item:hover{background:#f8fafc;}
        .list-item.unread{background:#f0f7ff;}
        .item-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .item-content{flex:1;min-width:0;}
        .item-msg{font-size:13px;color:#1e293b;line-height:1.4;margin-bottom:2px;}
        .item-time{font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:4px;}
        .unread-status{width:8px;height:8px;border-radius:50%;background:#4f46e5;margin-top:6px;}
        .empty-notif{padding:40px 20px;text-align:center;color:#cbd5e1;}
        .empty-notif p{font-size:13px;margin-top:8px;color:#94a3b8;}
        @keyframes panelIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @media(max-width:768px){.notif-panel{position:fixed;top:70px;left:10px;right:10px;width:auto;}}
      `}</style>
    </div>
  );
}