
import React, { useState, useEffect, useCallback } from "react";
import { Users, Building2, CheckCircle, CalendarRange, Check, XCircle, AlertCircle, Download, CalendarDays, Clock, Trash2, Info, MapPin, Phone, Mail, LogIn, LogOut as LogOutIcon } from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import Api from "../../../api/api";
import TrialBanner from "../../../components/TrialBanner";
import TrialWidget from "../../../components/TrialWidget";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hr = parseInt(h, 10);
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

const Dashboard = () => {
  const [statsData, setStatsData] = useState({});
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [payrollData, setPayrollData] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [adminName, setAdminName] = useState("Admin");
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [search] = useState("");
  const [toast, setToast] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", department: "",
    role: "Admin", joined: "", avatar: "",
  });
  const [avatarError, setAvatarError] = useState(false);
  const [sessions,        setSessions]        = useState([]);
  const [hasOpenSession,  setHasOpenSession]  = useState(false);
  const [attMarked,       setAttMarked]       = useState(false);
  const [attLoading,      setAttLoading]      = useState(false);
  const [attError,        setAttError]        = useState("");
  const [attSuccess,      setAttSuccess]      = useState("");

  const role    = localStorage.getItem("role");
  const isAdmin = role === "company_admin" || role === "super_admin";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fmtAmount = (a) => "₹" + Number(a).toLocaleString("en-IN");
  const fmtDate   = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const nextHoliday = holidays
    ?.filter((h) => new Date(h.holiday_date) >= today)
    ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

  const filtered = departments.filter((d) =>
    d.department_name.toLowerCase().includes(search.toLowerCase())
  );

  const daysLeft = nextHoliday &&
    Math.ceil((new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - today) / (1000 * 60 * 60 * 24));

  const deleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to remove this role?")) {
      try {
        await axios.delete(`${API}/api/designations/${id}`);
        fetchAllData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete designation");
      }
    }
  };

  const getBadgeStyle = (status) => ({
    padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
    backgroundColor: status === "Present" ? "#dcfce7" : "#fef3c7",
    color: status === "Present" ? "#15803d" : "#b45309",
  });

  const STATUS_STYLE = {
    approved: { bg: "#dcfce7", text: "#16a34a" },
    pending:  { bg: "#fef9c3", text: "#a16207" },
    rejected: { bg: "#fee2e2", text: "#dc2626" },
  };

  const getStatusBadge = (status) => {
    const configs = {
      Approved: { bg: "#dcfce7", color: "#16a34a", icon: <Check size={12} /> },
      Rejected: { bg: "#fee2e2", color: "#ef4444", icon: <XCircle size={12} /> },
      Pending:  { bg: "#fef3c7", color: "#d97706", icon: <AlertCircle size={12} /> },
    };
    const style = configs[status] || configs.Pending;
    return (
      <span className="badge d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2"
        style={{ backgroundColor: style.bg, color: style.color, fontSize: "12px", fontWeight: "600" }}>
        {style.icon} {status}
      </span>
    );
  };
  const fetchTodayAttendance = useCallback(async () => {
    try {
      const token   = localStorage.getItem("token");
      const headers = { "x-auth-token": token };
      const res     = await axios.get(`${API}/api/attendance/today`, { headers });
      const d       = res.data;

      if (d.marked) {
        setAttMarked(true);
        setSessions(d.sessions || []);
        setHasOpenSession(d.hasOpenSession || false);
      } else {
        setAttMarked(false);
        setSessions([]);
        setHasOpenSession(false);
      }
    } catch (err) {
      console.error("attendance fetch error", err);
    }
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
        { status: "present" },   // same payload as MarkAttendancePage
        { headers }
      );
      if (res.data.success) {
        const action = hasOpenSession ? "Checked out" : "Checked in";
        setAttSuccess(`✓ ${action} successfully!`);
        await fetchTodayAttendance();
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
  const canCheckIn  = !hasOpenSession;
  const canCheckOut = hasOpenSession;
  const workedMins  = totalWorkedMins(sessions);
  const latestSession   = sessions[sessions.length - 1] || null;
  const lastCheckIn     = latestSession?.check_in  || null;
  const lastCheckOut    = sessions.filter(s => s.check_out).slice(-1)[0]?.check_out || null;

  useEffect(() => { fetchAllData(); }, []);

  const fetchAllData = async () => {
    try {
      const token   = localStorage.getItem("token");
      const headers = { "x-auth-token": token };

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.name) setAdminName(payload.name.split(" ")[0]);
      } catch {}

      const [
        summary, employeeList, attendanceList, holidayList, leavesList,
        payrollList, departmentList, designationList, ticketList, paymentList, profileRes,
      ] = await Promise.all([
        axios.get(`${API}/api/dashboard/summary`,   { headers }),
        axios.get(`${API}/api/employees`,            { headers }),
        Api.get("/attendance/all"),
        axios.get(`${API}/api/holidays`,             { headers }),
        axios.get(`${API}/api/leaves`,               { headers }),
        axios.get(`${API}/api/payroll`,              { headers }),
        axios.get(`${API}/api/departments`,          { headers }),
        axios.get(`${API}/api/designations`,         { headers }),
        axios.get(`${API}/api/support`,              { headers }),
        axios.get(`${API}/api/transactions/my`,      { headers }),
        axios.get(`${API}/api/admin/profile`,        { headers }),
      ]);

      setStatsData(summary.data?.data        || {});
      setEmployees(employeeList.data?.data   || []);
      setAttendance(attendanceList.data      || []);
      setHolidays(holidayList.data?.data     || []);
      setLeaveRequests(leavesList.data?.data || []);
      setPayrollData(payrollList.data?.data  || []);
      setDepartments(departmentList.data.data|| []);
      setDesignations(designationList.data   || []);
      setTickets(ticketList.data?.data);
      setTransactions(paymentList.data?.data || []);

      const d = profileRes.data.data || {};
      setProfile({
        name:       d.name       || "",
        email:      d.email      || "",
        phone:      d.phone      || "",
        department: d.department || "Administration",
        role:       d.role       || "Admin",
        joined:     d.joined_at  || d.created_at || "",
        avatar:     d.avatar     || "",
      });
      setAvatarError(false);

      await fetchTodayAttendance();
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { title: "Total Employees", value: statsData.totalEmployees, icon: Users,         color: "#6366f1", bg: "#eef2ff" },
    { title: "Present Today",   value: statsData.presentToday,   icon: CheckCircle,   color: "#10b981", bg: "#ecfdf5" },
    { title: "Pending Leaves",  value: statsData.pendingLeaves,  icon: CalendarRange, color: "#f59e0b", bg: "#fffbeb" },
    { title: "Companies",       value: statsData.totalCompanies, icon: Building2,     color: "#3b82f6", bg: "#eff6ff" },
  ];

  const palette = [
    { bg: "#eef2ff", color: "#6366f1" }, { bg: "#ecfdf5", color: "#10b981" },
    { bg: "#fffbeb", color: "#f59e0b" }, { bg: "#fdf4ff", color: "#d946ef" },
    { bg: "#eff6ff", color: "#3b82f6" }, { bg: "#fef2f2", color: "#ef4444" },
  ];

  const handleDownload = async (payrollId, employeeName) => {
    if (!payrollId) return;
    try {
      const token = localStorage.getItem("token");
      const res   = await axios.get(`${API}/api/payroll/download/${payrollId}`, { headers: { "x-auth-token": token } });
      const data  = res.data.data;
      const content = `\nPAYSLIP\nEmployee : ${data.name}\nEmployee ID : EMP-${data.employee_id}\nPay Date : ${new Date(data.pay_date).toLocaleDateString()}\nNet Salary : ₹${data.net_salary}\n`;
      const element = document.createElement("a");
      const file    = new Blob([content], { type: "text/plain" });
      element.href  = URL.createObjectURL(file);
      element.download = `Payslip_${employeeName}.txt`;
      document.body.appendChild(element);
      element.click();
    } catch { alert("Download failed"); }
  };

  const cardStyle = { height: "450px", display: "flex", flexDirection: "column" };

  // ── Avatar component ──
  const AdminAvatar = ({ size = 110, fontSize = 40 }) => {
    const showImage = profile.avatar && !avatarError;
    return (
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: showImage ? "transparent" : "#6366f1",
        boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "4px solid #fff",
      }}>
        {showImage ? (
          <img
            src={profile.avatar}
            alt={profile.name || "Admin"}
            onError={() => setAvatarError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize, fontWeight: 700, color: "#fff", userSelect: "none" }}>
            {profile.name?.charAt(0)?.toUpperCase() || "A"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar />
      <PageContent>
        <div className="container-fluid py-4 px-4">
          <div className="row mb-4">
            <div className="col-12">
              <div className="p-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden" style={{ background: "#eef2ff" }}>
                <div className="row align-items-center">
<TrialBanner />
<TrialWidget />
                  <div className="col-lg-8">
                    <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                      {getTimeGreeting()}, {profile.name || adminName} 👋
                    </h2>
                    <p style={{ color: "#475569" }}>Welcome back! Here is your company overview.</p>
                    <div className="row g-3 mt-2">
                      {[
                        { icon: <Mail size={16} color="#6366f1" />,        text: profile.email },
                        { icon: <Phone size={16} color="#6366f1" />,       text: profile.phone || "Not available" },
                        { icon: <Building2 size={16} color="#6366f1" />,   text: profile.department },
                        { icon: <MapPin size={16} color="#6366f1" />,      text: profile.address || "Not available" },
                        { icon: <CalendarDays size={16} color="#6366f1" />,text: `Joined: ${profile.joined ? new Date(profile.joined).toLocaleDateString() : "-"}` },
                      ].map((item, i) => (
                        <div key={i} className="col-md-6">
                          <div className="d-flex align-items-center gap-2" style={{ color: "#334155" }}>
                            {item.icon}<span>{item.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: avatar + attendance */}
                  <div className="col-lg-4 text-center mt-4 mt-lg-0">
                    <div className="d-flex justify-content-center">
                      <AdminAvatar size={100} fontSize={36} />
                    </div>
                    <h4 className="mt-3 mb-0" style={{ color: "#1e293b" }}>{profile.name}</h4>
                    <small style={{ color: "#64748b" }}>{profile.role}</small>

                    {/* ── Attendance card ── */}
                    <div className="mt-3 p-3 rounded-4 bg-white border text-start" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                      <h6 className="fw-bold mb-3 text-center text-muted" style={{ fontSize: "0.78rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        Today's Attendance
                        {workedMins > 0 && (
                          <span className="ms-2 badge rounded-pill" style={{ background: "#eef2ff", color: "#6366f1", fontSize: "0.7rem" }}>
                            {fmtDuration(workedMins)} worked
                          </span>
                        )}
                      </h6>

                      {/* Latest check-in */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={14} color="#10b981" />
                          <span className="small fw-semibold">Last Check In</span>
                        </div>
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background: lastCheckIn ? "#dcfce7" : "#f1f5f9", color: lastCheckIn ? "#15803d" : "#94a3b8", fontSize: "0.72rem" }}>
                          {fmtTime(lastCheckIn) || "Not Marked"}
                        </span>
                      </div>

                      {/* Latest check-out */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={14} color="#ef4444" />
                          <span className="small fw-semibold">Last Check Out</span>
                        </div>
                        <span className="badge rounded-pill px-2 py-1"
                          style={{ background: lastCheckOut ? "#fee2e2" : "#f1f5f9", color: lastCheckOut ? "#dc2626" : "#94a3b8", fontSize: "0.72rem" }}>
                          {fmtTime(lastCheckOut) || "Not Marked"}
                        </span>
                      </div>

                      {/* Session count pill */}
                      {sessions.length > 0 && (
                        <div className="text-center mb-2">
                          <span className="badge rounded-pill px-3 py-1" style={{ background: "#f8fafc", color: "#64748b", fontSize: "0.7rem" }}>
                            {sessions.length} session{sessions.length > 1 ? "s" : ""} today
                          </span>
                        </div>
                      )}

                      {/* Feedback messages */}
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

                      {/* Check-in / Check-out buttons */}
                      <div className="d-flex gap-2">
                        {/* CHECK IN — enabled when no open session */}
                        <button
                          className="btn flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold"
                          disabled={!canCheckIn || attLoading}
                          onClick={handleMark}
                          style={{
                            background:  canCheckIn ? "#6366f1" : "#f1f5f9",
                            color:       canCheckIn ? "#fff"    : "#94a3b8",
                            border: "none", borderRadius: "10px",
                            fontSize: "0.8rem", padding: "8px 0",
                            cursor:  canCheckIn ? "pointer" : "not-allowed",
                            opacity: canCheckIn ? 1 : 0.55,
                          }}>
                          {attLoading && canCheckIn
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><LogIn size={13} /> Check In</>}
                        </button>

                        {/* CHECK OUT — enabled when open session exists */}
                        <button
                          className="btn flex-fill d-flex align-items-center justify-content-center gap-2 fw-bold"
                          disabled={!canCheckOut || attLoading}
                          onClick={handleMark}
                          style={{
                            background:  canCheckOut ? "#ef4444" : "#f1f5f9",
                            color:       canCheckOut ? "#fff"    : "#94a3b8",
                            border: "none", borderRadius: "10px",
                            fontSize: "0.8rem", padding: "8px 0",
                            cursor:  canCheckOut ? "pointer" : "not-allowed",
                            opacity: canCheckOut ? 1 : 0.55,
                          }}>
                          {attLoading && canCheckOut
                            ? <span className="spinner-border spinner-border-sm" />
                            : <><LogOutIcon size={13} /> Check Out</>}
                        </button>
                      </div>

                      {/* Go to full attendance page */}
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

          {/* ── Stats ── */}
          <div className="row g-4 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-xl-3 col-md-6">
                <div className="p-4 shadow-sm bg-white rounded-4">
                  <div style={{ width: 45, height: 45, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10, color: stat.color }}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-muted mb-1">{stat.title}</p>
                  <h3 className="fw-bold">{stat.value || 0}</h3>
                </div>
              </div>
            ))}

            {!loading && nextHoliday && (
              <div className="row mb-4 mt-4">
                <div className="col-md-12">
                  <div className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
                    <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>Upcoming Holiday</span>
                    <h5 className="fw-bold fs-2">{nextHoliday.description?.charAt(0).toUpperCase() + nextHoliday.description?.slice(1)}</h5>
                    <div className="mt-2">
                      <div className="d-flex align-items-center gap-2" style={{ fontSize: "15px" }}>
                        <Clock size={14} />{new Date(nextHoliday.holiday_date).toLocaleDateString()}
                      </div>
                      <div className="fw-semibold mt-1" style={{ fontSize: "15px" }}>{daysLeft} days left</div>
                    </div>
                    <CalendarDays size={80} className="position-absolute opacity-25" style={{ right: "-10px", bottom: "-10px", transform: "rotate(-15deg)" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Data Tables ── */}
          <div className="row g-4">

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Employees</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table">
                    <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                    <tbody>
                      {employees.map((emp, i) => (
                        <tr key={i}>
                          <td className="fw-semibold">{emp.name}</td>
                          <td>{emp.email}</td>
                          <td className="text-success fw-bold">Active</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Attendance</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table">
                    <thead><tr><th>Name</th><th>Date</th><th>Status</th><th>In</th><th>Out</th></tr></thead>
                    <tbody>
                      {attendance.map((a, i) => (
                        <tr key={i}>
                          <td>{a.name}</td>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td><span style={getBadgeStyle(a.status)}>{a.status}</span></td>
                          <td>{a.check_in || "-"}</td>
                          <td>{a.check_out || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Leave Requests</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table">
                    <thead>
                      <tr>
                        {isAdmin && <th>Employee</th>}
                        <th>Leave Type</th><th>Date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveRequests.map((req) => (
                        <tr key={req.leave_id}>
                          {isAdmin && <td>{req.employee_name}</td>}
                          <td>{req.leave_type}</td>
                          <td>{new Date(req.start_date).toLocaleDateString()} – {new Date(req.end_date).toLocaleDateString()}</td>
                          <td>{getStatusBadge(req.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Payroll</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table">
                    <thead><tr><th>Employee</th><th>Salary</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
                    <tbody>
                      {payrollData.map((pay) => (
                        <tr key={pay.employee_id}>
                          <td>{pay.name}</td>
                          <td>₹{pay.last_net_salary}</td>
                          <td>{pay.pay_date ? "Paid" : "Pending"}</td>
                          <td>{pay.pay_date ? new Date(pay.pay_date).toLocaleDateString() : "-"}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary" disabled={!pay.pay_date}
                              onClick={() => handleDownload(pay.payroll_id, pay.name)}>
                              <Download size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 bg-white shadow-sm rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Departments</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table align-middle">
                    <thead><tr><th>Department</th><th>Status</th></tr></thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="2" className="text-center py-4"><div className="spinner-border text-primary" /></td></tr>
                      ) : filtered.length > 0 ? (
                        filtered.map((dept, idx) => (
                          <tr key={dept.department_id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <div className="rounded-3 d-flex align-items-center justify-content-center fw-bold"
                                  style={{ width: 38, height: 38, background: palette[idx % palette.length].bg, color: palette[idx % palette.length].color }}>
                                  {dept.department_name.charAt(0)}
                                </div>
                                <div>
                                  <div className="fw-semibold">{dept.department_name}</div>
                                  <small className="text-muted">ID: DEPT_{dept.department_id}</small>
                                </div>
                              </div>
                            </td>
                            <td><span className="badge bg-success-subtle text-success">Active</span></td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan="2" className="text-center py-4 text-muted">No departments found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="bg-white p-4 rounded-4 border shadow-sm overflow-hidden" style={cardStyle}>
                <h5 className="fw-bold mb-3">Designations</h5>
                <div className="table-responsive" style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table align-middle mb-0">
                    <thead className="bg-light">
                      <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                        <th className="px-4 py-3 border-0">ID</th>
                        <th className="px-4 py-3 border-0">Designation</th>
                        <th className="px-4 py-3 border-0">Entity</th>
                        <th className="px-4 py-3 border-0 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center py-5">
                          <div className="spinner-border text-primary border-0" />
                        </td></tr>
                      ) : designations.length === 0 ? (
                        <tr><td colSpan="4" className="text-center py-5">
                          <Info size={40} className="text-light mb-2" />
                          <p className="text-muted small mb-0">No designations found.</p>
                        </td></tr>
                      ) : designations.map((d) => (
                        <tr key={d.designation_id}>
                          <td className="px-4 py-3">
                            <span className="badge font-monospace text-secondary bg-light border px-2 py-1" style={{ fontSize: "11px" }}>#{d.designation_id}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="fw-bold text-dark">{d.designation_name}</span>
                          </td>
                          <td className="px-4 py-3 text-muted">
                            <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>ORG_{d.company_id}</span>
                          </td>
                          <td className="px-4 py-3 text-end">
                            <button className="btn btn-sm btn-outline-danger border-0 rounded-2 p-2" onClick={() => deleteDesignation(d.designation_id)}>
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Support Tickets</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  <table className="table align-middle">
                    <thead><tr><th>ID</th><th>Subject</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="4" className="text-center py-4"><div className="spinner-border text-primary" /></td></tr>
                      ) : tickets && tickets.length > 0 ? tickets.map((ticket) => (
                        <tr key={ticket.ticket_id || ticket.user_email}>
                          <td><span className="badge bg-light text-dark">#{ticket.user_email}</span></td>
                          <td>{ticket.subject}</td>
                          <td>
                            <span className={`badge ${ticket.status === "Open" ? "bg-warning-subtle text-warning" : ticket.status === "Closed" ? "bg-success-subtle text-success" : "bg-secondary-subtle text-secondary"}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td>{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : "-"}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" className="text-center py-4 text-muted">No support tickets found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
                <h5 className="fw-bold mb-3">Transactions</h5>
                <div style={{ flex: 1, overflowY: "auto" }}>
                  {loading ? (
                    <div className="text-center p-5 text-muted">Loading...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center p-5">
                      <div style={{ fontSize: 40, marginBottom: 12 }}>💳</div>
                      <div className="fw-bold text-dark mb-1">No payments yet</div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead className="bg-light">
                          <tr style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>
                            <th className="px-4 py-3">#</th>
                            <th className="py-3">Plan</th>
                            <th className="py-3">Amount</th>
                            <th className="py-3">Date</th>
                            <th className="py-3">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactions.map((tx, i) => (
                            <tr key={tx.transaction_id}>
                              <td className="px-4 py-3 text-muted small">{i + 1}</td>
                              <td className="py-3 fw-semibold">{tx.plan_name || "—"}</td>
                              <td className="py-3 fw-bold">{fmtAmount(tx.amount)}</td>
                              <td className="py-3 text-muted small">{fmtDate(tx.payment_date)}</td>
                              <td className="py-3">
                                <span className="badge rounded-pill px-2 py-1" style={{ background: STATUS_STYLE[tx.status]?.bg || "#f1f5f9", color: STATUS_STYLE[tx.status]?.text || "#64748b", fontSize: "11px" }}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </PageContent>
    </div>
  );
};

export default Dashboard;