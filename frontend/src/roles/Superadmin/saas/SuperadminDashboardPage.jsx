// import React, { useState, useEffect } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { PageContent } from "../../../layouts/usePageLayout";
// import { Shield, Building, Users, Settings } from "lucide-react";
// import axios from "axios";

// const SuperadminDashboardPage = () => {
//   const [companies, setCompanies] = useState([]);
//   const [globalStats, setGlobalStats] = useState({
//     totalCompanies: 0, totalUsers: 0, activeLicenses: 0, systemAlerts: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const headers = { "x-auth-token": token };
//         const [companiesRes, statsRes] = await Promise.all([
//           axios.get("http://localhost:5001/api/saas/companies", { headers }),
//           axios.get("http://localhost:5001/api/saas/global-summary", { headers }),
//         ]);
//         if (companiesRes.data.success) setCompanies(companiesRes.data.data);
//         if (statsRes.data.success) setGlobalStats(statsRes.data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const stats = [
//     { title: "Total Companies",  val: globalStats.totalCompanies,  icon: <Building size={20} />, color: "primary" },
//     { title: "Active Licenses",  val: globalStats.activeLicenses,  icon: <Shield size={20} />,   color: "success" },
//     { title: "Total Users",      val: globalStats.totalUsers,      icon: <Users size={20} />,    color: "info" },
//     { title: "System Alerts",    val: globalStats.systemAlerts,    icon: <Settings size={20} />, color: "warning" },
//   ];

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <PageContent>
//         <div className="container-fluid p-3 p-md-4">
//           <div className="mb-4">
//             <h2 className="fw-bold text-dark fs-4 fs-md-2">Superadmin Control Panel</h2>
//             <p className="text-muted small">Global oversight of all companies and system-wide configurations.</p>
//           </div>

//           <div className="row g-3 mb-4">
//             {stats.map((stat, idx) => (
//               <div key={idx} className="col-6 col-lg-3">
//                 <div className="card shadow-sm border-0 h-100">
//                   <div className="card-body d-flex align-items-center p-3">
//                     <div className={`bg-${stat.color} text-white p-2 p-md-3 rounded me-3 flex-shrink-0`}>
//                       {stat.icon}
//                     </div>
//                     <div>
//                       <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>{stat.title}</p>
//                       <h5 className="fw-bold mb-0">{stat.val}</h5>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="card shadow-sm border-0">
//             <div className="card-body p-3 p-md-4">
//               <h5 className="fw-bold mb-3 fs-6 fs-md-5">Company Management</h5>
//               <div className="table-responsive">
//                 <table className="table table-hover align-middle" style={{ minWidth: "500px" }}>
//                   <thead className="table-light">
//                     <tr>
//                       <th>Company Name</th>
//                       <th className="d-none d-sm-table-cell">Subscribed On</th>
//                       <th>Plan</th>
//                       <th>Status</th>
                      
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {loading ? (
//                       <tr><td colSpan="4">Loading companies...</td></tr>
//                     ) : companies.map((company) => (
//                       <tr key={company.company_id}>
//                         <td style={{ fontSize: "0.9rem" }}>{company.company_name}</td>
//                         <td className="d-none d-sm-table-cell" style={{ fontSize: "0.85rem" }}>
//                           {new Date(company.created_at).toLocaleDateString()}
//                         </td>
//                         <td style={{ fontSize: "0.85rem" }}>{company.pricing_plan || "Pro"}</td>
//                         <td><span className="badge bg-success">Active</span></td>
                        
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </PageContent>
//     </div>
//   );
// };

// export default SuperadminDashboardPage;

import React, { useState, useEffect } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import {
  Shield, Building, Users, Settings, TrendingUp, Clock,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Bell,
  CreditCard, BarChart3, Activity, RefreshCw, Eye
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const SuperadminDashboardPage = () => {
  const navigate = useNavigate();
  const [companies,     setCompanies    ] = useState([]);
  const [globalStats,   setGlobalStats  ] = useState({ totalCompanies: 0, totalUsers: 0, activeLicenses: 0, systemAlerts: 0 });
  const [transactions,  setTransactions ] = useState([]);
  const [trialData,     setTrialData    ] = useState({ companies: [], requests: [] });
  const [adminProfile,  setAdminProfile ] = useState({ name: "", email: "", role: "Super Admin", avatar: "" });
  const [avatarErr,     setAvatarErr    ] = useState(false);
  const [loading,       setLoading      ] = useState(true);
  const [lastRefresh,   setLastRefresh  ] = useState(new Date());

  const token   = localStorage.getItem("token");
  const headers = { "x-auth-token": token };

  const fmtAmount = (a) => "₹" + Number(a || 0).toLocaleString("en-IN");
  const fmtDate   = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  const fmtDT     = (d) => d ? new Date(d).toLocaleString("en-IN",     { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [companiesRes, statsRes, txRes, trialsRes, reqRes, profileRes] = await Promise.all([
        axios.get(`${API}/api/saas/companies`,      { headers }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/saas/global-summary`, { headers }).catch(() => ({ data: { data: {} } })),
        axios.get(`${API}/api/transactions`,        { headers }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/saas/trials`,         { headers }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/saas/trials/requests`,{ headers }).catch(() => ({ data: { data: [] } })),
        axios.get(`${API}/api/super-admin/profile`, { headers }).catch(() => ({ data: {} })),
      ]);

      if (companiesRes.data.success)  setCompanies(companiesRes.data.data || []);
      if (statsRes.data.success)      setGlobalStats(statsRes.data.data   || {});
      setTransactions((txRes.data.data  || []).slice(0, 5));
      setTrialData({
        companies: (trialsRes.data.data || []).slice(0, 5),
        requests:  (reqRes.data.data   || []).filter(r => r.status === "pending").slice(0, 5),
      });

      const d = profileRes.data?.data || profileRes.data || {};
      if (d.name) {
        setAdminProfile({ name: d.name, email: d.email || "", role: d.role || "Super Admin", avatar: d.avatar || "" });
        setAvatarErr(false);
      } else {
        try {
          const p = JSON.parse(atob(token.split(".")[1]));
          setAdminProfile({ name: p.name || "Super Admin", email: p.email || "", role: "Super Admin", avatar: "" });
        } catch {}
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ── Derived trial stats ──
  const trialStats = {
    onTrial:   trialData.companies.filter(c => c.is_trial && parseInt(c.days_left) > 0 && c.is_active).length,
    expired:   trialData.companies.filter(c => c.is_trial && parseInt(c.days_left) <= 0).length,
    suspended: trialData.companies.filter(c => !c.is_active).length,
    pending:   trialData.requests.length,
  };

  const txPending  = transactions.filter(t => t.status === "pending").length;
  const txApproved = transactions.filter(t => t.status === "approved").length;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getTrialBadge = (c) => {
    if (!c.is_active)               return { label: "Suspended", bg: "#f1f5f9", color: "#64748b" };
    if (!c.is_trial)                return { label: "Active",    bg: "#dcfce7", color: "#16a34a" };
    if (parseInt(c.days_left) <= 0) return { label: "Expired",  bg: "#fee2e2", color: "#dc2626" };
    if (parseInt(c.days_left) <= 3) return { label: `${c.days_left}d left`, bg: "#fee2e2", color: "#dc2626" };
    return { label: `Trial · ${c.days_left}d`, bg: "#e0f2fe", color: "#0891b2" };
  };

  const getTxBadge = (status) => ({
    approved: { bg: "#dcfce7", color: "#16a34a" },
    pending:  { bg: "#fef9c3", color: "#a16207" },
    rejected: { bg: "#fee2e2", color: "#dc2626" },
  }[status] || { bg: "#f1f5f9", color: "#64748b" });

  const initials = (name) => (name || "SA").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .sa-dash * { font-family: 'DM Sans', sans-serif; }
        .sa-dash { background: #f0f2f8; min-height: 100vh; }

        .stat-card {
          background: #fff;
          border-radius: 16px;
          padding: 22px 20px;
          box-shadow: 0 2px 12px rgba(17,19,60,0.06);
          border: 1px solid rgba(17,19,60,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        .stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(17,19,60,0.12); }

        .panel {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(17,19,60,0.06);
          box-shadow: 0 2px 12px rgba(17,19,60,0.06);
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 22px;
          border-bottom: 1px solid #f1f4f9;
        }

        .view-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 600;
          color: #4f46e5;
          background: #eef2ff;
          border: none;
          border-radius: 8px;
          padding: 6px 12px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
        }
        .view-all-btn:hover { background: #e0e7ff; }

        .hero-card {
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
          border-radius: 20px;
          padding: 32px;
          color: #fff;
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .hero-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.05);
        }
        .hero-card::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 30%;
          width: 150px; height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 18px;
          border-radius: 12px;
          border: 1.5px solid #e8ebf4;
          background: #fff;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .quick-action:hover { border-color: #4f46e5; background: #f5f3ff; transform: translateX(3px); }

        .table-row { border-top: 1px solid #f1f4f9; transition: background 0.15s; }
        .table-row:hover { background: #fafbff; }

        .alert-dot { width: 8px; height: 8px; background: #ef4444; border-radius: 50%; animation: blink 1.5s infinite; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .activity-bar {
          height: 6px;
          border-radius: 3px;
          background: #e8ebf4;
          overflow: hidden;
        }
        .activity-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #4f46e5, #818cf8);
          transition: width 1s ease;
        }

        @media (max-width: 768px) {
          .hero-card { padding: 22px 18px; }
          .grid-4 { grid-template-columns: 1fr 1fr !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="d-flex sa-dash">
        <Sidebar />
        <PageContent>
          <div className="container-fluid py-4 px-3 px-md-4">

            {/* ══ HERO GREETING ══ */}
            <div className="hero-card">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", zIndex: 1 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Superadmin Control Panel
                  </div>
                  <h2 style={{ fontWeight: 800, fontSize: "clamp(20px,3vw,28px)", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
                    {getGreeting()}, {adminProfile.name.split(" ")[0] || "Admin"} 👋
                  </h2>
                  <p style={{ opacity: 0.7, fontSize: 14, margin: 0 }}>
                    Global oversight of all companies, trials &amp; payments.
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                    {trialStats.pending > 0 && (
                      <span onClick={() => navigate("/superadmin/trials")}
                        style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="alert-dot" style={{ background: "#fca5a5" }} />
                        {trialStats.pending} Trial Request{trialStats.pending > 1 ? "s" : ""} Pending
                      </span>
                    )}
                    {txPending > 0 && (
                      <span onClick={() => navigate("/transactions")}
                        style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.4)", color: "#fde68a", padding: "5px 13px", borderRadius: 20, fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                        <span className="alert-dot" style={{ background: "#fde68a" }} />
                        {txPending} Payment{txPending > 1 ? "s" : ""} Awaiting Approval
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                  {/* Mini profile */}
                  <div onClick={() => navigate("/super-admin")}
                    style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 14px", cursor: "pointer", backdropFilter: "blur(4px)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#818cf8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, overflow: "hidden", flexShrink: 0 }}>
                      {adminProfile.avatar && !avatarErr ? (
                        <img src={adminProfile.avatar} alt="avatar" onError={() => setAvatarErr(true)}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ color: "#fff" }}>{initials(adminProfile.name)}</span>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{adminProfile.name || "Super Admin"}</div>
                      <div style={{ fontSize: 11, opacity: 0.6 }}>{adminProfile.email}</div>
                    </div>
                  </div>
                  <button onClick={fetchAll}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <RefreshCw size={12} /> Refresh
                  </button>
                  <div style={{ fontSize: 11, opacity: 0.45 }}>
                    Updated {lastRefresh.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>

            {/* ══ STAT CARDS ══ */}
            <div className="grid-4 mb-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Total Companies",   val: globalStats.totalCompanies  || companies.length || 0, icon: <Building size={20} />,     color: "#4f46e5", bg: "#eef2ff", path: "/superadmin/companiespage" },
                { label: "Active Licenses",   val: globalStats.activeLicenses  || 0,                     icon: <Shield size={20} />,       color: "#16a34a", bg: "#dcfce7", path: "/superadmin/trials" },
                { label: "Total Users",       val: globalStats.totalUsers      || 0,                     icon: <Users size={20} />,        color: "#0891b2", bg: "#e0f2fe", path: "/superadmin/trials" },
                { label: "System Alerts",     val: (trialStats.pending + txPending) || globalStats.systemAlerts || 0, icon: <Bell size={20} />, color: "#dc2626", bg: "#fee2e2", path: "/superadmin/trials" },
              ].map((s, i) => (
                <div key={i} className="stat-card" onClick={() => navigate(s.path)}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 14 }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b", lineHeight: 1, marginBottom: 4 }}>
                    {loading ? "—" : s.val}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* ══ TRIAL HEALTH + QUICK ACTIONS ══ */}
            <div className="grid-2 mb-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

              {/* Trial Health */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Activity size={16} color="#4f46e5" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Trial Health</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Across all companies</div>
                    </div>
                  </div>
                  <button className="view-all-btn" onClick={() => navigate("/superadmin/trials")}>
                    View All <ArrowRight size={11} />
                  </button>
                </div>
                <div style={{ padding: "18px 22px" }}>
                  {[
                    { label: "On Trial",   val: trialStats.onTrial,   color: "#0891b2", total: companies.length || 1 },
                    { label: "Expired",    val: trialStats.expired,   color: "#dc2626", total: companies.length || 1 },
                    { label: "Suspended",  val: trialStats.suspended, color: "#64748b", total: companies.length || 1 },
                    { label: "Pending Requests", val: trialStats.pending, color: "#f59e0b", total: Math.max(trialStats.pending, 1) },
                  ].map((item) => (
                    <div key={item.label} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: item.color }}>{item.val}</span>
                      </div>
                      <div className="activity-bar">
                        <div className="activity-fill" style={{ width: `${Math.min(100, (item.val / item.total) * 100)}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TrendingUp size={16} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Quick Actions</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Navigate to key pages</div>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: <Shield size={16} color="#4f46e5" />,    bg: "#eef2ff",  label: "Trial Management",  sub: "Manage trials & requests",       path: "/superadmin/trials" },
                    { icon: <CreditCard size={16} color="#16a34a" />, bg: "#dcfce7",  label: "Transactions",     sub: "Approve payments",                path: "/transactions" },
                    { icon: <Building size={16} color="#0891b2" />,   bg: "#e0f2fe",  label: "Companies",        sub: "View all companies",              path: "/superadmin/companiespage" },
                    { icon: <Users size={16} color="#f59e0b" />,      bg: "#fffbeb",  label: "Pricing Plans",    sub: "Manage subscription plans",       path: "/superadmin/pricing" },
                    { icon: <Settings size={16} color="#64748b" />,   bg: "#f1f5f9",  label: "Website Settings", sub: "Edit public pages",               path: "/superadmin/website-settings" },
                  ].map((a) => (
                    <div key={a.label} className="quick-action" onClick={() => navigate(a.path)}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {a.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{a.label}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.sub}</div>
                      </div>
                      <ArrowRight size={14} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ TRIAL COMPANIES TABLE + PENDING REQUESTS ══ */}
            <div className="grid-2 mb-4" style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 20, marginBottom: 24 }}>

              {/* Trial Companies */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#e0f2fe", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={16} color="#0891b2" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Trial Companies</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Most recent · top 5</div>
                    </div>
                  </div>
                  <button className="view-all-btn" onClick={() => navigate("/superadmin/trials")}>
                    Manage <ArrowRight size={11} />
                  </button>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        <th style={{ padding: "10px 22px", textAlign: "left", background: "#f8fafc" }}>Company</th>
                        <th style={{ padding: "10px 16px", textAlign: "left", background: "#f8fafc" }}>Ends</th>
                        <th style={{ padding: "10px 16px", textAlign: "left", background: "#f8fafc" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="3" style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>Loading…</td></tr>
                      ) : trialData.companies.length === 0 ? (
                        <tr><td colSpan="3" style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>No companies yet</td></tr>
                      ) : trialData.companies.map((c) => {
                        const badge = getTrialBadge(c);
                        return (
                          <tr key={c.company_id} className="table-row">
                            <td style={{ padding: "13px 22px" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b" }}>{c.company_name}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.admin_email || "—"}</div>
                            </td>
                            <td style={{ padding: "13px 16px", fontSize: 12, color: "#64748b" }}>{fmtDate(c.trial_end)}</td>
                            <td style={{ padding: "13px 16px" }}>
                              <span style={{ background: badge.bg, color: badge.color, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                                {badge.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pending Extension Requests */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Bell size={16} color="#f59e0b" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
                        Requests
                        {trialStats.pending > 0 && (
                          <span style={{ marginLeft: 6, background: "#ef4444", color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>
                            {trialStats.pending}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Pending only</div>
                    </div>
                  </div>
                  <button className="view-all-btn" onClick={() => navigate("/superadmin/trials")}>
                    <Eye size={11} />
                  </button>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: 20, color: "#94a3b8", fontSize: 13 }}>Loading…</div>
                  ) : trialData.requests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 24 }}>
                      <CheckCircle2 size={32} color="#bbf7d0" style={{ marginBottom: 8 }} />
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>All clear! No pending requests.</div>
                    </div>
                  ) : trialData.requests.map((r) => (
                    <div key={r.request_id} style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "12px 14px", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#1e293b", marginBottom: 2 }}>{r.company_name}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>
                        By <strong>{r.requester_name}</strong> · {r.days_requested} days
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{fmtDT(r.created_at)}</div>
                      <button onClick={() => navigate("/superadmin/trials")}
                        style={{ marginTop: 8, width: "100%", padding: "6px 0", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Review →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ RECENT TRANSACTIONS + COMPANY TABLE ══ */}
            <div className="grid-2 mb-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

              {/* Recent Transactions */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CreditCard size={16} color="#16a34a" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>
                        Recent Transactions
                        {txPending > 0 && (
                          <span style={{ marginLeft: 6, background: "#fef9c3", color: "#a16207", borderRadius: 20, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>
                            {txPending} pending
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Last 5 transactions</div>
                    </div>
                  </div>
                  <button className="view-all-btn" onClick={() => navigate("/transactions")}>
                    View All <ArrowRight size={11} />
                  </button>
                </div>
                <div>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>Loading…</div>
                  ) : transactions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>💳</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>No transactions yet</div>
                    </div>
                  ) : transactions.map((tx, i) => {
                    const badge = getTxBadge(tx.status);
                    return (
                      <div key={tx.transaction_id || i} className="table-row" style={{ padding: "13px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {tx.company_name || "—"}
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{tx.plan_name || "—"} · {fmtDate(tx.payment_date)}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>{fmtAmount(tx.amount)}</div>
                          <span style={{ background: badge.bg, color: badge.color, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Company Management */}
              <div className="panel">
                <div className="panel-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building size={16} color="#475569" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Companies</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>Recently registered</div>
                    </div>
                  </div>
                  <button className="view-all-btn" onClick={() => navigate("/superadmin/companiespage")}>
                    View All <ArrowRight size={11} />
                  </button>
                </div>
                <div>
                  {loading ? (
                    <div style={{ textAlign: "center", padding: 30, color: "#94a3b8", fontSize: 13 }}>Loading…</div>
                  ) : companies.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
                      <div style={{ fontSize: 13, color: "#94a3b8" }}>No companies yet</div>
                    </div>
                  ) : companies.slice(0, 5).map((c) => (
                    <div key={c.company_id} className="table-row" style={{ padding: "13px 22px", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eef2ff", color: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                        {(c.company_name || "?").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.company_name}</div>
                        <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.pricing_plan || "Trial"} · {fmtDate(c.created_at)}</div>
                      </div>
                      <span style={{ background: "#dcfce7", color: "#16a34a", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══ BOTTOM: PROFILE SNIPPET + STATS SUMMARY ══ */}
            <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

              {/* Profile Card */}
              <div className="panel" style={{ cursor: "pointer" }} onClick={() => navigate("/super-admin")}>
                <div style={{ background: "linear-gradient(135deg,#1e1b4b,#4338ca)", padding: "24px 22px", textAlign: "center" }}>
                  <div style={{ width: 60, height: 60, borderRadius: 16, background: "#818cf8", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22, color: "#fff", border: "3px solid rgba(255,255,255,0.2)", overflow: "hidden" }}>
                    {adminProfile.avatar && !avatarErr ? (
                      <img src={adminProfile.avatar} alt="avatar" onError={() => setAvatarErr(true)}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 13 }} />
                    ) : (
                      initials(adminProfile.name)
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{adminProfile.name || "Super Admin"}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{adminProfile.email}</div>
                  <span style={{ display: "inline-block", marginTop: 8, background: "rgba(255,255,255,0.15)", color: "#c7d2fe", padding: "3px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    <Shield size={10} style={{ marginRight: 4 }} />Super Admin
                  </span>
                </div>
                <div style={{ padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#4f46e5", fontSize: 13, fontWeight: 600 }}>
                  <Eye size={14} /> View &amp; Edit Profile
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="panel">
                <div className="panel-header" style={{ borderBottom: "1px solid #f1f4f9" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Payment Summary</div>
                  <button className="view-all-btn" onClick={() => navigate("/transactions")}><ArrowRight size={11} /></button>
                </div>
                <div style={{ padding: "16px 22px" }}>
                  {[
                    { label: "Total",    val: transactions.length,  color: "#4f46e5" },
                    { label: "Approved", val: txApproved,           color: "#16a34a" },
                    { label: "Pending",  val: txPending,            color: "#f59e0b" },
                    { label: "Rejected", val: transactions.filter(t => t.status === "rejected").length, color: "#dc2626" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</span>
                    </div>
                  ))}
                  <button onClick={() => navigate("/transactions")}
                    style={{ width: "100%", marginTop: 4, padding: "9px 0", background: "#1e293b", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Go to Transactions →
                  </button>
                </div>
              </div>

              {/* Trial Summary */}
              <div className="panel">
                <div className="panel-header" style={{ borderBottom: "1px solid #f1f4f9" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b" }}>Trial Summary</div>
                  <button className="view-all-btn" onClick={() => navigate("/superadmin/trials")}><ArrowRight size={11} /></button>
                </div>
                <div style={{ padding: "16px 22px" }}>
                  {[
                    { label: "On Trial",    val: trialStats.onTrial,   color: "#0891b2" },
                    { label: "Expired",     val: trialStats.expired,   color: "#dc2626" },
                    { label: "Suspended",   val: trialStats.suspended, color: "#64748b" },
                    { label: "Requests",    val: trialStats.pending,   color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{s.label}</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.val}</span>
                    </div>
                  ))}
                  <button onClick={() => navigate("/superadmin/trials")}
                    style={{ width: "100%", marginTop: 4, padding: "9px 0", background: "#4f46e5", color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Manage Trials →
                  </button>
                </div>
              </div>

            </div>

          </div>
        </PageContent>
      </div>
    </>
  );
};

export default SuperadminDashboardPage;
