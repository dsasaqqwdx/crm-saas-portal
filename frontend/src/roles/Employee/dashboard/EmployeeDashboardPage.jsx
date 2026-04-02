
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import {
  Clock, Calendar, FileText, Star, ArrowRight, UserCheck,
  Coffee, Mail, Building2, CalendarDays, LogIn, LogOut as LogOutIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatbotWidget from "../../../components/ChatbotWidget";
import "../../../App.css";
import TrialBanner from "../../../components/TrialBanner";
import TrialWidget from "../../../components/TrialWidget";
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const isAdminSelfView = () => {
  const role       = localStorage.getItem("role");
  const activeRole = localStorage.getItem("activeRole");
  return role === "company_admin" && activeRole === "self";
};

const fmtTime = (t) => {
  if (!t || t === "Not Available") return null;
  const [h, m] = t.split(":");
  const hr     = parseInt(h, 10);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
};

const totalWorkedMins = (sessions) =>
  (sessions || []).reduce((acc, s) => acc + (s.duration_mins || 0), 0);

const fmtDuration = (mins) => {
  if (!mins || mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const EmployeeDashboard = ({ selfView }) => {
  const navigate = useNavigate();
  const selfMode = selfView || isAdminSelfView();

  const [statsData, setStatsData] = useState({
    attendanceToday: "Loading...", leaveBalance: "12 Days",
    upcomingHolidays: "0", payslipsCount: "0",
  });
  const [profile, setProfile] = useState({
    name: "", employee_id: "", email: "", employment_type: "",
    designation: "", department: "", reporting_manager: "", avatar: null,
  });
  const [holidays, setHolidays] = useState([]);
  const [leaves,   setLeaves]   = useState([]);
  const [letters,  setLetters]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [avatarErr, setAvatarErr] = useState(false);

  // ── Session-based attendance (same structure as MarkAttendancePage) ──
  const [sessions,       setSessions]       = useState([]);
  const [hasOpenSession, setHasOpenSession] = useState(false);
  const [attLoading,     setAttLoading]     = useState(false);
  const [attError,       setAttError]       = useState("");
  const [attSuccess,     setAttSuccess]     = useState("");

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const nextHoliday = holidays
    ?.filter((h) => new Date(h.holiday_date) >= todayDate)
    ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

  const daysLeft = nextHoliday &&
    Math.ceil((new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - todayDate) / (1000 * 60 * 60 * 24));

  // Derived attendance values
  const canCheckIn    = !hasOpenSession;
  const canCheckOut   = hasOpenSession;
  const workedMins    = totalWorkedMins(sessions);
  const latestSession = sessions[sessions.length - 1] || null;
  const lastCheckIn   = latestSession?.check_in || null;
  const lastCheckOut  = sessions.filter(s => s.check_out).slice(-1)[0]?.check_out || null;

  // ── Fetch today attendance — matches MarkAttendancePage response shape ──
  const fetchAttendance = useCallback(async () => {
    try {
      const token   = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const res     = await axios.get(`${API}/api/attendance/today`, { headers });
      const d       = res.data;
      if (d.marked) {
        setSessions(d.sessions || []);
        setHasOpenSession(d.hasOpenSession || false);
      } else {
        setSessions([]);
        setHasOpenSession(false);
      }
    } catch { /* ignore */ }
  }, []);

 
  const handleMark = async () => {
    setAttLoading(true);
    setAttError("");
    setAttSuccess("");
    try {
      const token   = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const res     = await axios.post(
        `${API}/api/attendance/mark`,
        { status: "present" },
        { headers }
      );
      if (res.data.success) {
        setAttSuccess(`✓ ${hasOpenSession ? "Checked out" : "Checked in"} successfully!`);
        await fetchAttendance();
        setTimeout(() => setAttSuccess(""), 3000);
      } else {
        setAttError(res.data.message || res.data.msg || "Something went wrong.");
      }
    } catch (err) {
      setAttError(err?.response?.data?.message || err?.response?.data?.msg || "Failed. Try again.");
    } finally {
      setAttLoading(false);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      const token   = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const summaryUrl = selfMode
        ? `${API}/api/dashboard/summary?mode=self`
        : `${API}/api/dashboard/summary`;

      const [summaryRes, profileRes, holidayRes, leaveRes, letterRes] = await Promise.all([
        axios.get(summaryUrl,                      { headers }),
        axios.get(`${API}/api/employees/profile`,  { headers }),
        axios.get(`${API}/api/holidays`,           { headers }),
        axios.get(`${API}/api/leaves`,             { headers }),
        axios.get(`${API}/api/letters/my-letters`, { headers }),
      ]);

      const s = summaryRes.data.data;
      setStatsData({
        attendanceToday:  s.attendanceToday  || "Not Marked",
        leaveBalance:     `${s.leaveBalance ?? 12} Days`,
        upcomingHolidays: String(s.upcomingHolidays || 0),
        payslipsCount:    String(s.payslipsCount    || 0),
      });

      const d = profileRes.data.data || {};
      setProfile({
        name:              d.name              || "Employee",
        employee_id:       d.employee_id       || "--",
        email:             d.email             || "Not Available",
        employment_type:   d.employment_type   || "Not Specified",
        designation:       d.designation_name  || d.designation_id || "Not Assigned",
        department:        d.department_name   || d.department_id  || "Not Assigned",
        reporting_manager: d.reporting_manager || "No Manager Assigned",
        avatar:            d.avatar            || null,
      });
      setAvatarErr(false);

      setHolidays(holidayRes.data.data || []);
      setLeaves(leaveRes.data.data     || []);
      setLetters(letterRes.data.data   || []);

      await fetchAttendance();
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selfMode, fetchAttendance]);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const stats = [
    { title: "Attendance",    val: statsData.attendanceToday,  icon: <Clock    size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/attendance" },
    { title: "Leave Balance", val: statsData.leaveBalance,     icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: selfMode ? "/employee/leaves" : "/leaves" },
    { title: "Holidays",      val: statsData.upcomingHolidays, icon: <Star     size={22} />, color: "#f59e0b", bg: "#fffbeb", link: selfMode ? "/employee/holidays" : "/holidays" },
    { title: "Payslips",      val: statsData.payslipsCount,    icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" },
  ];

  if (loading) {
    return (
      <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
          <p className="text-muted fw-bold">Syncing your workspace...</p>
        </div>
      </div>
    );
  }

  const showAvatar = profile.avatar && !avatarErr;

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid px-3 px-md-4 py-4">

          {selfMode && (
            <div className="alert d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 border-0"
              style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "0.85rem" }}>
              <UserCheck size={16} />
              <span>Viewing your <strong>personal employee profile</strong>. Switch to <strong>Manager</strong> tab to return to admin view.</span>
            </div>
          )}
<TrialBanner />
<TrialWidget />
          <div className="row mb-4">
            <div className="col-12">
              <div className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm" style={{ background: "#eef2ff" }}>
                <div className="row align-items-center">

                  
                  <div className="col-12 col-lg-8">
                    <div className="mb-3 text-center text-lg-start">
                      <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                        Welcome back, {localStorage.getItem("name") || profile.name} 👋
                      </h2>
                      <p className="fw-semibold" style={{ color: "#475569" }}>Here's a quick overview of your profile and performance for today.</p>
                    </div>
                    <div className="row mt-4">
                      {[
                        { icon: <Mail size={16} color="#6366f1" />,         text: profile.email },
                        { icon: <UserCheck size={16} color="#6366f1" />,    text: `Employee ID: ${profile.employee_id}` },
                        { icon: <Building2 size={16} color="#6366f1" />,    text: profile.department },
                        { icon: <FileText size={16} color="#6366f1" />,     text: profile.designation },
                        { icon: <UserCheck size={16} color="#6366f1" />,    text: `Manager: ${profile.reporting_manager}` },
                        { icon: <CalendarDays size={16} color="#6366f1" />, text: profile.employment_type },
                      ].map((item, i) => (
                        <div key={i} className="col-12 col-md-6 mb-3">
                          <div className="d-flex align-items-start gap-2">
                            <span className="mt-1 flex-shrink-0">{item.icon}</span>
                            <span style={{ color: "#334155", fontSize: "0.9rem" }}>{item.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                  <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">
                    <div style={{ display: "inline-block", marginBottom: "8px" }}>
                      {showAvatar ? (
                        <img src={profile.avatar} alt="profile" onError={() => setAvatarErr(true)}
                          style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover",
                            boxShadow: "0 10px 25px rgba(99,102,241,0.3)", border: "4px solid #fff",
                            outline: "2px solid rgba(99,102,241,0.2)" }} />
                      ) : (
                        <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
                          style={{ width: "90px", height: "90px", fontSize: "32px", background: "#6366f1",
                            boxShadow: "0 10px 25px rgba(99,102,241,0.3)", border: "4px solid #fff" }}>
                          {(localStorage.getItem("name") || profile.name || "E").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{localStorage.getItem("name") || profile.name}</h5>
                    <small style={{ color: "#64748b" }}>{selfMode ? "Viewing as Employee" : "Employee"}</small>

                    
                    <div className="mt-3 p-3 rounded-4 shadow-sm bg-white border text-start">
                      <h6 className="fw-bold mb-3 text-center text-muted" style={{ fontSize: "0.78rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        Today's Attendance
                        {workedMins > 0 && (
                          <span className="ms-2 badge rounded-pill" style={{ background: "#eef2ff", color: "#6366f1", fontSize: "0.7rem" }}>
                            {fmtDuration(workedMins)} worked
                          </span>
                        )}
                      </h6>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={14} color="#10b981" /><span className="small fw-semibold">Last Check In</span>
                        </div>
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background: lastCheckIn ? "#dcfce7" : "#f1f5f9", color: lastCheckIn ? "#15803d" : "#94a3b8", fontSize: "0.72rem" }}>
                          {fmtTime(lastCheckIn) || "Not Marked"}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={14} color="#ef4444" /><span className="small fw-semibold">Last Check Out</span>
                        </div>
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background: lastCheckOut ? "#fee2e2" : "#f1f5f9", color: lastCheckOut ? "#dc2626" : "#94a3b8", fontSize: "0.72rem" }}>
                          {fmtTime(lastCheckOut) || "Not Marked"}
                        </span>
                      </div>

                      {sessions.length > 0 && (
                        <div className="text-center mb-2">
                          <span className="badge rounded-pill px-3 py-1" style={{ background: "#f8fafc", color: "#64748b", fontSize: "0.7rem" }}>
                            {sessions.length} session{sessions.length > 1 ? "s" : ""} today
                          </span>
                        </div>
                      )}

                      {hasOpenSession && (
                        <div className="text-center mb-2">
                          <span className="badge rounded-pill px-3 py-1" style={{ background: "#f0fdf4", color: "#15803d", fontSize: "0.7rem" }}>
                            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#22c55e", marginRight: 5 }} />
                            Currently working
                          </span>
                        </div>
                      )}

                      {attSuccess && (
                        <div className="rounded-3 px-2 py-1 mb-2 text-center" style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.75rem", fontWeight: 600 }}>
                          {attSuccess}
                        </div>
                      )}
                      {attError && (
                        <div className="rounded-3 px-2 py-1 mb-2 text-center" style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.75rem", fontWeight: 600 }}>
                          {attError}
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <button className="btn flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold"
                          disabled={!canCheckIn || attLoading} onClick={handleMark}
                          style={{ background: canCheckIn ? "#6366f1" : "#f1f5f9", color: canCheckIn ? "#fff" : "#94a3b8",
                            border: "none", borderRadius: "10px", fontSize: "0.8rem", padding: "8px 0",
                            cursor: canCheckIn ? "pointer" : "not-allowed", opacity: canCheckIn ? 1 : 0.55 }}>
                          {attLoading && canCheckIn ? <span className="spinner-border spinner-border-sm" /> : <><LogIn size={13} /> Check In</>}
                        </button>
                        <button className="btn flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold"
                          disabled={!canCheckOut || attLoading} onClick={handleMark}
                          style={{ background: canCheckOut ? "#ef4444" : "#f1f5f9", color: canCheckOut ? "#fff" : "#94a3b8",
                            border: "none", borderRadius: "10px", fontSize: "0.8rem", padding: "8px 0",
                            cursor: canCheckOut ? "pointer" : "not-allowed", opacity: canCheckOut ? 1 : 0.55 }}>
                          {attLoading && canCheckOut ? <span className="spinner-border spinner-border-sm" /> : <><LogOutIcon size={13} /> Check Out</>}
                        </button>
                      </div>

                      <div className="text-center mt-2">
                        <a href="/attendance" style={{ fontSize: "0.72rem", color: "#6366f1", textDecoration: "none" }}>
                          View full attendance page →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="row g-3 mb-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-12 col-sm-6 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
                  onClick={() => navigate(stat.link)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                  <div className="card-body d-flex align-items-center">
                    <div className="rounded-3 d-flex align-items-center justify-content-center me-3"
                      style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
                      <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          
          {nextHoliday && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                  <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>Upcoming Holiday</span>
                  <h5 className="fw-bold fs-2">{nextHoliday.description?.charAt(0).toUpperCase() + nextHoliday.description?.slice(1)}</h5>
                  <div className="d-flex align-items-center gap-3 mt-2" style={{ fontSize: "0.9rem" }}>
                    <span><Clock size={14} className="me-1" />{new Date(nextHoliday.holiday_date).toLocaleDateString()}</span>
                    <span className="fw-bold">{daysLeft} days left</span>
                  </div>
                  <CalendarDays size={80} className="position-absolute opacity-25"
                    style={{ right: "-10px", bottom: "-10px", transform: "rotate(-15deg)" }} />
                </div>
              </div>
            </div>
          )}

          
          <div className="row g-4 mb-4">
            <div className="col-12 col-lg-8">
              <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <UserCheck size={20} className="text-primary" /> Quick Actions
                </h5>
                <div className="row g-3">
                  {[
                    { label: "Attendance",    icon: <Clock    className="text-success" size={20} />, path: "/attendance" },
                    { label: "Request Leave", icon: <Calendar className="text-primary" size={20} />, path: selfMode ? "/employee/leaves" : "/leaves" },
                    { label: "My Letters",    icon: <FileText className="text-info"    size={20} />, path: "/employee/my-letters" },
                  ].map((btn) => (
                    <div key={btn.label} className="col-6 col-md-4">
                      <button className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
                        onClick={() => navigate(btn.path)} style={{ background: "#f8fafc" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                        onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}>
                        {btn.icon}<span className="small fw-bold">{btn.label}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden"
                style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}>
                <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.15 }}><Coffee size={120} /></div>
                <h5 className="fw-bold mb-3">Holiday Spirit</h5>
                <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
                <button className="btn btn-sm fw-bold rounded-pill px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
                  onClick={() => navigate(selfMode ? "/employee/holidays" : "/holidays")}>
                  View Calendar <ArrowRight size={14} className="ms-1" />
                </button>
              </div>
            </div>
          </div>

          
          <div className="row g-4">
            <div className="col-12 col-lg-6">
              <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold d-flex align-items-center gap-2 mb-0"><Mail size={18} className="text-primary" /> My Letters</h5>
                  <span className="badge bg-primary-subtle text-primary">{letters?.length || 0}</span>
                </div>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="table align-middle table-hover">
                    <thead className="table-light sticky-top"><tr><th>Letter</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {letters?.length > 0 ? letters.map((l) => (
                        <tr key={l.id}>
                          <td className="fw-semibold text-capitalize">{l.letter_type}</td>
                          <td><span className="badge bg-success-subtle text-success">{l.status === "sent" ? "Received" : l.status}</span></td>
                          <td className="text-muted small">{new Date(l.created_at).toLocaleDateString()}</td>
                        </tr>
                      )) : <tr><td colSpan="3" className="text-center text-muted py-4">No letters found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold d-flex align-items-center gap-2 mb-0"><Calendar size={18} className="text-success" /> My Leaves</h5>
                  <span className="badge bg-success-subtle text-success">{leaves?.length || 0}</span>
                </div>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  <table className="table align-middle table-hover">
                    <thead className="table-light sticky-top"><tr><th>Type</th><th>Duration</th><th>Status</th></tr></thead>
                    <tbody>
                      {leaves?.length > 0 ? leaves.map((l) => (
                        <tr key={l.leave_id}>
                          <td className="fw-semibold">{l.leave_type}</td>
                          <td className="small">
                            {new Date(l.start_date).toLocaleDateString()}
                            <br /><span className="text-muted">to {new Date(l.end_date).toLocaleDateString()}</span>
                          </td>
                          <td>
                            <span className={`badge ${l.status === "Approved" ? "bg-success-subtle text-success" : l.status === "Rejected" ? "bg-danger-subtle text-danger" : "bg-warning-subtle text-warning"}`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      )) : <tr><td colSpan="3" className="text-center text-muted py-4">No leave records</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </PageContent>
      <ChatbotWidget />
      <style>{`
        .hover-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default EmployeeDashboard;