import React, { useState, useEffect } from "react";
import { Heart, Award, Clock, Eye, X, ChevronRight } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../../layouts/Sidebar";
import { PageContent } from "../../../../layouts/usePageLayout";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const appreciationTypeConfig = {
  general:          { label: "General",          color: "#f59e0b", bg: "#fffbeb" },
  performance:      { label: "Performance",       color: "#6366f1", bg: "#f5f3ff" },
  teamwork:         { label: "Teamwork",          color: "#10b981", bg: "#f0fdf4" },
  innovation:       { label: "Innovation",        color: "#3b82f6", bg: "#eff6ff" },
  leadership:       { label: "Leadership",        color: "#8b5cf6", bg: "#f5f3ff" },
  customer_service: { label: "Customer Service",  color: "#ec4899", bg: "#fdf2f8" },
};

const EmployeeAppreciation = () => {
  const [appreciations, setAppreciations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [viewItem,      setViewItem]      = useState(null);
  const [filter,        setFilter]        = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res   = await axios.get(`${API}/api/appreciations/my`, { headers: { "x-auth-token": token } });
        const list  = res.data?.data ?? res.data ?? [];
        setAppreciations(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load appreciations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = appreciations.filter(a => {
    if (filter === "all") return true;
    return a.appreciation_type === filter;
  });

  const s = {
    th:    { padding: "14px 20px", background: "#f8fafc", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" },
    td:    { padding: "14px 20px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f8fafc" },
    badge: (color, bg) => ({ background: bg, color, fontSize: "11px", fontWeight: "700", padding: "3px 10px", borderRadius: "6px", display: "inline-block" }),
    viewBtn: { background: "#fffbeb", color: "#d97706", border: "1px solid #fde68a", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "5px" },
  };

  return (
    <div className="d-flex bg-light min-vh-100" style={{ fontFamily: "'DM Sans',sans-serif" }}>
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">
          <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 20px 50px rgba(0,0,0,0.02)", overflow: "hidden", minHeight: "calc(100vh - 100px)" }}>

            {/* Header */}
            <header style={{ padding: "32px 32px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <h1 style={{ fontFamily: "Roboto,sans-serif", fontSize: "26px", fontWeight: "800", color: "#0f172a", margin: 0, letterSpacing: "-0.8px" }}>My Appreciations</h1>
                  <p style={{ color: "#64748b", fontSize: "14px", marginTop: "6px", marginBottom: 0 }}>Recognition letters received from your organisation</p>
                </div>
                {/* Stats pills */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[
                    { label: "Total Received", value: appreciations.length,                              color: "#f59e0b", bg: "#fffbeb" },
                    { label: "This Year",      value: appreciations.filter(a => new Date(a.sent_at || a.created_at).getFullYear() === new Date().getFullYear()).length, color: "#10b981", bg: "#f0fdf4" },
                  ].map((pill, i) => (
                    <div key={i} style={{ background: pill.bg, color: pill.color, borderRadius: "12px", padding: "10px 18px", textAlign: "center" }}>
                      <div style={{ fontSize: "22px", fontWeight: "800" }}>{pill.value}</div>
                      <div style={{ fontSize: "11px", fontWeight: "600" }}>{pill.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </header>

            <div style={{ padding: "24px 32px" }}>

              {/* Filter chips */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
                {["all", ...Object.keys(appreciationTypeConfig)].map(key => {
                  const c       = key === "all" ? { label: "All", color: "#334155", bg: "#f1f5f9" } : appreciationTypeConfig[key];
                  const active  = filter === key;
                  return (
                    <button key={key} type="button" onClick={() => setFilter(key)}
                      style={{ border: active ? `2px solid ${c.color}` : "1.5px solid #e2e8f0", borderRadius: "20px", padding: "6px 16px", cursor: "pointer", background: active ? c.bg : "#fff", fontSize: "13px", fontWeight: "700", color: active ? c.color : "#64748b", transition: "all 0.15s" }}>
                      {c.label}
                    </button>
                  );
                })}
              </div>

              {/* Empty state */}
              {!loading && filtered.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", color: "#94a3b8", gap: "16px" }}>
                  <Heart size={48} strokeWidth={1} />
                  <p style={{ fontSize: "15px", fontWeight: "600" }}>No appreciations yet</p>
                  <p style={{ fontSize: "13px" }}>Your appreciation letters from the organisation will appear here</p>
                </div>
              )}

              {/* Table */}
              {(loading || filtered.length > 0) && (
                <div style={{ borderRadius: "16px", border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                      <thead>
                        <tr>{["Title", "Type", "Received On", "Action"].map(h => (<th key={h} style={s.th}>{h}</th>))}</tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="4" style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>Loading your appreciations...</td></tr>
                        ) : filtered.map((item, i) => {
                          const type = item.appreciation_type || "general";
                          const lc   = appreciationTypeConfig[type] || appreciationTypeConfig.general;
                          const date = item.sent_at || item.created_at;
                          return (
                            <tr key={i} onMouseOver={e => e.currentTarget.style.backgroundColor = "#fcfdfe"} onMouseOut={e => e.currentTarget.style.backgroundColor = "transparent"}>
                              <td style={s.td}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: lc.bg, color: lc.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Award size={16} />
                                  </div>
                                  <span style={{ fontWeight: "700", color: "#1e293b" }}>{item.title || "Appreciation Letter"}</span>
                                </div>
                              </td>
                              <td style={s.td}><span style={s.badge(lc.color, lc.bg)}>{lc.label}</span></td>
                              <td style={s.td}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#64748b" }}>
                                  <Clock size={13} />
                                  {date ? new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                                </div>
                              </td>
                              <td style={s.td}>
                                <button type="button" style={s.viewBtn} onClick={() => setViewItem(item)}>
                                  <Eye size={12} />View Letter
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* View Modal */}
        {viewItem && (
          <div onMouseDown={e => e.target === e.currentTarget && setViewItem(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: "16px" }}>
            <div onMouseDown={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "24px", width: "94vw", maxWidth: "760px", maxHeight: "90vh", display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.22)", overflow: "hidden" }}>

              {/* Modal header */}
              <div style={{ padding: "20px 28px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a" }}>{viewItem.title || "Appreciation Letter"}</div>
                  <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
                    Received on {viewItem.sent_at || viewItem.created_at ? new Date(viewItem.sent_at || viewItem.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "—"}
                  </div>
                </div>
                <button type="button" onClick={() => setViewItem(null)} style={{ background: "#f1f5f9", border: "none", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", color: "#64748b" }}><X size={18} /></button>
              </div>

              {/* Modal body */}
              <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
                <div style={{ background: "#fff", borderRadius: "14px", border: "1px solid #e2e8f0", padding: "28px", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
                  <div dangerouslySetInnerHTML={{ __html: viewItem.html_content }} />
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ padding: "14px 28px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "flex-end", flexShrink: 0, background: "#fff" }}>
                <button type="button" onClick={() => setViewItem(null)} style={{ background: "#f1f5f9", color: "#334155", border: "none", borderRadius: "10px", padding: "10px 24px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </PageContent>
    </div>
  );
};

export default EmployeeAppreciation;