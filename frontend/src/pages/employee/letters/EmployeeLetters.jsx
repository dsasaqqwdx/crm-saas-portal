
import React, { useState, useEffect } from "react";
import { Mail, FileText, X, Inbox } from "lucide-react";
import axios from "axios";
import { useNotifications } from "../../../context/NotificationContext";

import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const letterTypeConfig = {
  offer: { label: "Offer Letter", color: "#6366f1", bg: "#f5f3ff" },
  experience: { label: "Experience Letter", color: "#10b981", bg: "#f0fdf4" },
  relieving: { label: "Relieving Letter", color: "#3b82f6", bg: "#eff6ff" },
};


const LetterModal = ({ letter, onClose }) => {
  if (!letter) return null;
  const lc = letterTypeConfig[letter.letter_type] || letterTypeConfig.offer;
  
  return (
    <div 
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 10000,
        display: "flex", alignItems: "center", justifyContent: "center", 
        backdropFilter: "blur(6px)", padding: "16px"
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "800px",
        maxHeight: "90vh", display: "flex", flexDirection: "column", 
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden"
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid #f1f5f9",
          display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: lc.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
               <FileText size={20} color={lc.color} />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a" }}>{lc.label}</div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Issued: {new Date(letter.created_at || letter.sent_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={18} color="#64748b" />
          </button>
        </div>
        
        <div style={{ overflowY: "auto", padding: "32px", background: "#f8fafc" }}>
          <div style={{ 
            background: "#fff", padding: "40px", borderRadius: "16px", border: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", minHeight: "100%"
          }}>
            <div dangerouslySetInnerHTML={{ __html: letter.html_content || "<p>No content available.</p>" }} />
          </div>
        </div>

        <div style={{ padding: "16px 24px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", background: "#fff" }}>
           <button onClick={() => window.print()} style={{ padding: "10px 20px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
             Print / Download PDF
           </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeLetters = () => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewLetter, setViewLetter] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const { markAsRead, markAllRead } = useNotifications();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/api/letters/my-letters`, { headers: { "x-auth-token": token } });
        const list = res.data?.data ?? [];
        setLetters(Array.isArray(list) ? list : []);
        
        if (typeof markAllRead === "function") {
            markAllRead();
        }
      } catch (err) {
        console.warn("Could not load letters:", err.message);
      } finally {
        setLoading(false);
      }
    };
    
    load();
    return () => window.removeEventListener("resize", handleResize);
  }, [markAllRead]); 

  const handleView = (letter) => {
    setViewLetter(letter);

    if (typeof markAsRead === "function") {
        markAsRead(letter._id || letter.id);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />
      <PageContent>
        <div style={{ padding: isMobile ? "20px" : "32px", width: "100%" }}>
          <header style={{ marginBottom: "28px" }}>
            <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>My Documents</h1>
            <p style={{ color: "#64748b", marginTop: "4px" }}>View and download your official company letters</p>
          </header>

          <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "40px", height: "40px", background: "#f5f3ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Inbox size={20} color="#6366f1" />
                </div>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a" }}>Inbox</div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>{letters.length} Document(s) Received</div>
                </div>
              </div>
            </div>

            {loading ? (
              <div style={{ padding: "80px 20px", textAlign: "center", color: "#94a3b8" }}>
                <div className="spinner-border text-primary mb-3"></div>
                <div style={{ fontWeight: "600" }}>Fetching your documents...</div>
              </div>
            ) : letters.length === 0 ? (
              <div style={{ padding: "80px 20px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", background: "#f8fafc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "#cbd5e1" }}>
                  <Mail size={32} />
                </div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>No letters found</div>
                <p style={{ color: "#94a3b8", fontSize: "14px", maxWidth: "250px", margin: "8px auto" }}>Any official letters issued by HR will appear here.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Document Type", "Date Received", "Status", ""].map(h => (
                        <th key={h} style={{ padding: "14px 24px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {letters.map((letter, i) => {
                      const lc = letterTypeConfig[letter.letter_type] || letterTypeConfig.offer;
                      const date = letter.created_at || letter.sent_at;
                      const readIds = JSON.parse(localStorage.getItem("readLetterIds") || "[]");
                      const isUnread = !readIds.includes(String(letter._id || letter.id));
                      
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", background: isUnread ? "#fdfcff" : "transparent", transition: "0.2s" }}>
                          <td style={{ padding: "16px 24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: lc.bg, color: lc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <FileText size={18} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontWeight: isUnread ? "800" : "700", fontSize: "14px", color: "#1e293b", display: "flex", alignItems: "center", gap: "8px" }}>
                                  {lc.label}
                                  {isUnread && <span style={{ background: "#6366f1", color: "#fff", fontSize: "9px", fontWeight: "900", padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase" }}>New</span>}
                                </div>
                                <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>SHNOOR INTERNATIONAL LLC</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "16px 24px", fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                            {date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td style={{ padding: "16px 24px" }}>
                            <span style={{ background: "#f0fdf4", color: "#10b981", fontSize: "11px", fontWeight: "700", padding: "4px 10px", borderRadius: "8px" }}>
                              Received
                            </span>
                          </td>
                          <td style={{ padding: "16px 24px", textAlign: "right" }}>
                            <button 
                              onClick={() => handleView(letter)}
                              style={{ 
                                background: "#fff", color: "#6366f1", border: "1.5px solid #6366f1", 
                                borderRadius: "10px", padding: "8px 16px", fontSize: "12px", 
                                fontWeight: "800", cursor: "pointer", transition: "0.2s" 
                              }}
                              onMouseOver={e => { e.currentTarget.style.background = "#6366f1"; e.currentTarget.style.color = "#fff"; }}
                              onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#6366f1"; }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </PageContent>

      {viewLetter && <LetterModal letter={viewLetter} onClose={() => setViewLetter(null)} />}
    </div>
  );
};

export default EmployeeLetters;