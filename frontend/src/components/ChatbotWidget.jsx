import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, AlertCircle, RefreshCw, Paperclip, Download, FileText, Image } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const QA_DATABASE = [
  { keywords: ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "howdy"], answer: " Hello! Welcome to Shnoor chatbot. How can I help you today? I am able to help u with questions related to  company policies, leave, attendance, or technical support." },
  { keywords: ["bye", "goodbye", "see you", "take care", "thanks bye", "thank you bye"], answer: "Goodbye! Have a great day! Feel free to come back anytime you need help. " },
  { keywords: ["how are you", "how r u", "how are u", "how do you do", "what's up", "whats up"], answer: "I'm doing great, thank you for asking!  I'm here and ready to help you with any  questions. What can I assist you with today?" },
  { keywords: ["thank you", "thanks", "thank u", "thankyou", "thx", "ty"], answer: "You're welcome! Is there anything else I can help you with?" },
  { keywords: ["who are you", "what are you", "what is your name", "who r u"], answer: "I'm the Shnoor chatbot — an AI-powered chatbot here to help employees  with company policies, leave, attendance, and technical support. How can I help you?" },
  { keywords: ["how many leaves", "total leaves", "leave balance", "annual leave", "how many days leave", "leave days"], answer: " **Leave Entitlements:**\n\n• **Annual Leave:** 20 days per year\n• **Sick Leave:** 10 days per year\n• **Casual Leave:** 5 days per year\n• **Maternity Leave:** 90 days\n• **Paternity Leave:** 5 days\n\nLeave balances reset every January 1st. Unused annual leave can be carried forward up to 5 days." },
  { keywords: ["how to apply leave", "apply for leave", "leave application", "how do i apply", "request leave", "leave request"], answer: "**How to Apply for Leave:**\n\n1. Login to your Employee Dashboard\n2. Click on **'Leaves'** in the sidebar\n3. Click **'Apply Leave'** button\n4. Select leave type, start date, and end date\n5. Add a reason and submit\n\nYour admin will be notified and will approve or reject within 24 hours." },
  { keywords: ["sick leave", "medical leave", "i am sick", "not feeling well", "doctor leave"], answer: "**Sick Leave Policy:**\n\n• You are entitled to **10 sick days** per year\n• For sick leave up to 2 days: No medical certificate required\n• For sick leave 3+ days: Medical certificate must be submitted within 3 days of returning\n• Notify your manager via the leave system before 9 AM if possible" },
  { keywords: ["leave approval", "who approves", "leave status", "pending leave", "leave approved"], answer: " **Leave Approval Process:**\n\n• Leave requests are reviewed by your **Company Admin**\n• Approval typically takes **24 hours**\n• You'll see status as Pending → Approved/Rejected in your dashboard\n• For urgent leave, please contact your admin directly" },
  { keywords: ["how to mark attendance", "mark attendance", "attendance", "check in", "how to check in"], answer: "**How to Mark Attendance:**\n\n1. Login to your Employee Dashboard\n2. Click **'My Attendance'** in the sidebar\n3. Click **'Mark Present'** button\n4. Attendance must be marked **before 10:00 AM** daily\n\n Late marking (after 10 AM) will be recorded as Late. Missing marking will be recorded as Absent." },
  { keywords: ["attendance not marked", "forgot attendance", "missed attendance", "attendance correction", "wrong attendance"], answer: "**Attendance Not Marked?**\n\nIf you forgot to mark attendance or it shows incorrectly:\n\n1. Contact your **Admin immediately**\n2. Provide the date and reason\n3. Admin can manually correct attendance records\n\nFor repeated issues, please raise a support ticket by clicking **Contact Support Team** below." },
  { keywords: ["working hours", "office hours", "what time", "office timing", "work time", "shift timing"], answer: "**Working Hours:**\n\n• **Monday to Friday:** 9:00 AM – 6:00 PM\n• **Saturday & Sunday:** Off (Weekend)\n• **Lunch Break:** 1:00 PM – 2:00 PM\n• Total working hours: **8 hours per day**\n\nFlexible timing may apply for certain roles — check with your manager." },
  { keywords: ["work from home", "wfh", "remote work", "work remotely", "home office", "work from home policy"], answer: "**Work From Home Policy:**\n\n• WFH is available **every Friday** with prior manager approval\n• Request must be submitted **by Thursday 5 PM**\n• Maximum **4 WFH days per month**\n• Internet and equipment are employee's responsibility during WFH\n• Full availability on calls and messages is required during WFH" },
  { keywords: ["notice period", "resignation", "how to resign", "last working day", "exit", "quit job"], answer: "**Resignation & Notice Period:**\n\n• **Notice Period:** 30 days (1 month)\n• Submit your resignation letter to HR and your manager\n• Notice period buyout is possible with management approval\n• Full & Final settlement is processed within 45 days of last working day\n\nFor resignation formalities, please contact HR directly." },
  { keywords: ["probation", "probation period", "new employee", "joining", "probationary"], answer: "**Probation Period Policy:**\n\n• All new employees serve a **3-month probation period**\n• Performance review is conducted at end of probation\n• Leave entitlements are limited during probation (5 days only)\n• Confirmation letter is issued after successful completion" },
  { keywords: ["salary", "payroll", "when is salary", "salary date", "pay day", "when do i get paid"], answer: "**Payroll Information:**\n\n• Salary is processed on the **last working day** of every month\n• Salary slip is available in your Employee Dashboard under **Payroll**\n• Salary is credited to your registered bank account\n• Any salary discrepancies must be reported within **5 days** of credit" },
  { keywords: ["salary slip", "payslip", "pay slip", "download salary", "salary document"], answer: "**To Access Your Salary Slip:**\n\n1. Login to Employee Dashboard\n2. Click **'Payroll'** in the sidebar\n3. Select the month\n4. Click **Download** to get your salary slip as PDF\n\nSlips are available from the date of joining onwards." },
  { keywords: ["holiday", "holidays", "public holiday", "national holiday", "holiday list", "upcoming holiday"], answer: " **Company Holidays:**\n\nYou can view all upcoming holidays in your dashboard:\n\n1. Login to Employee Dashboard\n2. Click **'Holidays'** in the sidebar\n3. Full holiday calendar for the year is listed there\n\nThe company follows national public holidays plus additional company-specific holidays." },
];

const OUT_OF_SCOPE_KEYWORDS = ["weather", "news", "cricket", "movie", "film", "food", "recipe", "sports", "stock", "bitcoin", "crypto", "politics", "election", "song", "music", "game", "meme", "joke", "love", "relationship", "marriage", "personal"];
const QUICK_QUESTIONS = ["What is the leave policy?", "How to mark attendance?", "What are the working hours?", "Work from home policy?", "When is salary credited?", "How to apply for leave?"];

const getToken = () => localStorage.getItem("token");
const getUserName = () => localStorage.getItem("name") || "User";
const getHeaders = () => ({ "x-auth-token": getToken() });

const findPredefinedAnswer = (text) => {
  const lower = text.toLowerCase().trim();
  for (const qa of QA_DATABASE) {
    if (qa.keywords.some(k => lower.includes(k))) return qa.answer;
  }
  return null;
};

const isOutOfScope = (text) => OUT_OF_SCOPE_KEYWORDS.some(k => text.toLowerCase().includes(k));

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const isImageType = (fileType) => fileType && fileType.startsWith("image/");

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: " Hi! I'm your Shnoor Chatbot. I can answer questions about **company policies, leave, attendance, and payroll**.\n\nWhat would you like to know?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [showContactOption, setShowContactOption] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [seenReplies, setSeenReplies] = useState([]);
  const [checkingReply, setCheckingReply] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) { setUnreadCount(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [isOpen]);

  // Fetch attachments when ticket exists
  useEffect(() => {
    if (!ticketId) return;
    const fetchAttachments = async () => {
      try {
        const res = await axios.get(`${API}/api/attachments/${ticketId}`, { headers: getHeaders() });
        setAttachments(res.data.data || []);
      } catch (err) { console.error("Failed to fetch attachments:", err); }
    };
    fetchAttachments();
    const interval = setInterval(fetchAttachments, 15000);
    return () => clearInterval(interval);
  }, [ticketId]); // eslint-disable-line

  // Poll for admin replies
  useEffect(() => {
    if (!ticketId) return;
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
        const ticket = (res.data.data || []).find(t => t.ticket_id === ticketId);
        if (!ticket) return;
        let conversation = ticket.conversation || [];
        if (typeof conversation === "string") { try { conversation = JSON.parse(conversation); } catch { conversation = []; } }
        const newReplies = conversation.filter((_, idx) => idx >= seenReplies.length);
        if (newReplies.length > 0) {
          setSeenReplies(conversation);
          newReplies.forEach(reply => addMessage("admin", ` **${reply.sender || "Admin"} replied:** ${reply.content}`));
        }
      } catch (err) { console.error("Reply poll error:", err); }
    }, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, seenReplies]);

  const addMessage = (role, content) => {
    const msg = { role, content, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);
    if (role !== "user" && !isOpen) setUnreadCount(prev => prev + 1);
  };

  // ✅ Notify admin when employee sends a message after ticket is created
  const notifyAdminOfMessage = async (text) => {
    if (!ticketId) return;
    try {
      await axios.post(
        `${API}/api/support/${ticketId}/employee-message`,
        { message: text },
        { headers: getHeaders() }
      );
    } catch (err) {
      // Silent fail — notification is non-critical
    }
  };

  // File handling
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      addMessage("assistant", "⚠️ File size must be under **5MB**. Please choose a smaller file.");
      return;
    }
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;
    if (!ticketId) {
      addMessage("assistant", "⚠️ Please create a support ticket first by clicking **Contact Support Team**, then you can attach files.");
      setSelectedFile(null);
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const res = await axios.post(`${API}/api/attachments/${ticketId}`, formData, {
        headers: { ...getHeaders(), "Content-Type": "multipart/form-data" },
      });
      setAttachments(prev => [...prev, res.data.data]);
      addMessage("user", `📎 Sent file: **${selectedFile.name}** (${formatFileSize(selectedFile.size)})`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      addMessage("assistant", `⚠️ Upload failed: ${err.response?.data?.message || "Please try again."}`);
    } finally { setUploading(false); }
  };

  const handleSend = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput(""); setShowQuestions(false); setShowContactOption(false);
    addMessage("user", userText);

    // ✅ Notify admin if ticket exists
    if (ticketId) {
      notifyAdminOfMessage(userText);
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));

    const escalateKeywords = ["contact support", "human", "live agent", "speak to someone", "real person", "support team", "contact admin", "talk to admin"];
    if (escalateKeywords.some(k => userText.toLowerCase().includes(k))) {
      setLoading(false);
      addMessage("assistant", "Sure! I'll connect you with our support team. Please click **Contact Support Team** below to create a ticket. 🎫");
      setShowContactOption(true); return;
    }
    if (isOutOfScope(userText)) {
      setLoading(false);
      addMessage("assistant", "I'm sorry, that topic is outside my scope. I'm specifically designed to help with **HR-related queries** like leave, attendance, company policies, and payroll.\n\nWould you like to contact our support team for further assistance?");
      setShowContactOption(true); return;
    }
    const predefinedAnswer = findPredefinedAnswer(userText);
    if (predefinedAnswer) { setLoading(false); addMessage("assistant", predefinedAnswer); return; }

    try {
      const history = messages.concat({ role: "user", content: userText });
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 500,
          system: `You are a chatbot for Shnoor International. Answer only HR-related questions about company policies, leave, attendance, payroll, and technical support. If asked something unrelated to HR, say you cannot help with that topic and suggest contacting support. Be concise and friendly.`,
          messages: history.filter(m => m.role === "user" || m.role === "assistant").map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const aiReply = data.content?.[0]?.text || "I'm not sure about that. Please contact support for help.";
      addMessage("assistant", aiReply);
      const uncertainPhrases = ["not sure", "don't know", "cannot answer", "contact support", "unable to", "i'm sorry", "outside my"];
      if (uncertainPhrases.some(p => aiReply.toLowerCase().includes(p))) setTimeout(() => setShowContactOption(true), 500);
    } catch (err) {
      addMessage("assistant", "I'm having trouble connecting right now. Please try again or contact our support team for help.");
      setShowContactOption(true);
    } finally { setLoading(false); }
  };

  const handleEscalate = async () => {
    setEscalating(true); setShowContactOption(false);
    const currentName = getUserName();
    try {
      const chatHistory = messages.map(m => ({ role: m.role === "admin" ? "assistant" : m.role, content: m.content, timestamp: m.timestamp }));
      const res = await axios.post(`${API}/api/support`,
        { subject: `Support Request from ${currentName}`, messages: chatHistory },
        { headers: getHeaders() }
      );
      const newTicketId = res.data.data?.ticket_id;
      setTicketId(newTicketId); setSeenReplies([]);
      addMessage("assistant", `Your request has been sent to the admin team. I'll notify you here as soon as they reply. You can also click **"Check Reply"** anytime.\n\n📎 You can now attach files using the **paperclip icon** below!`);
    } catch (err) {
      addMessage("assistant", "There was an issue creating your support ticket. Please try again.");
    } finally { setEscalating(false); }
  };

  const checkForReply = async () => {
    if (!ticketId) return;
    setCheckingReply(true);
    try {
      const res = await axios.get(`${API}/api/support/my`, { headers: getHeaders() });
      const ticket = (res.data.data || []).find(t => t.ticket_id === ticketId);
      if (!ticket) { addMessage("assistant", "Couldn't find your ticket. Please try again."); return; }
      let conversation = ticket.conversation || [];
      if (typeof conversation === "string") { try { conversation = JSON.parse(conversation); } catch { conversation = []; } }
      if (conversation.length === 0) { addMessage("assistant", "No reply yet from the admin. They will get back to you soon."); return; }
      const newReplies = conversation.filter((_, idx) => idx >= seenReplies.length);
      if (newReplies.length > 0) {
        setSeenReplies(conversation);
        newReplies.forEach(reply => addMessage("admin", ` **${reply.sender || "Admin"} replied:** ${reply.content}`));
      } else {
        addMessage("assistant", "All admin replies are shown above. Is there anything else I can help with?");
      }
    } catch (err) { addMessage("assistant", "Couldn't check for replies right now. Please try again."); }
    finally { setCheckingReply(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };
  const formatTime = (date) => new Date(date).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

  const getBubbleStyle = (role) => {
    if (role === "user") return { bg: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", radius: "16px 16px 4px 16px", align: "flex-end" };
    if (role === "admin") return { bg: "#e0e7ff", color: "#1e293b", radius: "16px 16px 16px 4px", align: "flex-start", border: "1px solid #c7d2fe" };
    return { bg: "#f1f5f9", color: "#1e293b", radius: "16px 16px 16px 4px", align: "flex-start" };
  };

  const renderContent = (content) => content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');

  return (
    <>
      {/* Floating Button */}
      <div onClick={() => setIsOpen(!isOpen)}
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 20px rgba(79,70,229,0.5)", transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
      >
        {isOpen ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
        {!isOpen && unreadCount > 0 && (
          <div style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "#fff", borderRadius: "50%", width: 20, height: 20, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadCount}</div>
        )}
      </div>

      {isOpen && (
        <div style={{ position: "fixed", bottom: 96, right: 28, zIndex: 9998, width: 375, height: 590, borderRadius: 16, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", overflow: "hidden", fontFamily: "'Segoe UI', sans-serif", animation: "slideUp 0.2s ease" }}>

          {/* Header */}
          <div style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", padding: "14px 18px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>SHNOOR Assistant</div>
                <div style={{ fontSize: 11, opacity: 0.85, display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                  Queries + Admin Support
                </div>
              </div>
              {ticketId && (
                <button onClick={checkForReply} disabled={checkingReply}
                  style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 6, padding: "4px 8px", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <RefreshCw size={11} /> {checkingReply ? "Checking..." : "Check Reply"}
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((msg, idx) => {
              const style = getBubbleStyle(msg.role);
              return (
                <div key={idx} style={{ display: "flex", justifyContent: style.align }}>
                  <div style={{ maxWidth: "85%" }}>
                    <div style={{ padding: "10px 13px", borderRadius: style.radius, background: style.bg, color: style.color, fontSize: 13.5, lineHeight: 1.6, border: style.border || "none" }}
                      dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                    />
                    <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3, textAlign: style.align === "flex-end" ? "right" : "left" }}>
                      {msg.role === "admin" ? " Admin • " : ""}{formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Attachments list */}
            {attachments.length > 0 && (
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 10, border: "1px solid #e2e8f0" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  📎 Attachments ({attachments.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {attachments.map((att) => (
                    <div key={att.attachment_id} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", borderRadius: 8, padding: "6px 10px", border: "1px solid #e2e8f0" }}>
                      {isImageType(att.file_type) ? <Image size={16} color="#4f46e5" /> : <FileText size={16} color="#64748b" />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{att.file_name}</div>
                        <div style={{ fontSize: 10, color: "#94a3b8" }}>{att.uploader_name} • {formatFileSize(att.file_size)}</div>
                      </div>
                      {isImageType(att.file_type) && (
                        <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: "#4f46e5", textDecoration: "none", flexShrink: 0 }}>View</a>
                      )}
                      <a href={`${API}${att.file_url}`} target="_blank" rel="noreferrer" download={att.file_name}
                        style={{ color: "#64748b", display: "flex", alignItems: "center", flexShrink: 0 }}>
                        <Download size={14} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 4px", background: "#f1f5f9", display: "flex", gap: 4, alignItems: "center" }}>
                  <span style={dotStyle(0)} /><span style={dotStyle(0.2)} /><span style={dotStyle(0.4)} />
                </div>
              </div>
            )}

            {showContactOption && !loading && (
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontSize: 13, color: "#92400e", fontWeight: 600, marginBottom: 8 }}>Would you like to contact our support team?</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleEscalate} disabled={escalating}
                    style={{ flex: 1, padding: "7px 12px", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    {escalating ? "Creating..." : " Yes, Contact Support"}
                  </button>
                  <button onClick={() => setShowContactOption(false)}
                    style={{ padding: "7px 12px", background: "#f1f5f9", color: "#64748b", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    No Thanks
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* File Preview Bar */}
          {selectedFile && (
            <div style={{ padding: "8px 12px", background: "#f0f4ff", borderTop: "1px solid #e0e7ff", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📎 {selectedFile.name}</div>
                <div style={{ fontSize: 10, color: "#64748b" }}>{formatFileSize(selectedFile.size)}</div>
              </div>
              <button onClick={uploadFile} disabled={uploading}
                style={{ background: "#4f46e5", color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                {uploading ? "Uploading..." : "Send File"}
              </button>
              <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", padding: 2, display: "flex", alignItems: "center" }}>
                <X size={14} />
              </button>
            </div>
          )}

          {/* Quick Questions */}
          {showQuestions && (
            <div style={{ padding: "0 12px 8px" }}>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Questions</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {QUICK_QUESTIONS.map((q, i) => (
                  <button key={i} onClick={() => handleSend(q)}
                    style={{ background: "#e0e7ff", color: "#4f46e5", border: "none", borderRadius: 20, padding: "4px 10px", fontSize: 11.5, cursor: "pointer", fontWeight: 500 }}
                    onMouseEnter={e => e.currentTarget.style.background = "#c7d2fe"}
                    onMouseLeave={e => e.currentTarget.style.background = "#e0e7ff"}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Support Button */}
          {!showContactOption && (
            <div style={{ padding: "0 12px 8px" }}>
              <button onClick={() => setShowContactOption(true)}
                style={{ width: "100%", padding: "7px", background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <AlertCircle size={13} /> Contact Support Team
              </button>
            </div>
          )}

          {/* Input Row */}
          <div style={{ padding: "10px 12px 12px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 8, alignItems: "center" }}>
            <input ref={fileInputRef} type="file" style={{ display: "none" }}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              onChange={handleFileSelect}
            />
            <button onClick={() => fileInputRef.current?.click()}
              title={ticketId ? "Attach file or image" : "Create a ticket first to attach files"}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", color: ticketId ? "#4f46e5" : "#cbd5e1", flexShrink: 0 }}>
              <Paperclip size={18} />
            </button>
            <input ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about HR..."
              disabled={loading}
              style={{ flex: 1, border: "1px solid #e2e8f0", borderRadius: 24, padding: "8px 14px", fontSize: 13, outline: "none", background: "#f8fafc" }}
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || loading}
              style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0, background: input.trim() && !loading ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#e2e8f0", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Send size={15} color={input.trim() && !loading ? "#fff" : "#94a3b8"} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </>
  );
}

const dotStyle = (delay) => ({ width: 7, height: 7, borderRadius: "50%", background: "#94a3b8", display: "inline-block", animation: `bounce 1.2s ${delay}s infinite` });
