
import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
MessageCircle, X, Send, RefreshCw,
Paperclip, Download, FileText, Image,
History, Plus, ChevronLeft, Clock,
MessageSquare, Loader, PhoneCall, Trash2, Pencil
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const QA_DATABASE = [
{ keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy"], answer: "Hello! Welcome to Shnoor chatbot! How can I help you today? I can answer questions about company policies, leave, attendance, or payroll." },
{ keywords: ["bye", "goodbye", "see you", "take care"], answer: "Goodbye! Have a great day! Feel free to come back anytime." },
{ keywords: ["how are you", "how r u", "how do you do", "whats up", "what's up"], answer: "I am doing great, thank you! Ready to help you. What can I assist you with today?" },
{ keywords: ["thank you", "thanks", "thank u", "thankyou", "thx", "ty"], answer: "You are welcome! Is there anything else I can help you with?" },
{ keywords: ["who are you", "what are you", "what is your name"], answer: "I am the Shnoor AI Assistant here to help employees with company policies, leave, attendance, and payroll." },
{ keywords: ["how many leaves", "total leaves", "leave balance", "annual leave", "leave days", "leave policy", "leave entitlement", "types of leave"], answer: "Leave Entitlements:\n\n- Annual Leave: 20 days/year\n- Sick Leave: 10 days/year\n- Casual Leave: 5 days/year\n- Maternity Leave: 90 days\n- Paternity Leave: 5 days\n\nLeave balances reset every January 1st." },
{ keywords: ["how to apply leave", "apply for leave", "leave application", "request leave", "apply leave", "take leave", "need leave", "want leave", "leave tomorrow", "tomorrow leave", "must apply", "i need leave", "how do i apply", "how can i apply", "can i take leave"], answer: "How to Apply for Leave:\n\n1. Login to Employee Dashboard\n2. Click Leaves in the sidebar\n3. Click Apply Leave\n4. Select type, dates, and reason\n5. Submit - admin will approve within 24 hours." },
{ keywords: ["sick leave", "medical leave", "i am sick", "not feeling well", "doctor leave"], answer: "Sick Leave Policy:\n\n- 10 sick days per year\n- Up to 2 days: no certificate needed\n- 3+ days: submit medical certificate within 3 days of return\n- Notify manager before 9 AM if possible." },
{ keywords: ["leave approval", "who approves", "leave status", "pending leave"], answer: "Leave Approval:\n\n- Reviewed by your Company Admin\n- Typically approved within 24 hours\n- Check status in your dashboard\n- For urgent leave, contact your admin directly." },
{ keywords: ["how to mark attendance", "mark attendance", "check in"], answer: "Marking Attendance:\n\n1. Login to Employee Dashboard\n2. Click My Attendance in sidebar\n3. Click Mark Present\n4. Must be done before 10:00 AM\n\nLate = after 10 AM. No mark = Absent." },
{ keywords: ["attendance not marked", "forgot attendance", "missed attendance", "attendance correction"], answer: "Forgot to Mark Attendance?\n\n1. Contact your Admin immediately\n2. Provide the date and reason\n3. Admin can correct it manually\n\nFor repeated issues, raise a support ticket." },
{ keywords: ["working hours", "office hours", "office timing", "work time", "shift timing"], answer: "Working Hours:\n\n- Mon to Fri: 9:00 AM to 6:00 PM\n- Sat and Sun: Off\n- Lunch: 1:00 PM to 2:00 PM\n- Total: 8 hours/day" },
{ keywords: ["work from home", "wfh", "remote work", "work remotely"], answer: "Work From Home Policy:\n\n- Available every Friday with prior approval\n- Request by Thursday 5 PM\n- Max 4 WFH days/month\n- Must be fully available on calls and messages." },
{ keywords: ["notice period", "resignation", "how to resign", "quit job", "exit"], answer: "Resignation and Notice Period:\n\n- Notice: 30 days\n- Submit resignation to HR and manager\n- Buyout possible with approval\n- Full and Final settlement within 45 days of last day." },
{ keywords: ["probation", "probation period", "new employee", "probationary"], answer: "Probation Period:\n\n- 3 months for all new employees\n- Performance review at end of probation\n- Only 5 leave days during probation\n- Confirmation letter issued after completion." },
{ keywords: ["salary", "payroll", "salary date", "pay day", "when do i get paid"], answer: "Payroll Info:\n\n- Salary processed on last working day of each month\n- Salary slip in Employee Dashboard under Payroll\n- Credited to your registered bank account\n- Discrepancies must be reported within 5 days." },
{ keywords: ["salary slip", "payslip", "pay slip", "download salary"], answer: "To Access Salary Slip:\n\n1. Login to Employee Dashboard\n2. Click Payroll in sidebar\n3. Select the month\n4. Click Download for PDF slip." },
{ keywords: ["holiday", "holidays", "public holiday", "holiday list"], answer: "Company Holidays:\n\n1. Login to Employee Dashboard\n2. Click Holidays in sidebar\n3. Full year calendar is listed there\n\nIncludes national holidays plus company-specific holidays." },
];

const OUT_OF_SCOPE_KEYWORDS = ["weather", "news", "cricket", "movie", "film", "food", "recipe", "sports", "stock", "bitcoin", "crypto", "politics", "election", "song", "music", "game", "meme", "joke", "love", "relationship", "marriage", "personal"];
const EMOJI_LIST = ["👍", "👎", "❤️", "😂", "😮", "😢", "🔥", "✅"];
const QUICK_QUESTIONS = ["What is the leave policy?", "How to mark attendance?", "What are working hours?", "WFH policy?", "When is salary credited?", "How to apply for leave?"];

const WELCOME_MSG = {
role: "assistant",
content: "Hi! I am your Shnoor Assistant.\n\nI can help you with leave, attendance, payroll, and company policies.\n\nWhat would you like to know?",
timestamp: new Date().toISOString(),
};

const getToken = () => localStorage.getItem("token");
const getUserName = () => localStorage.getItem("name") || "User";
const getUserId = () => localStorage.getItem("user_id") || null;
const getHeaders = () => ({ "x-auth-token": getToken() });

const safeArr = (raw) => {
if (!raw) return [];
if (Array.isArray(raw)) return raw;
try { return JSON.parse(raw); } catch { return []; }
};

const findPredefined = (text) => {
const lower = text.toLowerCase().trim();
for (const qa of QA_DATABASE) {
if (qa.keywords.some(k => lower.includes(k))) return qa.answer;
}
return null;
};

const isOutOfScope = (text) => OUT_OF_SCOPE_KEYWORDS.some(k => text.toLowerCase().includes(k));

const fmtSz = (b) => {
if (!b) return "";
if (b < 1024) return b + " B";
if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
return (b / 1048576).toFixed(1) + " MB";
};

const isImgType = (ft) => ft && ft.startsWith("image/");
const fmt = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

const fmtDate = (iso) => {
const d = new Date(iso), t = new Date(), y = new Date(t);
y.setDate(t.getDate() - 1);
if (d.toDateString() === t.toDateString()) return "Today";
if (d.toDateString() === y.toDateString()) return "Yesterday";
return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const renderMd = (c) =>
String(c || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

const dotStyle = (d) => ({
width: 7, height: 7, borderRadius: "50%", background: "#94a3b8",
display: "inline-block", animation: `bounce 1.2s ${d}s infinite`,
});

const sortByTime = (arr) =>
[...arr].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

function HistoryPanel({ tickets, activeTicketId, onSelect, onNew, onClose, loading }) {
const grouped = {};
tickets.forEach(t => {
const l = fmtDate(t.created_at);
if (!grouped[l]) grouped[l] = [];
grouped[l].push(t);
});

return (
<div style={{ position: "absolute", inset: 0, zIndex: 10, background: "#fff", display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden" }}>
<div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
<button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
<ChevronLeft size={18} />
</button>
<span style={{ color: "#fff", fontWeight: 700, fontSize: 15, flex: 1 }}>Chat History</span>
<button onClick={onNew} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
<Plus size={13} /> New Chat
</button>
</div>
<div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
{loading && (
<div style={{ display: "flex", justifyContent: "center", padding: 32, gap: 8, color: "#94a3b8", fontSize: 13 }}>
<Loader size={14} style={{ animation: "spin 1s linear infinite" }} /> Loading...
</div>
)}
{!loading && tickets.length === 0 && (
<div style={{ textAlign: "center", color: "#94a3b8", fontSize: 13, padding: 32 }}>No history yet.</div>
)}
{!loading && Object.entries(grouped).map(([label, group]) => (
<div key={label}>
<div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 16px 4px" }}>{label}</div>
{group.map(t => {
const isActive = t.ticket_id === activeTicketId;
return (
<div key={t.ticket_id} onClick={() => onSelect(t)}
style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", cursor: "pointer", background: isActive ? "#ede9fe" : "transparent", borderLeft: isActive ? "3px solid #7c3aed" : "3px solid transparent" }}
onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
<MessageSquare size={15} color={isActive ? "#7c3aed" : "#94a3b8"} />
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, color: isActive ? "#4f46e5" : "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
{t.subject}
</div>
<div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
<Clock size={9} /> {fmt(t.created_at)}
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
const [isOpen, setIsOpen] = useState(false);
const [showHistory, setShowHistory] = useState(false);
const [tickets, setTickets] = useState([]);
const [ticketsLoading, setTicketsLoading] = useState(false);
const [activeTicketId, setActiveTicketId] = useState(null);
const [messages, setMessages] = useState([WELCOME_MSG]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [showQuick, setShowQuick] = useState(true);
const [contactState, setContactState] = useState(null);
const [escalating, setEscalating] = useState(false);
const [checkingReply, setCheckingReply] = useState(false);
const [unreadCount, setUnreadCount] = useState(0);
const [seenReplyCount, setSeenReplyCount] = useState(0);
const [attachments, setAttachments] = useState([]);
const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [reactions, setReactions] = useState({});
const [emojiPicker, setEmojiPicker] = useState(null);
const [contextMenu, setContextMenu] = useState(null);
const [editingMsg, setEditingMsg] = useState(null);
const [editContent, setEditContent] = useState("");
const [editSaving, setEditSaving] = useState(false);

const messagesEndRef = useRef(null);
const inputRef = useRef(null);
const fileInputRef = useRef(null);
const editInputRef = useRef(null);
const currentUserId = getUserId();

const fetchTickets = useCallback(async () => {
try {
const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
const sorted = (res.data.data || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
setTickets(sorted);
return sorted;
} catch { return []; }
}, []);

useEffect(() => {
if (!isOpen) return;
setTicketsLoading(true);
fetchTickets().finally(() => setTicketsLoading(false));
}, [isOpen, fetchTickets]);

useEffect(() => {
if (!isOpen) return;
const iv = setInterval(fetchTickets, 15000);
return () => clearInterval(iv);
}, [isOpen, fetchTickets]);

useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

useEffect(() => {
if (isOpen) { setUnreadCount(0); setTimeout(() => inputRef.current?.focus(), 100); }
}, [isOpen]);

useEffect(() => {
if (!activeTicketId) { setAttachments([]); return; }
const load = async () => {
try {
const r = await axios.get(`${API}/api/attachments/${activeTicketId}`, { headers: getHeaders() });
setAttachments(r.data.data || []);
} catch {}
};
load();
const iv = setInterval(load, 15000);
return () => clearInterval(iv);
}, [activeTicketId]);

useEffect(() => {
if (!activeTicketId) return;
const iv = setInterval(async () => {
try {
const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
const ticket = (res.data.data || []).find(t => t.ticket_id === activeTicketId);
if (!ticket) return;
const init = safeArr(ticket.messages)
.filter(m => !(m.deletedFor || []).includes(currentUserId))
.map((m, idx) => ({ role: m.role === "assistant" ? "assistant" : m.role === "admin" ? "admin" : "user", content: String(m.content || ""), timestamp: m.timestamp || ticket.created_at, edited: m.edited || false, _source: "messages", _index: idx }));
const conv = safeArr(ticket.conversation)
.filter(c => !(c.deletedFor || []).includes(currentUserId))
.map((c, idx) => ({ role: "admin", content: (c.sender || "Admin") + " replied: " + c.content, timestamp: c.timestamp || ticket.updated_at, _source: "conversation", _index: idx }));
const newConvCount = safeArr(ticket.conversation).length;
if (newConvCount > seenReplyCount) {
setSeenReplyCount(newConvCount);
if (!isOpen) setUnreadCount(p => p + (newConvCount - seenReplyCount));
}
setMessages(sortByTime([...init, ...conv]));
const r = typeof ticket.reactions === "string" ? JSON.parse(ticket.reactions || "{}") : (ticket.reactions || {});
setReactions(r);
} catch {}
}, 10000);
return () => clearInterval(iv);
}, [activeTicketId, seenReplyCount, isOpen]); // eslint-disable-line

useEffect(() => {
if (!activeTicketId) { setReactions({}); return; }
const load = async () => {
try {
const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
const ticket = (res.data.data || []).find(t => t.ticket_id === activeTicketId);
if (ticket?.reactions) {
const r = typeof ticket.reactions === "string" ? JSON.parse(ticket.reactions) : ticket.reactions;
setReactions(r || {});
}
} catch {}
};
load();
const iv = setInterval(load, 10000);
return () => clearInterval(iv);
}, [activeTicketId]);

useEffect(() => {
if (editingMsg && editInputRef.current) {
editInputRef.current.focus();
editInputRef.current.setSelectionRange(editContent.length, editContent.length);
}
}, [editingMsg]);

const addMessage = useCallback((role, content) => {
setMessages(prev => sortByTime([...prev, { role, content, timestamp: new Date().toISOString() }]));
if (role !== "user" && !isOpen) setUnreadCount(p => p + 1);
}, [isOpen]);

const reloadTicketMessages = async (ticketId) => {
try {
const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
const ticket = (res.data.data || []).find(t => t.ticket_id === ticketId);
if (!ticket) return;
const init = safeArr(ticket.messages)
.filter(m => !(m.deletedFor || []).includes(currentUserId))
.map((m, idx) => ({ role: m.role === "assistant" ? "assistant" : m.role === "admin" ? "admin" : "user", content: String(m.content || ""), timestamp: m.timestamp || ticket.created_at, edited: m.edited || false, _source: "messages", _index: idx }));
const conv = safeArr(ticket.conversation)
.filter(c => !(c.deletedFor || []).includes(currentUserId))
.map((c, idx) => ({ role: "admin", content: (c.sender || "Admin") + " replied: " + c.content, timestamp: c.timestamp || ticket.updated_at, _source: "conversation", _index: idx }));
setMessages(sortByTime([...init, ...conv]));
const r = typeof ticket.reactions === "string" ? JSON.parse(ticket.reactions || "{}") : (ticket.reactions || {});
setReactions(r);
} catch {}
};

const notifyAdmin = async (text) => {
if (!activeTicketId) return;
try {
await axios.post(`${API}/api/support/${activeTicketId}/employee-message`, { message: text }, { headers: getHeaders() });
setTimeout(() => reloadTicketMessages(activeTicketId), 800);
} catch {}
};

const startNewChat = () => {
setActiveTicketId(null);
setMessages([{ ...WELCOME_MSG, timestamp: new Date().toISOString() }]);
setShowQuick(true);
setContactState(null);
setSeenReplyCount(0);
setAttachments([]);
setReactions({});
setEmojiPicker(null);
setContextMenu(null);
setEditingMsg(null);
setInput("");
setShowHistory(false);
};

const loadTicket = (ticket) => {
const init = safeArr(ticket.messages)
.filter(m => !(m.deletedFor || []).includes(currentUserId))
.map((m, idx) => ({ role: m.role === "assistant" ? "assistant" : m.role === "admin" ? "admin" : "user", content: String(m.content || ""), timestamp: m.timestamp || ticket.created_at, edited: m.edited || false, _source: "messages", _index: idx }));
const conv = safeArr(ticket.conversation)
.filter(c => !(c.deletedFor || []).includes(currentUserId))
.map((c, idx) => ({ role: "admin", content: (c.sender || "Admin") + " replied: " + c.content, timestamp: c.timestamp || ticket.updated_at, _source: "conversation", _index: idx }));
const thread = sortByTime([...init, ...conv]);
const r = typeof ticket.reactions === "string" ? JSON.parse(ticket.reactions || "{}") : (ticket.reactions || {});
setReactions(r);
setActiveTicketId(ticket.ticket_id);
setMessages(thread.length > 0 ? thread : [{ role: "assistant", content: "Conversation loaded. You can continue chatting here.", timestamp: ticket.created_at }]);
setSeenReplyCount(safeArr(ticket.conversation).length);
setShowQuick(false);
setContactState("created");
setEmojiPicker(null);
setContextMenu(null);
setEditingMsg(null);
setInput("");
setShowHistory(false);
};

const handleFileSelect = (e) => {
const file = e.target.files[0];
if (!file) return;
if (file.size > 5242880) { addMessage("assistant", "File must be under 5MB. Please choose a smaller file."); return; }
setSelectedFile(file);
};

const uploadFile = async () => {
if (!selectedFile || !activeTicketId) return;
setUploading(true);
try {
const fd = new FormData();
fd.append("file", selectedFile);
const res = await axios.post(`${API}/api/attachments/${activeTicketId}`, fd, { headers: { ...getHeaders(), "Content-Type": "multipart/form-data" } });
setAttachments(prev => [...prev, res.data.data]);
addMessage("user", "Sent file: " + selectedFile.name + " (" + fmtSz(selectedFile.size) + ")");
setSelectedFile(null);
if (fileInputRef.current) fileInputRef.current.value = "";
} catch (err) {
addMessage("assistant", "Upload failed: " + (err.response?.data?.message || "Please try again."));
} finally {
setUploading(false);
}
};

const handleReact = async (msgIndex, emoji) => {
if (!activeTicketId) return;
const msg = messages[msgIndex];
if (!msg._source || msg._index === undefined) return;
const messageKey = msg._source + "-" + msg._index;
try {
const res = await axios.post(`${API}/api/support/${activeTicketId}/react`, { messageKey, emoji }, { headers: getHeaders() });
setReactions(res.data.reactions || {});
} catch (err) {
console.error("React failed:", err);
}
setEmojiPicker(null);
};

const handleDeleteMessage = async (msgIndex, scope) => {
setContextMenu(null);
const msg = messages[msgIndex];
if (!activeTicketId || !msg._source || msg._index === undefined) {
setMessages(prev => prev.filter((_, i) => i !== msgIndex));
return;
}
try {
await axios.delete(`${API}/api/support/${activeTicketId}/message`, { headers: getHeaders(), data: { messageIndex: msg._index, messageSource: msg._source, scope } });
setMessages(prev => prev.filter((_, i) => i !== msgIndex));
await reloadTicketMessages(activeTicketId);
} catch (err) {
console.error("Delete failed:", err);
}
};

const openEditMsg = (msgIndex) => {
setContextMenu(null);
setEmojiPicker(null);
const msg = messages[msgIndex];
setEditingMsg({ msgIndex, _source: msg._source, _index: msg._index });
setEditContent(msg.content || "");
};

const handleEditSave = async () => {
if (!editContent.trim() || !editingMsg || !activeTicketId) return;
setEditSaving(true);
try {
await axios.put(`${API}/api/support/${activeTicketId}/edit-message`, {
messageIndex: editingMsg._index,
messageSource: editingMsg._source,
newContent: editContent.trim(),
}, { headers: getHeaders() });
setEditingMsg(null);
await reloadTicketMessages(activeTicketId);
} catch (err) {
console.error("Edit failed:", err);
} finally {
setEditSaving(false);
}
};

const handleEditKeyDown = (e) => {
if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleEditSave(); }
if (e.key === "Escape") { setEditingMsg(null); }
};

const handleSend = async (text) => {
const userText = text || input.trim();
if (!userText || loading) return;
setInput("");
setShowQuick(false);
if (contactState === "prompt") setContactState(null);
addMessage("user", userText);
if (activeTicketId && contactState === "created") {
notifyAdmin(userText);
return;
}
if (activeTicketId) notifyAdmin(userText);
setLoading(true);
await new Promise(r => setTimeout(r, 350));
if (isOutOfScope(userText)) {
setLoading(false);
addMessage("assistant", "I can only help with HR-related topics like leave, attendance, payroll, and company policies. Would you like to contact the support team for this?");
setContactState("prompt");
return;
}
const predefined = findPredefined(userText);
if (predefined) { setLoading(false); addMessage("assistant", predefined); return; }
try {
const history = [...messages, { role: "user", content: userText }];
const response = await fetch("https://api.anthropic.com/v1/messages", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
model: "claude-sonnet-4-20250514",
max_tokens: 500,
system: "You are an HR assistant chatbot for Shnoor International. Answer only HR-related questions about company policies, leave, attendance, payroll, and technical support. If asked something unrelated to HR, politely decline. Be concise and friendly.",
messages: history.filter(m => m.role === "user" || m.role === "assistant").map(m => ({ role: m.role, content: m.content })),
}),
});
const data = await response.json();
const aiReply = data.content?.[0]?.text || "I am not sure about that. Please contact support for help.";
addMessage("assistant", aiReply);
const uncertain = ["not sure", "don't know", "cannot answer", "contact support", "unable to help", "outside my", "i'm sorry, i can't"];
if (uncertain.some(p => aiReply.toLowerCase().includes(p))) setTimeout(() => setContactState("prompt"), 400);
} catch {
addMessage("assistant", "I could not answer. Please contact the admin.");
} finally {
setLoading(false);
}
};

const handleEscalate = async () => {
setEscalating(true);
setContactState("creating");
try {
const chatHistory = messages.map(m => ({ role: m.role === "admin" ? "assistant" : m.role, content: m.content, timestamp: m.timestamp }));
const res = await axios.post(`${API}/api/support`, { subject: "Support Request from " + getUserName(), messages: chatHistory }, { headers: getHeaders() });
const newTicketId = res.data.data?.ticket_id;
setActiveTicketId(newTicketId);
setSeenReplyCount(0);
setContactState("created");
fetchTickets();
addMessage("assistant", "Your ticket has been created and sent to the support team! I will notify you here when they reply. You can also use Check Reply anytime. You can now attach files using the paperclip icon.");
} catch {
setContactState(null);
addMessage("assistant", "Failed to create ticket. Please try again.");
} finally {
setEscalating(false);
}
};

const checkForReply = async () => {
if (!activeTicketId) return;
setCheckingReply(true);
try {
const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
const ticket = (res.data.data || []).find(t => t.ticket_id === activeTicketId);
if (!ticket) { addMessage("assistant", "Could not find your ticket."); return; }
const conv = safeArr(ticket.conversation);
if (conv.length === 0) { addMessage("assistant", "No reply yet. The admin will get back to you soon."); return; }
const newOnes = conv.slice(seenReplyCount);
if (newOnes.length > 0) {
setSeenReplyCount(conv.length);
newOnes.forEach(r => addMessage("admin", (r.sender || "Admin") + " replied: " + r.content));
} else {
addMessage("assistant", "All replies are shown above. Anything else I can help with?");
}
} catch {
addMessage("assistant", "Could not check for replies. Try again.");
} finally {
setCheckingReply(false);
}
};

const handleKeyDown = (e) => {
if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
};

const getBubbleStyle = (role) => {
if (role === "user") return { bg: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", radius: "16px 16px 4px 16px", align: "flex-end" };
if (role === "admin") return { bg: "#e0e7ff", color: "#1e293b", radius: "16px 16px 16px 4px", align: "flex-start", border: "1px solid #c7d2fe" };
return { bg: "#f1f5f9", color: "#1e293b", radius: "16px 16px 16px 4px", align: "flex-start" };
};

const activeTicket = tickets.find(t => t.ticket_id === activeTicketId);

return (
<>
<div
onClick={() => setIsOpen(!isOpen)}
style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(79,70,229,0.5)", transition: "transform 0.2s" }}
onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
{isOpen ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
{!isOpen && unreadCount > 0 && (
<div style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
{unreadCount}
</div>
)}
</div>

{isOpen && (
<div style={{ position: "fixed", bottom: 96, right: 28, zIndex: 9998, width: 375, height: 590, borderRadius: 16, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif", animation: "slideUp 0.2s ease" }}>

{showHistory && (
<HistoryPanel tickets={tickets} activeTicketId={activeTicketId} onSelect={loadTicket} onNew={startNewChat} onClose={() => setShowHistory(false)} loading={ticketsLoading} />
)}

<div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "12px 16px", color: "#fff", flexShrink: 0 }}>
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
<div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>S</div>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontWeight: 700, fontSize: 14 }}>SHNOOR Assistant</div>
<div style={{ fontSize: 10, opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
<span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} /> Online
</div>
</div>
<button onClick={() => setShowHistory(true)} style={hdrBtn}><History size={12} /> History</button>
<button onClick={startNewChat} style={hdrBtn} title="New chat"><Plus size={13} /></button>
{contactState !== "created" && (
<button onClick={() => setContactState("prompt")} style={{ ...hdrBtn, background: "rgba(251,146,60,0.35)", border: "1px solid rgba(251,146,60,0.5)" }} title="Contact Support">
<PhoneCall size={12} />
</button>
)}
{activeTicketId && (
<button onClick={checkForReply} disabled={checkingReply} style={hdrBtn}>
<RefreshCw size={11} style={{ animation: checkingReply ? "spin 1s linear infinite" : "none" }} />
{checkingReply ? "..." : "Check"}
</button>
)}
</div>
{activeTicket && (
<div style={{ marginTop: 8, padding: "4px 10px", background: "rgba(255,255,255,0.12)", borderRadius: 8, fontSize: 11, color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", gap: 6 }}>
<MessageSquare size={10} />
<span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>Ticket #{activeTicketId}</span>
</div>
)}
</div>

<div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 8px", display: "flex", flexDirection: "column", gap: 8 }}
onClick={() => { setEmojiPicker(null); setContextMenu(null); }}>

{messages.map((msg, idx) => {
const style = getBubbleStyle(msg.role);
const isUser = msg.role === "user";
const hasMeta = msg._source && msg._index !== undefined;
const msgKey = hasMeta ? msg._source + "-" + msg._index : null;
const mr = msgKey && reactions[msgKey] ? reactions[msgKey] : {};
const canAct = hasMeta && activeTicketId;
const isEditingThis = editingMsg?.msgIndex === idx;

return (
<div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
<div
style={{ display: "flex", alignItems: "flex-end", gap: 4, flexDirection: isUser ? "row-reverse" : "row", position: "relative" }}
onMouseEnter={e => { const b = e.currentTarget.querySelector("[data-actbar]"); if (b) b.style.opacity = "1"; }}
onMouseLeave={e => { const b = e.currentTarget.querySelector("[data-actbar]"); if (b && emojiPicker !== idx && contextMenu !== idx) b.style.opacity = "0"; }}>

{isEditingThis ? (
<div style={{ maxWidth: "82%", background: "#f0f4ff", border: "1.5px solid #a5b4fc", borderRadius: "12px", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
<textarea
ref={editInputRef}
value={editContent}
onChange={e => setEditContent(e.target.value)}
onKeyDown={handleEditKeyDown}
rows={2}
style={{ border: "none", background: "transparent", outline: "none", resize: "none", fontSize: 13, color: "#1e293b", lineHeight: 1.5, width: "100%", minWidth: 180 }}
/>
<div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
<button onClick={() => setEditingMsg(null)} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", color: "#64748b", cursor: "pointer", fontWeight: 500 }}>Cancel</button>
<button onClick={handleEditSave} disabled={editSaving || !editContent.trim()} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, border: "none", background: editSaving ? "#a5b4fc" : "#4f46e5", color: "#fff", cursor: editSaving ? "not-allowed" : "pointer", fontWeight: 600 }}>
{editSaving ? "Saving..." : "Save"}
</button>
</div>
</div>
) : (
<div
style={{ maxWidth: "82%", padding: "9px 13px", borderRadius: style.radius, background: style.bg, color: style.color, fontSize: 13.5, lineHeight: 1.6, border: style.border || "none" }}
dangerouslySetInnerHTML={{ __html: renderMd(msg.content) }}
/>
)}

{canAct && !isEditingThis && (
<div data-actbar style={{ display: "flex", gap: 3, opacity: 0, transition: "opacity 0.15s", flexShrink: 0, position: "relative" }}>
<button
onClick={e => { e.stopPropagation(); setContextMenu(null); setEmojiPicker(emojiPicker === idx ? null : idx); }}
style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "2px 5px", cursor: "pointer", fontSize: 14, lineHeight: 1, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
react
</button>
<button
onClick={e => { e.stopPropagation(); setEmojiPicker(null); setContextMenu(contextMenu === idx ? null : idx); }}
style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "3px 5px", cursor: "pointer", display: "flex", alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
<Pencil size={11} color="#94a3b8" />
</button>

{emojiPicker === idx && (
<div
style={{ position: "absolute", [isUser ? "right" : "left"]: 0, bottom: "calc(100% + 6px)", zIndex: 9999, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", padding: "6px 8px", display: "flex", gap: 2 }}
onClick={e => e.stopPropagation()}>
{EMOJI_LIST.map(em => (
<button key={em} onClick={() => handleReact(idx, em)}
style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 18, padding: "4px 5px", borderRadius: 8, lineHeight: 1 }}
onMouseEnter={ev => ev.currentTarget.style.background = "#f1f5f9"}
onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
{em}
</button>
))}
</div>
)}

{contextMenu === idx && (
<div
style={{ position: "absolute", [isUser ? "right" : "left"]: 0, bottom: "calc(100% + 4px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 9999, minWidth: 180, overflow: "hidden" }}
onClick={e => e.stopPropagation()}>
<button onClick={() => openEditMsg(idx)}
style={{ width: "100%", padding: "10px 14px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#4f46e5", fontWeight: 500 }}
onMouseEnter={e => e.currentTarget.style.background = "#f0f4ff"}
onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
<Pencil size={12} /> Edit Message
</button>
<div style={{ height: 1, background: "#f1f5f9" }} />
<button onClick={() => handleDeleteMessage(idx, "self")}
style={{ width: "100%", padding: "10px 14px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#374151" }}
onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
Delete for Me
</button>
{isUser && (
<>
<div style={{ height: 1, background: "#f1f5f9" }} />
<button onClick={() => handleDeleteMessage(idx, "everyone")}
style={{ width: "100%", padding: "10px 14px", border: "none", background: "#fff", textAlign: "left", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#ef4444" }}
onMouseEnter={e => e.currentTarget.style.background = "#fff1f2"}
onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
Delete for Everyone
</button>
</>
)}
</div>
)}
</div>
)}
</div>

{Object.keys(mr).length > 0 && (
<div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 3 }}>
{Object.entries(mr).map(([em, uids]) => {
if (!uids?.length) return null;
const mine = uids.includes(currentUserId);
return (
<button key={em} onClick={() => handleReact(idx, em)}
style={{ background: mine ? "#e0e7ff" : "#f1f5f9", border: mine ? "1px solid #a5b4fc" : "1px solid #e2e8f0", borderRadius: 20, padding: "2px 7px", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 3 }}>
<span style={{ fontSize: 13 }}>{em}</span>
<span style={{ color: mine ? "#4f46e5" : "#64748b", fontWeight: mine ? 700 : 500 }}>{uids.length}</span>
</button>
);
})}
</div>
)}

<div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
{msg.role === "admin" ? "Admin - " : ""}{fmt(msg.timestamp)}
{msg.edited && <span style={{ color: "#c4b5fd", fontStyle: "italic" }}>· edited</span>}
</div>
</div>
);
})}

{attachments.length > 0 && (
<div style={{ background: "#f8fafc", borderRadius: 10, padding: 10, border: "1px solid #e2e8f0" }}>
<div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
Attachments ({attachments.length})
</div>
{attachments.map(att => (
<div key={att.attachment_id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, padding: "6px 10px", border: "1px solid #e2e8f0", marginBottom: 4 }}>
{isImgType(att.file_type) ? <Image size={15} color="#4f46e5" /> : <FileText size={15} color="#64748b" />}
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</div>
<div style={{ fontSize: 10, color: "#94a3b8" }}>{att.uploader_name} - {fmtSz(att.file_size)}</div>
</div>
{isImgType(att.file_type) && (
<a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#4f46e5", textDecoration: "none" }}>View</a>
)}
<a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name} style={{ color: "#64748b", display: "flex" }}>
<Download size={13} />
</a>
</div>
))}
</div>
)}

{loading && (
<div style={{ display: "flex" }}>
<div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#f1f5f9", display: "flex", gap: 4, alignItems: "center" }}>
<span style={dotStyle(0)} /><span style={dotStyle(0.2)} /><span style={dotStyle(0.4)} />
</div>
</div>
)}

{contactState === "prompt" && !loading && (
<div style={{ background: "#f0f4ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "12px 14px" }}>
<div style={{ fontSize: 13, color: "#3730a3", fontWeight: 600, marginBottom: 4 }}>Contact Support Team</div>
<div style={{ fontSize: 12, color: "#6366f1", marginBottom: 10 }}>Would you like to create a support ticket and chat with our admin team?</div>
<div style={{ display: "flex", gap: 8 }}>
<button onClick={handleEscalate} disabled={escalating}
style={{ flex: 1, padding: "7px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
{escalating ? "Creating ticket..." : "Yes, create ticket"}
</button>
<button onClick={() => setContactState(null)}
style={{ padding: "7px 12px", background: "#e0e7ff", color: "#4f46e5", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
Not now
</button>
</div>
</div>
)}

<div ref={messagesEndRef} />
</div>

{selectedFile && (
<div style={{ padding: "8px 12px", background: "#f0f4ff", borderTop: "1px solid #e0e7ff", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
<div style={{ flex: 1, minWidth: 0 }}>
<div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedFile.name}</div>
<div style={{ fontSize: 10, color: "#64748b" }}>{fmtSz(selectedFile.size)}</div>
</div>
<button onClick={uploadFile} disabled={uploading} style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
{uploading ? "Uploading..." : "Send"}
</button>
<button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 2, display: "flex" }}>
<X size={14} />
</button>
</div>
)}

{showQuick && (
<div style={{ padding: "6px 12px", flexShrink: 0 }}>
<div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 5, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Questions</div>
<div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
{QUICK_QUESTIONS.map((q, i) => (
<button key={i} onClick={() => handleSend(q)}
style={{ background: "#e0e7ff", color: "#4f46e5", border: "none", borderRadius: 20, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 500 }}
onMouseEnter={e => e.currentTarget.style.background = "#c7d2fe"}
onMouseLeave={e => e.currentTarget.style.background = "#e0e7ff"}>
{q}
</button>
))}
</div>
</div>
)}

<div style={{ padding: "8px 12px 12px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
<input ref={fileInputRef} type="file" style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={handleFileSelect} />
<button
onClick={() => { if (!activeTicketId) { addMessage("assistant", "Please create a support ticket first to attach files. Click the phone icon in the header."); return; } fileInputRef.current?.click(); }}
style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: activeTicketId ? "#4f46e5" : "#cbd5e1", flexShrink: 0 }}>
<Paperclip size={17} />
</button>
<input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
placeholder={contactState === "created" ? "Message admin..." : "Ask me anything about HR..."}
disabled={loading}
style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 24, padding: "8px 14px", fontSize: 13, outline: "none", background: "#f8fafc" }}
/>
<button onClick={() => handleSend()} disabled={!input.trim() || loading}
style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: input.trim() && !loading ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#e2e8f0", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
<Send size={14} color={input.trim() && !loading ? "#fff" : "#94a3b8"} />
</button>
</div>
</div>
)}

<style>{`
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`}</style>
</>
);
}

const hdrBtn = {
background: "rgba(255,255,255,0.2)",
border: "none",
borderRadius: 8,
padding: "5px 8px",
color: "#fff",
fontSize: 11,
fontWeight: 600,
cursor: "pointer",
display: "flex",
alignItems: "center",
gap: 4,
flexShrink: 0,
};