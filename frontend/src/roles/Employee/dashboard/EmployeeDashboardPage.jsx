// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import Sidebar from "../../../layouts/Sidebar";
// // // // // // import { PageContent } from "../../../layouts/usePageLayout";
// // // // // // import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee } from "lucide-react";
// // // // // // import { useNavigate } from "react-router-dom";
// // // // // // import axios from "axios";
// // // // // // import ChatbotWidget from "../../../components/ChatbotWidget";

// // // // // // const EmployeeDashboard = () => {
// // // // // //   const navigate = useNavigate();
// // // // // //   const [statsData, setStatsData] = useState({
// // // // // //     attendanceToday: "Loading...",
// // // // // //     leaveBalance: "12 Days",
// // // // // //     upcomingHolidays: "0",
// // // // // //     payslipsCount: "0"
// // // // // //   });
// // // // // //   const [loading, setLoading] = useState(true);

// // // // // //   useEffect(() => {
// // // // // //     const fetchDashboardData = async () => {
// // // // // //       try {
// // // // // //         const token = localStorage.getItem("token");
// // // // // //         const headers = { "x-auth-token": token };

// // // // // //         const summaryRes = await axios.get(
// // // // // //           "http://localhost:5001/api/dashboard/summary",
// // // // // //           { headers }
// // // // // //         );

// // // // // //         if (summaryRes.data.success) {
// // // // // //           const s = summaryRes.data.data;
// // // // // //           setStatsData({
// // // // // //             attendanceToday: s.attendanceToday || "Not Marked",
// // // // // //             leaveBalance: `${s.leaveBalance ?? 12} Days`,
// // // // // //             upcomingHolidays: String(s.upcomingHolidays || 0),
// // // // // //             payslipsCount: String(s.payslipsCount || 0)
// // // // // //           });
// // // // // //         }
// // // // // //       } catch (error) {
// // // // // //         console.error("Error fetching employee dashboard data:", error);
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     };
// // // // // //     fetchDashboardData();
// // // // // //   }, []);

// // // // // //   const stats = [
// // // // // //     { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
// // // // // //     { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
// // // // // //     { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
// // // // // //     { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
// // // // // //   ];

// // // // // //   if (loading) {
// // // // // //     return (
// // // // // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // // // // //         <div className="text-center">
// // // // // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
// // // // // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <div className="d-flex bg-light min-vh-100">
// // // // // //       <Sidebar />
// // // // // //       <PageContent>
// // // // // //         <div className="container-fluid px-3 px-md-4 py-4">
          
// // // // // //           <div className="mb-4 pt-2">
// // // // // //             <h2 className="fw-bold fs-2 mb-1" style={{ color: "#0f172a", letterSpacing: "-1px" }}>
// // // // // //               Welcome back, {localStorage.getItem("name") || "Employee"}! 👋
// // // // // //             </h2>
// // // // // //             <p className="text-muted">
// // // // // //               Here's a quick overview of your profile and performance for today.
// // // // // //             </p>
// // // // // //           </div>

// // // // // //           <div className="row g-3 mb-4">
// // // // // //             {stats.map((stat, idx) => (
// // // // // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // // // // //                 <div 
// // // // // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // // // // //                   onClick={() => navigate(stat.link)}
// // // // // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // // // // //                 >
// // // // // //                   <div className="card-body d-flex align-items-center">
// // // // // //                     <div 
// // // // // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3" 
// // // // // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // // // // //                     >
// // // // // //                       {stat.icon}
// // // // // //                     </div>
// // // // // //                     <div>
// // // // // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
// // // // // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             ))}
// // // // // //           </div>

// // // // // //           <div className="row g-4">
// // // // // //             <div className="col-12 col-lg-8">
// // // // // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // // // // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // // // // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // // // // //                 </h5>
// // // // // //                 <div className="row g-3">
// // // // // //                   <div className="col-6 col-md-4">
// // // // // //                     <button 
// // // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // // //                       onClick={() => navigate("/employee/attendance")}
// // // // // //                       style={{ background: "#f8fafc" }}
// // // // // //                     >
// // // // // //                       <Clock className="text-success" />
// // // // // //                       <span className="small fw-bold">Clock In/Out</span>
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                   <div className="col-6 col-md-4">
// // // // // //                     <button 
// // // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // // //                       onClick={() => navigate("/employee/leaves")}
// // // // // //                       style={{ background: "#f8fafc" }}
// // // // // //                     >
// // // // // //                       <Calendar className="text-primary" />
// // // // // //                       <span className="small fw-bold">Request Leave</span>
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                   <div className="col-12 col-md-4">
// // // // // //                     <button 
// // // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // // //                       onClick={() => navigate("/employee/payroll")}
// // // // // //                       style={{ background: "#f8fafc" }}
// // // // // //                     >
// // // // // //                       <FileText className="text-info" />
// // // // // //                       <span className="small fw-bold">View Payslips</span>
// // // // // //                     </button>
// // // // // //                   </div>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>

// // // // // //             <div className="col-12 col-lg-4">
// // // // // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // // // // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // // // // //                   <Coffee size={120} />
// // // // // //                 </div>
// // // // // //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// // // // // //                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
// // // // // //                 <button 
// // // // // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // // // // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
// // // // // //                   onClick={() => navigate("/employee/holidays")}
// // // // // //                 >
// // // // // //                   View Calendar <ArrowRight size={14} />
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //         </div>
// // // // // //       </PageContent>
// // // // // //       <ChatbotWidget />

// // // // // //       <style>{`
// // // // // //         .hover-card:hover {
// // // // // //           transform: translateY(-5px);
// // // // // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // // // // //         }
// // // // // //         .btn-white:hover {
// // // // // //           background: #fff !important;
// // // // // //           color: #4f46e5 !important;
// // // // // //         }
// // // // // //       `}</style>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default EmployeeDashboard;
// // // // // import React, { useState, useEffect } from "react";
// // // // // import Sidebar from "../../../layouts/Sidebar";
// // // // // import { PageContent } from "../../../layouts/usePageLayout";
// // // // // import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee, Mail, Phone, Building2, MapPin, CalendarDays } from "lucide-react";
// // // // // import { useNavigate } from "react-router-dom";
// // // // // import axios from "axios";
// // // // // import ChatbotWidget from "../../../components/ChatbotWidget";
// // // // // import "../../../App.css";


// // // // // const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// // // // // const EmployeeDashboard = () => {
// // // // //   const navigate = useNavigate();
// // // // //   const [statsData, setStatsData] = useState({
// // // // //     attendanceToday: "Loading...",
// // // // //     leaveBalance: "12 Days",
// // // // //     upcomingHolidays: "0",
// // // // //     payslipsCount: "0"
// // // // //   });
// // // // //   const [profile, setProfile] = useState({
// // // // //     name: "", employee_id: "", email: "", employment_type: "",designation_id:"",
// // // // //     role: "Employee", department_id: "", reporting_manager: "",
// // // // //   });
// // // // //   const [holidays, setHolidays] = useState([]);
// // // // //    const [leaves, setleaves] = useState([]);
// // // // //     const [latters, setlatters] = useState([]);

// // // // //     const [attendence, setAttendence] = useState({
// // // // //       check_in:"",check_out:""
// // // // //   });
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const today = new Date();
// // // // // today.setHours(0, 0, 0, 0);

// // // // //   const nextHoliday = holidays
// // // // //   ?.filter((h) => new Date(h.holiday_date) >= today)
// // // // //   ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];


// // // // //   const daysLeft =
// // // // //   nextHoliday &&
// // // // //   Math.ceil(
// // // // //     (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - today) /
// // // // //       (1000 * 60 * 60 * 24)
// // // // //   );

// // // // //     const fetchDashboardData = async () => {
// // // // //       try {
// // // // //         const token = localStorage.getItem("token");
// // // // //         const headers = { "x-auth-token": token };


// // // // //         const[summaryRes,profile,attendence,holiday,leave,letter]=await Promise.all([
// // // // //           axios.get(`${API}/api/dashboard/summary`,{ headers }),
// // // // //           axios.get(`${API}/api/employees/profile`,{ headers }),
// // // // //           axios.get(`${API}/api/attendance/today`,{ headers }),
// // // // //           axios.get(`${API}/api/holidays`,{ headers }),
// // // // //           axios.get(`${API}/api/leaves`,{ headers }),
// // // // //           axios.get(`${API}/api/letters/my-letters`,{ headers }),

// // // // //         ])
// // // // //          const s = summaryRes.data.data;
// // // // //         const d = profile.data.data || [];
// // // // //         console.log(d);
// // // // //         const a=attendence.data.data || [];
// // // // //         setStatsData({
// // // // //             attendanceToday: s.attendanceToday || "Not Marked",
// // // // //             leaveBalance: `${s.leaveBalance ?? 12} Days`,
// // // // //             upcomingHolidays: String(s.upcomingHolidays || 0),
// // // // //             payslipsCount: String(s.payslipsCount || 0)
// // // // //           });
// // // // //         const p = {
// // // // //         name: d.name || "Employee",
// // // // //         employee_id: d.employee_id || "--",
// // // // //         email: d.email || "Not Available",
// // // // //         employment_type: d.employment_type || "Not Specified",
// // // // //         designation: d.designation_name || d.designation_id || "Not Assigned",
// // // // //         department: d.department_name || d.department_id || "Not Assigned",
// // // // //         reporting_manager: d.reporting_manager || "No Manager Assigned",
// // // // //         };
// // // // //         setProfile(p)
// // // // //         const b={
// // // // //           check_out:a.check_out || "Not Available",
// // // // //           check_in:a.check_in || "Not Available"
// // // // //         }
// // // // //         setAttendence(b)
// // // // //         setHolidays(holiday.data.data)
// // // // //         console.log(leave)
// // // // //         setleaves(leave.data.data);
// // // // //         setlatters(letter.data.data);
// // // // //         console.log(letter)
// // // // //       } catch (error) {
// // // // //         console.error("Error fetching employee dashboard data:", error);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };
  
// // // // //     useEffect(() => {
// // // // //       fetchDashboardData();
// // // // //     }, []);

// // // // //   const stats = [
// // // // //     { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
// // // // //     { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
// // // // //     { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
// // // // //     { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
// // // // //   ];

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // // // //         <div className="text-center">
// // // // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
// // // // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <div className="d-flex bg-light min-vh-100">
// // // // //       <Sidebar />
// // // // //       <PageContent>
// // // // //         <div className="container-fluid px-3 px-md-4 py-4">
          
// // // // // <div className="row mb-5">
// // // // //   <div className="col-12">
// // // // //     <div
// // // // //       className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
// // // // //       style={{ background: "#eef2ff" }}
// // // // //     >
// // // // //       <div className="row align-items-center">

// // // // //         <div className="col-12 col-lg-8">
// // // // //           <div className="mb-3 text-center text-lg-start">
// // // // //             <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
// // // // //               Welcome back, {localStorage.getItem("name") || "Employee"} 👋
// // // // //             </h2>

// // // // //             <p className="fw-semibold" style={{ color: "#475569" ,}}>
// // // // //               Here's a quick overview of your profile and performance for today.
// // // // //             </p>
// // // // //           </div>
// // // // // <div className="row mt-5">
// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <Mail size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">{profile.email}</div>
// // // // //     </div>
// // // // //   </div>

// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <UserCheck size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">
// // // // //         Employee ID: {profile.employee_id}
// // // // //       </div>
// // // // //     </div>
// // // // //   </div>

// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <Building2 size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">{profile.department}</div>
// // // // //     </div>
// // // // //   </div>

// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <FileText size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">{profile.designation}</div>
// // // // //     </div>
// // // // //   </div>

// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <UserCheck size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">
// // // // //         Manager: {profile.reporting_manager}
// // // // //       </div>
// // // // //     </div>
// // // // //   </div>

// // // // //   <div className="col-12 col-md-6 mb-3">
// // // // //     <div className="d-flex align-items-start gap-2 profile-item">
// // // // //       <CalendarDays size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // // // //       <div className="profile-text">{profile.employment_type}</div>
// // // // //     </div>
// // // // //   </div>
// // // // // </div>
// // // // // </div>
// // // // // <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">
// // // // //   <div
// // // // //     className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
// // // // //     style={{
// // // // //       width: "90px",
// // // // //       height: "90px",
// // // // //       fontSize: "32px",
// // // // //       background: "#6366f1",
// // // // //       boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
// // // // //     }}
// // // // //   >
// // // // //     {(localStorage.getItem("name") || "E").charAt(0)}
// // // // //   </div>

// // // // //   <h4 className="mt-3 mb-1" style={{ color: "#1e293b" }}>
// // // // //     {localStorage.getItem("name") || "Employee"}
// // // // //   </h4>

// // // // //   <small style={{ color: "#64748b", fontSize: "14px" }}>
// // // // //     {(localStorage.getItem("role") || "Role")
// // // // //       .toLowerCase()
// // // // //       .replace(/\b\w/g, (c) => c.toUpperCase())}
// // // // //   </small>

// // // // //   <div className="mt-4 p-3 rounded-4 shadow-sm bg-white border">

// // // // //     <h6 className="fw-bold mb-3 text-muted">
// // // // //       Today's Attendance
// // // // //     </h6>

// // // // //     <div className="d-flex justify-content-between align-items-center mb-2">
// // // // //       <div className="d-flex align-items-center gap-2">
// // // // //         <Clock size={16} color="#10b981" />
// // // // //         <span className="small fw-semibold">Check In</span>
// // // // //       </div>

// // // // //       <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
// // // // //         {attendence.check_in || "Not Marked"}
// // // // //       </span>
// // // // //     </div>

// // // // //     <div className="d-flex justify-content-between align-items-center">
// // // // //       <div className="d-flex align-items-center gap-2">
// // // // //         <Clock size={16} color="#ef4444" />
// // // // //         <span className="small fw-semibold">Check Out</span>
// // // // //       </div>

// // // // //       <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
// // // // //         {attendence.check_out || "Not Marked"}
// // // // //       </span>
// // // // //     </div>

// // // // //   </div>

// // // // // </div>

// // // // //       </div>
// // // // //     </div>
// // // // //   </div>
// // // // // </div>

// // // // //           <div className="row g-3 mb-4">
// // // // //             {stats.map((stat, idx) => (
// // // // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // // // //                 <div 
// // // // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // // // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // // // //                 >
// // // // //                   <div className="card-body d-flex align-items-center">
// // // // //                     <div 
// // // // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3" 
// // // // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // // // //                     >
// // // // //                       {stat.icon}
// // // // //                     </div>
// // // // //                     <div>
// // // // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
// // // // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             ))}
// // // // //           </div>


// // // // // {!loading && nextHoliday && (
// // // // // <div className="row mb-4 mt-4">
// // // // //   <div className=" col-md-12">
// // // // //     <div
// // // // //       className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
// // // // //       style={{
// // // // //         background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
// // // // //         // minHeight: "140px",
// // // // //       }}
// // // // //     >
// // // // //       <span
// // // // //         className="badge mb-2"
// // // // //         style={{ background: "rgba(255,255,255,0.2)" }}
// // // // //       >
// // // // //         Upcoming Holiday
// // // // //       </span>

// // // // //       <h5 className="fw-bold fs-2">
// // // // //         {nextHoliday.description?.charAt(0).toUpperCase() +
// // // // //           nextHoliday.description?.slice(1)}
// // // // //       </h5>

// // // // //       <div className=" mt-2">
// // // // //         <div className="d-flex align-items-center gap-2" style={{fontSize:"15px"}}>
// // // // //           <Clock size={14} />
// // // // //           {new Date(nextHoliday.holiday_date).toLocaleDateString()}
// // // // //         </div>

// // // // //         <div className="fw-semibold mt-1" style={{fontSize:"15px"}}>
// // // // //           {daysLeft} days left
// // // // //         </div>
// // // // //       </div>

// // // // //       <CalendarDays
// // // // //         size={80}
// // // // //         className="position-absolute opacity-25"
// // // // //         style={{
// // // // //           right: "-10px",
// // // // //           bottom: "-10px",
// // // // //           transform: "rotate(-15deg)",
// // // // //         }}
// // // // //       />
// // // // //     </div>
// // // // //   </div>
// // // // // </div>
// // // // // )}
// // // // // <div className="row g-4">
// // // // //             <div className="col-12 col-lg-8">
// // // // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // // // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // // // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // // // //                 </h5>
// // // // //                 <div className="row g-3">
// // // // //                   <div className="col-6 col-md-4">
// // // // //                     <button 
// // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // //                       onClick={() => navigate("/attendance")}
// // // // //                       style={{ background: "#f8fafc" }}
// // // // //                     >
// // // // //                       <Clock className="text-success" />
// // // // //                       <span className="small fw-bold">Clock In/Out</span>
// // // // //                     </button>
// // // // //                   </div>
// // // // //                   <div className="col-6 col-md-4">
// // // // //                     <button 
// // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // //                       onClick={() => navigate("/leaves")}
// // // // //                       style={{ background: "#f8fafc" }}
// // // // //                     >
// // // // //                       <Calendar className="text-primary" />
// // // // //                       <span className="small fw-bold">Request Leave</span>
// // // // //                     </button>
// // // // //                   </div>
// // // // //                   <div className="col-12 col-md-4">
// // // // //                     <button 
// // // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // // //                       onClick={() => navigate("/employee/my-letters")}
// // // // //                       style={{ background: "#f8fafc" }}
// // // // //                     >
// // // // //                       <FileText className="text-info" />
// // // // //                       <span className="small fw-bold">View Payslips</span>
// // // // //                     </button>
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>

// // // // //             <div className="col-12 col-lg-4">
// // // // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // // // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // // // //                   <Coffee size={120} />
// // // // //                 </div>
// // // // //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// // // // //                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
// // // // //                 <button 
// // // // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // // // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
// // // // //                   onClick={() => navigate("/holidays")}
// // // // //                 >
// // // // //                   View Calendar <ArrowRight size={14} />
// // // // //                 </button>
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>



// // // // //           <div className="row mt-4 g-4">
// // // // //   <div className="col-12 col-lg-6">
// // // // //     <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // // // //       <div className="d-flex justify-content-between align-items-center mb-3">
// // // // //         <h5 className="fw-bold d-flex align-items-center gap-2">
// // // // //           <Mail size={18} className="text-primary" />
// // // // //           My Letters
// // // // //         </h5>
// // // // //         <span className="badge bg-primary-subtle text-primary">
// // // // //           {latters?.length || 0}
// // // // //         </span>
// // // // //       </div>

// // // // //       <div style={{ maxHeight: "330px", overflowY: "auto" }}>
// // // // //         <table className="table align-middle table-hover">
// // // // //           <thead className="table-light sticky-top">
// // // // //             <tr>
// // // // //               <th>Letter</th>
// // // // //               <th>Status</th>
// // // // //               <th>Date</th>
// // // // //             </tr>
// // // // //           </thead>

// // // // //           <tbody>
// // // // //             {latters?.length > 0 ? (
// // // // //               latters.map((l) => (
// // // // //                 <tr key={l.id}>
// // // // //                   <td className="fw-semibold text-capitalize">
// // // // //                     {l.letter_type}
// // // // //                   </td>

// // // // //                   <td>
// // // // //                     <span className="badge bg-success-subtle text-success">
// // // // //                      {l.status === "sent" && "Received"}
// // // // //                     </span>
// // // // //                   </td>

// // // // //                   <td>
// // // // //                     {new Date(l.created_at).toLocaleDateString()}
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))
// // // // //             ) : (
// // // // //               <tr>
// // // // //                 <td colSpan="3" className="text-center text-muted py-4">
// // // // //                   No letters found
// // // // //                 </td>
// // // // //               </tr>
// // // // //             )}
// // // // //           </tbody>
// // // // //         </table>
// // // // //       </div>
// // // // //     </div>
// // // // //   </div>
// // // // //   <div className="col-12 col-lg-6">
// // // // //     <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // // // //       <div className="d-flex justify-content-between align-items-center mb-3">
// // // // //         <h5 className="fw-bold d-flex align-items-center gap-2">
// // // // //           <Calendar size={18} className="text-success" />
// // // // //           My Leaves
// // // // //         </h5>
// // // // //         <span className="badge bg-success-subtle text-success">
// // // // //           {leaves?.length || 0}
// // // // //         </span>
// // // // //       </div>

// // // // //       <div style={{ maxHeight: "330px", overflowY: "auto" }}>
// // // // //         <table className="table align-middle table-hover">
// // // // //           <thead className="table-light sticky-top">
// // // // //             <tr>
// // // // //               <th>Type</th>
// // // // //               <th>Duration</th>
// // // // //               <th>Status</th>
// // // // //             </tr>
// // // // //           </thead>

// // // // //           <tbody>
// // // // //             {leaves?.length > 0 ? (
// // // // //               leaves.map((l) => (
// // // // //                 <tr key={l.leave_id}>
// // // // //                   <td className="fw-semibold">{l.leave_type}</td>

// // // // //                   <td>
// // // // //                     {new Date(l.start_date).toLocaleDateString()}  
// // // // //                     <br />
// // // // //                     <small className="text-muted">
// // // // //                       to {new Date(l.end_date).toLocaleDateString()}
// // // // //                     </small>
// // // // //                   </td>

// // // // //                   <td>
// // // // //                     <span
// // // // //                       className={`badge ${
// // // // //                         l.status === "Approved"
// // // // //                           ? "bg-success-subtle text-success"
// // // // //                           : l.status === "Rejected"
// // // // //                           ? "bg-danger-subtle text-danger"
// // // // //                           : "bg-warning-subtle text-warning"
// // // // //                       }`}
// // // // //                     >
// // // // //                       {l.status}
// // // // //                     </span>
// // // // //                   </td>
// // // // //                 </tr>
// // // // //               ))
// // // // //             ) : (
// // // // //               <tr>
// // // // //                 <td colSpan="3" className="text-center text-muted py-4">
// // // // //                   No leave records
// // // // //                 </td>
// // // // //               </tr>
// // // // //             )}
// // // // //           </tbody>
// // // // //         </table>
// // // // //       </div>
// // // // //     </div>
// // // // //   </div>

// // // // // </div>

// // // // //         </div>
// // // // //       </PageContent>
// // // // //       <ChatbotWidget />

// // // // //       <style>{`
// // // // //         .hover-card:hover {
// // // // //           transform: translateY(-5px);
// // // // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // // // //         }
// // // // //         .btn-white:hover {
// // // // //           background: #fff !important;
// // // // //           color: #4f46e5 !important;
// // // // //         }
// // // // //       `}</style>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default EmployeeDashboard;
// // // // import React, { useState, useEffect } from "react";
// // // // import Sidebar from "../../../layouts/Sidebar";
// // // // import { PageContent } from "../../../layouts/usePageLayout";
// // // // import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee } from "lucide-react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import axios from "axios";
// // // // import ChatbotWidget from "../../../components/ChatbotWidget";

// // // // const EmployeeDashboard = ({ selfView }) => {
// // // //   const navigate = useNavigate();
// // // //   const [statsData, setStatsData] = useState({
// // // //     attendanceToday: "Loading...",
// // // //     leaveBalance: "12 Days",
// // // //     upcomingHolidays: "0",
// // // //     payslipsCount: "0"
// // // //   });
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchDashboardData = async () => {
// // // //       try {
// // // //         const token = localStorage.getItem("token");
// // // //         const headers = { "x-auth-token": token };

// // // //         const summaryRes = await axios.get(
// // // //   selfView
// // // //     ? "http://localhost:5001/api/dashboard/summary?mode=self"
// // // //     : "http://localhost:5001/api/dashboard/summary",
// // // //   { headers }
// // // // );

// // // //         if (summaryRes.data.success) {
// // // //           const s = summaryRes.data.data;
// // // //           setStatsData({
// // // //             attendanceToday: s.attendanceToday || "Not Marked",
// // // //             leaveBalance: `${s.leaveBalance ?? 12} Days`,
// // // //             upcomingHolidays: String(s.upcomingHolidays || 0),
// // // //             payslipsCount: String(s.payslipsCount || 0)
// // // //           });
// // // //         }
// // // //       } catch (error) {
// // // //         console.error("Error fetching employee dashboard data:", error);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };
// // // //     fetchDashboardData();
// // // //   }, []);

// // // //   const stats = [
// // // //     { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
// // // //     { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
// // // //     { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
// // // //     { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
// // // //   ];

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // // //         <div className="text-center">
// // // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
// // // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div className="d-flex bg-light min-vh-100">
// // // //       <Sidebar />
// // // //       <PageContent>
// // // //         <div className="container-fluid px-3 px-md-4 py-4">
          
// // // //           <div className="mb-4 pt-2">
// // // //             <h2 className="fw-bold fs-2 mb-1" style={{ color: "#0f172a", letterSpacing: "-1px" }}>
// // // //               Welcome back, {localStorage.getItem("name") || "Employee"}! 👋
// // // //             </h2>
// // // //             <p className="text-muted">
// // // //               Here's a quick overview of your profile and performance for today.
// // // //             </p>
// // // //           </div>

// // // //           <div className="row g-3 mb-4">
// // // //             {stats.map((stat, idx) => (
// // // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // // //                 <div 
// // // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // // //                   onClick={() => navigate(stat.link)}
// // // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // // //                 >
// // // //                   <div className="card-body d-flex align-items-center">
// // // //                     <div 
// // // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3" 
// // // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // // //                     >
// // // //                       {stat.icon}
// // // //                     </div>
// // // //                     <div>
// // // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
// // // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             ))}
// // // //           </div>

// // // //           <div className="row g-4">
// // // //             <div className="col-12 col-lg-8">
// // // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // // //                 </h5>
// // // //                 <div className="row g-3">
// // // //                   <div className="col-6 col-md-4">
// // // //                     <button 
// // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // //                       onClick={() => navigate("/employee/attendance")}
// // // //                       style={{ background: "#f8fafc" }}
// // // //                     >
// // // //                       <Clock className="text-success" />
// // // //                       <span className="small fw-bold">Clock In/Out</span>
// // // //                     </button>
// // // //                   </div>
// // // //                   <div className="col-6 col-md-4">
// // // //                     <button 
// // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // //                       onClick={() => navigate("/employee/leaves")}
// // // //                       style={{ background: "#f8fafc" }}
// // // //                     >
// // // //                       <Calendar className="text-primary" />
// // // //                       <span className="small fw-bold">Request Leave</span>
// // // //                     </button>
// // // //                   </div>
// // // //                   <div className="col-12 col-md-4">
// // // //                     <button 
// // // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // // //                       onClick={() => navigate("/employee/payroll")}
// // // //                       style={{ background: "#f8fafc" }}
// // // //                     >
// // // //                       <FileText className="text-info" />
// // // //                       <span className="small fw-bold">View Payslips</span>
// // // //                     </button>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>
// // // //             </div>

// // // //             <div className="col-12 col-lg-4">
// // // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // // //                   <Coffee size={120} />
// // // //                 </div>
// // // //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// // // //                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
// // // //                 <button 
// // // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
// // // //                   onClick={() => navigate("/employee/holidays")}
// // // //                 >
// // // //                   View Calendar <ArrowRight size={14} />
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //         </div>
// // // //       </PageContent>
// // // //       <ChatbotWidget />

// // // //       <style>{`
// // // //         .hover-card:hover {
// // // //           transform: translateY(-5px);
// // // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // // //         }
// // // //         .btn-white:hover {
// // // //           background: #fff !important;
// // // //           color: #4f46e5 !important;
// // // //         }
// // // //       `}</style>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EmployeeDashboard;
// // // import React, { useState, useEffect } from "react";
// // // import Sidebar from "../../../layouts/Sidebar";
// // // import { PageContent } from "../../../layouts/usePageLayout";
// // // import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee, Mail, Building2, CalendarDays, Briefcase, User } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import ChatbotWidget from "../../../components/ChatbotWidget";

// // // const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// // // const EmployeeDashboard = () => {
// // //   const navigate = useNavigate();
// // //   const [statsData, setStatsData] = useState({
// // //     attendanceToday: "Loading...",
// // //     leaveBalance: "12 Days",
// // //     upcomingHolidays: "0",
// // //     payslipsCount: "0"
// // //   });
// // //   const [profile, setProfile] = useState({
// // //     name: "",
// // //     employee_id: "",
// // //     email: "",
// // //     employment_type: "",
// // //     designation: "",
// // //     department: "",
// // //     reporting_manager: ""
// // //   });
// // //   const [holidays, setHolidays] = useState([]);
// // //   const [leaves, setLeaves] = useState([]);
// // //   const [letters, setLetters] = useState([]);
// // //   const [attendance, setAttendance] = useState({
// // //     check_in: "",
// // //     check_out: ""
// // //   });
// // //   const [loading, setLoading] = useState(true);
// // //   const today = new Date();
// // //   today.setHours(0, 0, 0, 0);

// // //   const nextHoliday = holidays
// // //     ?.filter((h) => new Date(h.holiday_date) >= today)
// // //     ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

// // //   const daysLeft = nextHoliday &&
// // //     Math.ceil(
// // //       (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - today) /
// // //       (1000 * 60 * 60 * 24)
// // //     );

// // //   useEffect(() => {
// // //     fetchDashboardData();
// // //   }, []);

// // //   const fetchDashboardData = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");
// // //       const headers = { "x-auth-token": token };

// // //       const [summaryRes, profileRes, attendanceRes, holidayRes, leaveRes, letterRes] = await Promise.all([
// // //         axios.get(`${API}/api/dashboard/summary`, { headers }),
// // //         axios.get(`${API}/api/employees/profile`, { headers }),
// // //         axios.get(`${API}/api/attendance/today`, { headers }),
// // //         axios.get(`${API}/api/holidays`, { headers }),
// // //         axios.get(`${API}/api/leaves`, { headers }),
// // //         axios.get(`${API}/api/letters/my-letters`, { headers })
// // //       ]);

// // //       const s = summaryRes.data.data;
// // //       setStatsData({
// // //         attendanceToday: s.attendanceToday || "Not Marked",
// // //         leaveBalance: `${s.leaveBalance ?? 12} Days`,
// // //         upcomingHolidays: String(s.upcomingHolidays || 0),
// // //         payslipsCount: String(s.payslipsCount || 0)
// // //       });

// // //       const d = profileRes.data.data || {};
// // //       setProfile({
// // //         name: d.name || "Employee",
// // //         employee_id: d.employee_id || "--",
// // //         email: d.email || "Not Available",
// // //         employment_type: d.employment_type || "Not Specified",
// // //         designation: d.designation_name || d.designation_id || "Not Assigned",
// // //         department: d.department_name || d.department_id || "Not Assigned",
// // //         reporting_manager: d.reporting_manager || "No Manager Assigned"
// // //       });

// // //       const a = attendanceRes.data.data || {};
// // //       setAttendance({
// // //         check_in: a.check_in || "Not Marked",
// // //         check_out: a.check_out || "Not Marked"
// // //       });

// // //       setHolidays(holidayRes.data.data || []);
// // //       setLeaves(leaveRes.data.data || []);
// // //       setLetters(letterRes.data.data || []);

// // //     } catch (error) {
// // //       console.error("Error fetching employee dashboard data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const stats = [
// // //     { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
// // //     { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
// // //     { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
// // //     { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
// // //   ];

// // //   if (loading) {
// // //     return (
// // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // //         <div className="text-center">
// // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
// // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="d-flex bg-light min-vh-100">
// // //       <Sidebar />
// // //       <PageContent>
// // //         <div className="container-fluid px-3 px-md-4 py-4">
          
// // //           <div className="mb-4 pt-2">
// // //             <h2 className="fw-bold fs-2 mb-1" style={{ color: "#0f172a", letterSpacing: "-1px" }}>
// // //               Welcome back, {localStorage.getItem("name") || profile.name}! 👋
// // //             </h2>
// // //             <p className="text-muted">
// // //               Here's a quick overview of your profile and performance for today.
// // //             </p>
// // //           </div>

// // //           <div className="row g-3 mb-4">
// // //             {stats.map((stat, idx) => (
// // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // //                 <div 
// // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // //                   onClick={() => navigate(stat.link)}
// // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // //                 >
// // //                   <div className="card-body d-flex align-items-center">
// // //                     <div 
// // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3" 
// // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // //                     >
// // //                       {stat.icon}
// // //                     </div>
// // //                     <div>
// // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
// // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div className="row mb-5">
// // //             <div className="col-12">
// // //               <div
// // //                 className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
// // //                 style={{ background: "#eef2ff" }}
// // //               >
// // //                 <div className="row align-items-center">
// // //                   <div className="col-12 col-lg-8">
// // //                     <div className="mb-3 text-center text-lg-start">
// // //                       <div className="d-flex align-items-center gap-2 mb-2">
// // //                         <UserCheck size={24} color="#6366f1" />
// // //                         <h3 className="fw-bold mb-0" style={{ color: "#1e293b" }}>Employee Profile</h3>
// // //                       </div>
// // //                     </div>

// // //                     <div className="row mt-4">
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <Mail size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Email</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.email}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <User size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Employee ID</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.employee_id}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <Building2 size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Department</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.department}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <Briefcase size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Designation</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.designation}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <UserCheck size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Reporting Manager</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.reporting_manager}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2">
// // //                           <CalendarDays size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div>
// // //                             <div className="small text-muted">Employment Type</div>
// // //                             <div className="fw-semibold" style={{ fontSize: "14px" }}>{profile.employment_type}</div>
// // //                           </div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">
// // //                     <div
// // //                       className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
// // //                       style={{
// // //                         width: "100px",
// // //                         height: "100px",
// // //                         fontSize: "36px",
// // //                         background: "#6366f1",
// // //                         boxShadow: "0 10px 25px rgba(99,102,241,0.3)"
// // //                       }}
// // //                     >
// // //                       {(localStorage.getItem("name") || profile.name || "E").charAt(0).toUpperCase()}
// // //                     </div>
// // //                     <h4 className="mt-3 mb-1" style={{ color: "#1e293b" }}>
// // //                       {localStorage.getItem("name") || profile.name}
// // //                     </h4>
// // //                     <small style={{ color: "#64748b", fontSize: "14px" }}>
// // //                       {(localStorage.getItem("role") || "Employee").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
// // //                     </small>
                    
// // //                     <div className="mt-4 p-3 rounded-4 shadow-sm bg-white border">
// // //                       <h6 className="fw-bold mb-3 text-muted">Today's Attendance</h6>
// // //                       <div className="d-flex justify-content-between align-items-center mb-2">
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <Clock size={16} color="#10b981" />
// // //                           <span className="small fw-semibold">Check In</span>
// // //                         </div>
// // //                         <span className="badge rounded-pill px-3 py-2" style={{ background: attendance.check_in !== "Not Marked" ? "#dcfce7" : "#fee2e2", color: attendance.check_in !== "Not Marked" ? "#15803d" : "#dc2626" }}>
// // //                           {attendance.check_in}
// // //                         </span>
// // //                       </div>
// // //                       <div className="d-flex justify-content-between align-items-center">
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <Clock size={16} color="#ef4444" />
// // //                           <span className="small fw-semibold">Check Out</span>
// // //                         </div>
// // //                         <span className="badge rounded-pill px-3 py-2" style={{ background: attendance.check_out !== "Not Marked" ? "#dcfce7" : "#fee2e2", color: attendance.check_out !== "Not Marked" ? "#15803d" : "#dc2626" }}>
// // //                           {attendance.check_out}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {!loading && nextHoliday && (
// // //             <div className="row mb-4">
// // //               <div className="col-md-12">
// // //                 <div
// // //                   className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
// // //                   style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
// // //                 >
// // //                   <div className="d-flex justify-content-between align-items-start">
// // //                     <div>
// // //                       <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
// // //                         Upcoming Holiday
// // //                       </span>
// // //                       <h4 className="fw-bold mb-2">
// // //                         {nextHoliday.description?.charAt(0).toUpperCase() + nextHoliday.description?.slice(1)}
// // //                       </h4>
// // //                       <div className="d-flex align-items-center gap-3 mt-2">
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <CalendarDays size={16} />
// // //                           <span>{new Date(nextHoliday.holiday_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
// // //                         </div>
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <Clock size={16} />
// // //                           <span className="fw-semibold">{daysLeft} days left</span>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                     <CalendarDays size={80} className="opacity-25" style={{ transform: "rotate(-15deg)" }} />
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}

// // //           <div className="row g-4">
// // //             <div className="col-12 col-lg-8">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // //                 </h5>
// // //                 <div className="row g-3">
// // //                   <div className="col-6 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/attendance")}
// // //                       style={{ background: "#f8fafc", transition: "all 0.2s" }}
// // //                       onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
// // //                       onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
// // //                     >
// // //                       <Clock className="text-success" size={20} />
// // //                       <span className="small fw-bold">Clock In/Out</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-6 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/leaves")}
// // //                       style={{ background: "#f8fafc", transition: "all 0.2s" }}
// // //                       onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
// // //                       onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
// // //                     >
// // //                       <Calendar className="text-primary" size={20} />
// // //                       <span className="small fw-bold">Request Leave</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-12 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/employee/my-letters")}
// // //                       style={{ background: "#f8fafc", transition: "all 0.2s" }}
// // //                       onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
// // //                       onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
// // //                     >
// // //                       <FileText className="text-info" size={20} />
// // //                       <span className="small fw-bold">View Letters</span>
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="col-12 col-lg-4">
// // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // //                   <Coffee size={120} />
// // //                 </div>
// // //                 <h5 className="fw-bold mb-3">Need a Break?</h5>
// // //                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
// // //                 <button 
// // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff", transition: "all 0.2s" }}
// // //                   onMouseEnter={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#4f46e5"; }}
// // //                   onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "#fff"; }}
// // //                   onClick={() => navigate("/holidays")}
// // //                 >
// // //                   View Calendar <ArrowRight size={14} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="row mt-4 g-4">
// // //             <div className="col-12 col-lg-6">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <div className="d-flex justify-content-between align-items-center mb-3">
// // //                   <h5 className="fw-bold d-flex align-items-center gap-2">
// // //                     <Mail size={18} className="text-primary" />
// // //                     My Letters
// // //                   </h5>
// // //                   <span className="badge bg-primary-subtle text-primary px-3 py-2">
// // //                     {letters?.length || 0}
// // //                   </span>
// // //                 </div>

// // //                 <div style={{ maxHeight: "350px", overflowY: "auto" }}>
// // //                   <table className="table table-hover align-middle mb-0">
// // //                     <thead className="table-light sticky-top">
// // //                       <tr>
// // //                         <th className="border-0">Letter</th>
// // //                         <th className="border-0">Status</th>
// // //                         <th className="border-0">Date</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {letters?.length > 0 ? (
// // //                         letters.slice(0, 5).map((l, idx) => (
// // //                           <tr key={l.id || idx}>
// // //                             <td className="fw-semibold text-capitalize">{l.letter_type}</td>
// // //                             <td>
// // //                               <span className="badge bg-success-subtle text-success px-3 py-2">
// // //                                 {l.status === "sent" ? "Received" : l.status}
// // //                               </span>
// // //                             </td>
// // //                             <td className="text-muted small">
// // //                               {new Date(l.created_at).toLocaleDateString()}
// // //                             </td>
// // //                           </tr>
// // //                         ))
// // //                       ) : (
// // //                         <tr>
// // //                           <td colSpan="3" className="text-center text-muted py-4">
// // //                             No letters found
// // //                           </td>
// // //                         </tr>
// // //                       )}
// // //                     </tbody>
// // //                   </table>
// // //                   {letters?.length > 5 && (
// // //                     <div className="text-center mt-3">
// // //                       <button className="btn btn-link btn-sm text-primary" onClick={() => navigate("/employee/my-letters")}>
// // //                         View all {letters.length} letters →
// // //                       </button>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="col-12 col-lg-6">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <div className="d-flex justify-content-between align-items-center mb-3">
// // //                   <h5 className="fw-bold d-flex align-items-center gap-2">
// // //                     <Calendar size={18} className="text-success" />
// // //                     Recent Leaves
// // //                   </h5>
// // //                   <span className="badge bg-success-subtle text-success px-3 py-2">
// // //                     {leaves?.length || 0}
// // //                   </span>
// // //                 </div>

// // //                 <div style={{ maxHeight: "350px", overflowY: "auto" }}>
// // //                   <table className="table table-hover align-middle mb-0">
// // //                     <thead className="table-light sticky-top">
// // //                       <tr>
// // //                         <th className="border-0">Type</th>
// // //                         <th className="border-0">Duration</th>
// // //                         <th className="border-0">Status</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {leaves?.length > 0 ? (
// // //                         leaves.slice(0, 5).map((l) => (
// // //                           <tr key={l.leave_id}>
// // //                             <td className="fw-semibold">{l.leave_type}</td>
// // //                             <td className="small">
// // //                               {new Date(l.start_date).toLocaleDateString()}
// // //                               <br />
// // //                               <span className="text-muted">to {new Date(l.end_date).toLocaleDateString()}</span>
// // //                             </td>
// // //                             <td>
// // //                               <span className={`badge px-3 py-2 ${
// // //                                 l.status === "Approved"
// // //                                   ? "bg-success-subtle text-success"
// // //                                   : l.status === "Rejected"
// // //                                   ? "bg-danger-subtle text-danger"
// // //                                   : "bg-warning-subtle text-warning"
// // //                               }`}>
// // //                                 {l.status}
// // //                               </span>
// // //                             </td>
// // //                           </tr>
// // //                         ))
// // //                       ) : (
// // //                         <tr>
// // //                           <td colSpan="3" className="text-center text-muted py-4">
// // //                             No leave records
// // //                           </td>
// // //                         </tr>
// // //                       )}
// // //                     </tbody>
// // //                   </table>
// // //                   {leaves?.length > 5 && (
// // //                     <div className="text-center mt-3">
// // //                       <button className="btn btn-link btn-sm text-primary" onClick={() => navigate("/leaves")}>
// // //                         View all {leaves.length} leaves →
// // //                       </button>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //         </div>
// // //       </PageContent>
// // //       <ChatbotWidget />

// // //       <style>{`
// // //         .hover-card {
// // //           transition: all 0.2s ease-in-out;
// // //         }
// // //         .hover-card:hover {
// // //           transform: translateY(-5px);
// // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // //         }
// // //         .btn-white:hover {
// // //           background: #fff !important;
// // //           color: #4f46e5 !important;
// // //         }
// // //         .table-hover tbody tr:hover {
// // //           background-color: #f8fafc;
// // //         }
// // //         ::-webkit-scrollbar {
// // //           width: 6px;
// // //         }
// // //         ::-webkit-scrollbar-track {
// // //           background: #f1f5f9;
// // //           border-radius: 10px;
// // //         }
// // //         ::-webkit-scrollbar-thumb {
// // //           background: #cbd5e1;
// // //           border-radius: 10px;
// // //         }
// // //         ::-webkit-scrollbar-thumb:hover {
// // //           background: #94a3b8;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeDashboard;
// // // import React, { useState, useEffect } from "react";
// // // import Sidebar from "../../../layouts/Sidebar";
// // // import { PageContent } from "../../../layouts/usePageLayout";
// // // import { Clock, Calendar, FileText, Star, ArrowRight, UserCheck, Coffee } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import ChatbotWidget from "../../../components/ChatbotWidget";

// // // const EmployeeDashboard = ({ selfView }) => {
// // //   const navigate = useNavigate();
// // //   const [statsData, setStatsData] = useState({
// // //     attendanceToday: "Loading...",
// // //     leaveBalance: "12 Days",
// // //     upcomingHolidays: "0",
// // //     payslipsCount: "0"
// // //   });
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchDashboardData = async () => {
// // //       try {
// // //         const token = localStorage.getItem("token");
// // //         const headers = { "x-auth-token": token };

// // //         const summaryRes = await axios.get(
// // //   selfView
// // //     ? "http://localhost:5001/api/dashboard/summary?mode=self"
// // //     : "http://localhost:5001/api/dashboard/summary",
// // //   { headers }
// // // );

// // //         if (summaryRes.data.success) {
// // //           const s = summaryRes.data.data;
// // //           setStatsData({
// // //             attendanceToday: s.attendanceToday || "Not Marked",
// // //             leaveBalance: `${s.leaveBalance ?? 12} Days`,
// // //             upcomingHolidays: String(s.upcomingHolidays || 0),
// // //             payslipsCount: String(s.payslipsCount || 0)
// // //           });
// // //         }
// // //       } catch (error) {
// // //         console.error("Error fetching employee dashboard data:", error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchDashboardData();
// // //   }, []);

// // //   const stats = [
// // //     { title: "Attendance", val: statsData.attendanceToday, icon: <Clock size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/employee/attendance" },
// // //     { title: "Leave Balance", val: statsData.leaveBalance, icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: "/employee/leaves" },
// // //     { title: "Holidays", val: statsData.upcomingHolidays, icon: <Star size={22} />, color: "#f59e0b", bg: "#fffbeb", link: "/employee/holidays" },
// // //     { title: "Payslips", val: statsData.payslipsCount, icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" }
// // //   ];

// // //   if (loading) {
// // //     return (
// // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // //         <div className="text-center">
// // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
// // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="d-flex bg-light min-vh-100">
// // //       <Sidebar />
// // //       <PageContent>
// // //         <div className="container-fluid px-3 px-md-4 py-4">
          
// // //           <div className="mb-4 pt-2">
// // //             <h2 className="fw-bold fs-2 mb-1" style={{ color: "#0f172a", letterSpacing: "-1px" }}>
// // //               Welcome back, {localStorage.getItem("name") || "Employee"}! 👋
// // //             </h2>
// // //             <p className="text-muted">
// // //               Here's a quick overview of your profile and performance for today.
// // //             </p>
// // //           </div>

// // //           <div className="row g-3 mb-4">
// // //             {stats.map((stat, idx) => (
// // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // //                 <div 
// // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // //                   onClick={() => navigate(stat.link)}
// // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // //                 >
// // //                   <div className="card-body d-flex align-items-center">
// // //                     <div 
// // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3" 
// // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // //                     >
// // //                       {stat.icon}
// // //                     </div>
// // //                     <div>
// // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>{stat.title}</p>
// // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div className="row g-4">
// // //             <div className="col-12 col-lg-8">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // //                 </h5>
// // //                 <div className="row g-3">
// // //                   <div className="col-6 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/employee/attendance")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <Clock className="text-success" />
// // //                       <span className="small fw-bold">Clock In/Out</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-6 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/employee/leaves")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <Calendar className="text-primary" />
// // //                       <span className="small fw-bold">Request Leave</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-12 col-md-4">
// // //                     <button 
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/employee/payroll")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <FileText className="text-info" />
// // //                       <span className="small fw-bold">View Payslips</span>
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="col-12 col-lg-4">
// // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // //                   <Coffee size={120} />
// // //                 </div>
// // //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// // //                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
// // //                 <button 
// // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
// // //                   onClick={() => navigate("/employee/holidays")}
// // //                 >
// // //                   View Calendar <ArrowRight size={14} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>

// // //         </div>
// // //       </PageContent>
// // //       <ChatbotWidget />

// // //       <style>{`
// // //         .hover-card:hover {
// // //           transform: translateY(-5px);
// // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // //         }
// // //         .btn-white:hover {
// // //           background: #fff !important;
// // //           color: #4f46e5 !important;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeDashboard;


// // // import React, { useState, useEffect } from "react";
// // // import Sidebar from "../../../layouts/Sidebar";
// // // import { PageContent } from "../../../layouts/usePageLayout";
// // // import {
// // //   Clock, Calendar, FileText, Star, ArrowRight, UserCheck,
// // //   Coffee, Mail, Building2, CalendarDays, Award
// // // } from "lucide-react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import ChatbotWidget from "../../../components/ChatbotWidget";
// // // import "../../../App.css";

// // // const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// // // // ── Determine if the current session is an admin acting as "Self" ──
// // // const isAdminSelfView = () => {
// // //   const role = localStorage.getItem("role");
// // //   const activeRole = localStorage.getItem("activeRole");
// // //   return role === "company_admin" && activeRole === "self";
// // // };

// // // const EmployeeDashboard = ({ selfView }) => {
// // //   const navigate = useNavigate();
// // //   const selfMode = selfView || isAdminSelfView();

// // //   const [statsData, setStatsData] = useState({
// // //     attendanceToday: "Loading...",
// // //     leaveBalance: "12 Days",
// // //     upcomingHolidays: "0",
// // //     payslipsCount: "0"
// // //   });

// // //   const [profile, setProfile] = useState({
// // //     name: "",
// // //     employee_id: "",
// // //     email: "",
// // //     employment_type: "",
// // //     designation: "",
// // //     department: "",
// // //     reporting_manager: "",
// // //   });

// // //   const [holidays, setHolidays]   = useState([]);
// // //   const [leaves, setLeaves]       = useState([]);
// // //   const [letters, setLetters]     = useState([]);
// // //   const [attendance, setAttendance] = useState({ check_in: "", check_out: "" });
// // //   const [loading, setLoading]     = useState(true);

// // //   // ── Next upcoming holiday ──
// // //   const today = new Date();
// // //   today.setHours(0, 0, 0, 0);

// // //   const nextHoliday = holidays
// // //     ?.filter((h) => new Date(h.holiday_date) >= today)
// // //     ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

// // //   const daysLeft =
// // //     nextHoliday &&
// // //     Math.ceil(
// // //       (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - today) /
// // //         (1000 * 60 * 60 * 24)
// // //     );

// // //   // ── Fetch all dashboard data ──
// // //   const fetchDashboardData = async () => {
// // //     try {
// // //       const token   = localStorage.getItem("token");
// // //       const headers = { "x-auth-token": token };

// // //       // When admin is in Self mode, scope data to their own employee record
// // //       const summaryUrl = selfMode
// // //         ? `${API}/api/dashboard/summary?mode=self`
// // //         : `${API}/api/dashboard/summary`;

// // //       const [summaryRes, profileRes, attendanceRes, holidayRes, leaveRes, letterRes] =
// // //         await Promise.all([
// // //           axios.get(summaryUrl,                        { headers }),
// // //           axios.get(`${API}/api/employees/profile`,    { headers }),
// // //           axios.get(`${API}/api/attendance/today`,     { headers }),
// // //           axios.get(`${API}/api/holidays`,             { headers }),
// // //           axios.get(`${API}/api/leaves`,               { headers }),
// // //           axios.get(`${API}/api/letters/my-letters`,   { headers }),
// // //         ]);

// // //       // Stats
// // //       const s = summaryRes.data.data;
// // //       setStatsData({
// // //         attendanceToday: s.attendanceToday || "Not Marked",
// // //         leaveBalance:    `${s.leaveBalance ?? 12} Days`,
// // //         upcomingHolidays: String(s.upcomingHolidays || 0),
// // //         payslipsCount:   String(s.payslipsCount || 0),
// // //       });

// // //       // Profile
// // //       const d = profileRes.data.data || {};
// // //       setProfile({
// // //         name:              d.name              || "Employee",
// // //         employee_id:       d.employee_id       || "--",
// // //         email:             d.email             || "Not Available",
// // //         employment_type:   d.employment_type   || "Not Specified",
// // //         designation:       d.designation_name  || d.designation_id || "Not Assigned",
// // //         department:        d.department_name   || d.department_id  || "Not Assigned",
// // //         reporting_manager: d.reporting_manager || "No Manager Assigned",
// // //       });

// // //       // Attendance
// // //       const a = attendanceRes.data.data || {};
// // //       setAttendance({
// // //         check_in:  a.check_in  || "Not Available",
// // //         check_out: a.check_out || "Not Available",
// // //       });

// // //       setHolidays(holidayRes.data.data || []);
// // //       setLeaves(leaveRes.data.data     || []);
// // //       setLetters(letterRes.data.data   || []);
// // //     } catch (error) {
// // //       console.error("Error fetching employee dashboard data:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     fetchDashboardData();
// // //   }, [selfMode]);

// // //   // ── Stat cards — links adapt to selfMode ──
// // //   const stats = [
// // //     {
// // //       title: "Attendance",
// // //       val:   statsData.attendanceToday,
// // //       icon:  <Clock size={22} />,
// // //       color: "#10b981", bg: "#ecfdf5",
// // //       link:  selfMode ? "/attendance" : "/attendance",
// // //     },
// // //     {
// // //       title: "Leave Balance",
// // //       val:   statsData.leaveBalance,
// // //       icon:  <Calendar size={22} />,
// // //       color: "#6366f1", bg: "#eef2ff",
// // //       link:  selfMode ? "/employee/leaves" : "/employee/leaves",
// // //     },
// // //     {
// // //       title: "Holidays",
// // //       val:   statsData.upcomingHolidays,
// // //       icon:  <Star size={22} />,
// // //       color: "#f59e0b", bg: "#fffbeb",
// // //       link:  selfMode ? "/employee/holidays" : "/employee/holidays",
// // //     },
// // //     {
// // //       title: "Payslips",
// // //       val:   statsData.payslipsCount,
// // //       icon:  <FileText size={22} />,
// // //       color: "#3b82f6", bg: "#eff6ff",
// // //       link:  "/employee/payroll",
// // //     },
// // //   ];

// // //   if (loading) {
// // //     return (
// // //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// // //         <div className="text-center">
// // //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
// // //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="d-flex bg-light min-vh-100">
// // //       <Sidebar />
// // //       <PageContent>
// // //         <div className="container-fluid px-3 px-md-4 py-4">

// // //           {/* ── Self-view info banner for admin ── */}
// // //           {selfMode && (
// // //             <div
// // //               className="alert d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 border-0"
// // //               style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "0.85rem" }}
// // //             >
// // //               <UserCheck size={16} />
// // //               <span>
// // //                 You are viewing your <strong>personal employee profile</strong>. Switch to{" "}
// // //                 <strong>Manager</strong> tab in the sidebar to return to admin view.
// // //               </span>
// // //             </div>
// // //           )}

// // //           {/* ── Hero profile card ── */}
// // //           <div className="row mb-5">
// // //             <div className="col-12">
// // //               <div
// // //                 className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
// // //                 style={{ background: "#eef2ff" }}
// // //               >
// // //                 <div className="row align-items-center">

// // //                   {/* Left: profile info */}
// // //                   <div className="col-12 col-lg-8">
// // //                     <div className="mb-3 text-center text-lg-start">
// // //                       <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
// // //                         Welcome back, {localStorage.getItem("name") || "Employee"} 👋
// // //                       </h2>
// // //                       <p className="fw-semibold" style={{ color: "#475569" }}>
// // //                         Here's a quick overview of your profile and performance for today.
// // //                       </p>
// // //                     </div>

// // //                     <div className="row mt-5">
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <Mail size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">{profile.email}</div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <UserCheck size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">Employee ID: {profile.employee_id}</div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <Building2 size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">{profile.department}</div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <FileText size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">{profile.designation}</div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <UserCheck size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">Manager: {profile.reporting_manager}</div>
// // //                         </div>
// // //                       </div>
// // //                       <div className="col-12 col-md-6 mb-3">
// // //                         <div className="d-flex align-items-start gap-2 profile-item">
// // //                           <CalendarDays size={16} color="#6366f1" className="mt-1 flex-shrink-0" />
// // //                           <div className="profile-text">{profile.employment_type}</div>
// // //                         </div>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                   {/* Right: avatar + today's attendance */}
// // //                   <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">
// // //                     <div
// // //                       className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
// // //                       style={{
// // //                         width: "90px", height: "90px", fontSize: "32px",
// // //                         background: "#6366f1",
// // //                         boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
// // //                       }}
// // //                     >
// // //                       {(localStorage.getItem("name") || "E").charAt(0)}
// // //                     </div>

// // //                     <h4 className="mt-3 mb-1" style={{ color: "#1e293b" }}>
// // //                       {localStorage.getItem("name") || "Employee"}
// // //                     </h4>
// // //                     <small style={{ color: "#64748b", fontSize: "14px" }}>
// // //                       {selfMode
// // //                         ? "Viewing as Employee"
// // //                         : (localStorage.getItem("role") || "Role")
// // //                             .toLowerCase()
// // //                             .replace(/\b\w/g, (c) => c.toUpperCase())}
// // //                     </small>

// // //                     <div className="mt-4 p-3 rounded-4 shadow-sm bg-white border">
// // //                       <h6 className="fw-bold mb-3 text-muted">Today's Attendance</h6>
// // //                       <div className="d-flex justify-content-between align-items-center mb-2">
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <Clock size={16} color="#10b981" />
// // //                           <span className="small fw-semibold">Check In</span>
// // //                         </div>
// // //                         <span className="badge rounded-pill bg-success-subtle text-success px-3 py-2">
// // //                           {attendance.check_in || "Not Marked"}
// // //                         </span>
// // //                       </div>
// // //                       <div className="d-flex justify-content-between align-items-center">
// // //                         <div className="d-flex align-items-center gap-2">
// // //                           <Clock size={16} color="#ef4444" />
// // //                           <span className="small fw-semibold">Check Out</span>
// // //                         </div>
// // //                         <span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2">
// // //                           {attendance.check_out || "Not Marked"}
// // //                         </span>
// // //                       </div>
// // //                     </div>
// // //                   </div>

// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* ── Stat cards ── */}
// // //           <div className="row g-3 mb-4">
// // //             {stats.map((stat, idx) => (
// // //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// // //                 <div
// // //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// // //                   onClick={() => navigate(stat.link)}
// // //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// // //                 >
// // //                   <div className="card-body d-flex align-items-center">
// // //                     <div
// // //                       className="rounded-3 d-flex align-items-center justify-content-center me-3"
// // //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// // //                     >
// // //                       {stat.icon}
// // //                     </div>
// // //                     <div>
// // //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
// // //                         {stat.title}
// // //                       </p>
// // //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>

// // //           {/* ── Next holiday banner ── */}
// // //           {!loading && nextHoliday && (
// // //             <div className="row mb-4 mt-2">
// // //               <div className="col-md-12">
// // //                 <div
// // //                   className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
// // //                   style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
// // //                 >
// // //                   <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
// // //                     Upcoming Holiday
// // //                   </span>
// // //                   <h5 className="fw-bold fs-2">
// // //                     {nextHoliday.description?.charAt(0).toUpperCase() +
// // //                       nextHoliday.description?.slice(1)}
// // //                   </h5>
// // //                   <div className="mt-2">
// // //                     <div className="d-flex align-items-center gap-2" style={{ fontSize: "15px" }}>
// // //                       <Clock size={14} />
// // //                       {new Date(nextHoliday.holiday_date).toLocaleDateString()}
// // //                     </div>
// // //                     <div className="fw-semibold mt-1" style={{ fontSize: "15px" }}>
// // //                       {daysLeft} days left
// // //                     </div>
// // //                   </div>
// // //                   <CalendarDays
// // //                     size={80}
// // //                     className="position-absolute opacity-25"
// // //                     style={{ right: "-10px", bottom: "-10px", transform: "rotate(-15deg)" }}
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* ── Quick actions + holiday spirit ── */}
// // //           <div className="row g-4 mb-4">
// // //             <div className="col-12 col-lg-8">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// // //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// // //                 </h5>
// // //                 <div className="row g-3">
// // //                   <div className="col-6 col-md-4">
// // //                     <button
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/attendance")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <Clock className="text-success" />
// // //                       <span className="small fw-bold">Clock In/Out</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-6 col-md-4">
// // //                     <button
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate(selfMode ? "/employee/leaves" : "/leaves")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <Calendar className="text-primary" />
// // //                       <span className="small fw-bold">Request Leave</span>
// // //                     </button>
// // //                   </div>
// // //                   <div className="col-12 col-md-4">
// // //                     <button
// // //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// // //                       onClick={() => navigate("/employee/my-letters")}
// // //                       style={{ background: "#f8fafc" }}
// // //                     >
// // //                       <FileText className="text-info" />
// // //                       <span className="small fw-bold">View Letters</span>
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             <div className="col-12 col-lg-4">
// // //               <div className="bg-primary text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden">
// // //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.2 }}>
// // //                   <Coffee size={120} />
// // //                 </div>
// // //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// // //                 <p className="small mb-4 opacity-75">
// // //                   Check out the upcoming holiday calendar to plan your next break!
// // //                 </p>
// // //                 <button
// // //                   className="btn btn-white btn-sm fw-bold rounded-pill px-3 py-2"
// // //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid #fff", color: "#fff" }}
// // //                   onClick={() => navigate(selfMode ? "/employee/holidays" : "/holidays")}
// // //                 >
// // //                   View Calendar <ArrowRight size={14} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* ── My Letters + My Leaves tables ── */}
// // //           <div className="row g-4">
// // //             {/* Letters */}
// // //             <div className="col-12 col-lg-6">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <div className="d-flex justify-content-between align-items-center mb-3">
// // //                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
// // //                     <Mail size={18} className="text-primary" /> My Letters
// // //                   </h5>
// // //                   <span className="badge bg-primary-subtle text-primary">
// // //                     {letters?.length || 0}
// // //                   </span>
// // //                 </div>
// // //                 <div style={{ maxHeight: "330px", overflowY: "auto" }}>
// // //                   <table className="table align-middle table-hover">
// // //                     <thead className="table-light sticky-top">
// // //                       <tr>
// // //                         <th>Letter</th>
// // //                         <th>Status</th>
// // //                         <th>Date</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {letters?.length > 0 ? (
// // //                         letters.map((l) => (
// // //                           <tr key={l.id}>
// // //                             <td className="fw-semibold text-capitalize">{l.letter_type}</td>
// // //                             <td>
// // //                               <span className="badge bg-success-subtle text-success">
// // //                                 {l.status === "sent" ? "Received" : l.status}
// // //                               </span>
// // //                             </td>
// // //                             <td>{new Date(l.created_at).toLocaleDateString()}</td>
// // //                           </tr>
// // //                         ))
// // //                       ) : (
// // //                         <tr>
// // //                           <td colSpan="3" className="text-center text-muted py-4">
// // //                             No letters found
// // //                           </td>
// // //                         </tr>
// // //                       )}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Leaves */}
// // //             <div className="col-12 col-lg-6">
// // //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// // //                 <div className="d-flex justify-content-between align-items-center mb-3">
// // //                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
// // //                     <Calendar size={18} className="text-success" /> My Leaves
// // //                   </h5>
// // //                   <span className="badge bg-success-subtle text-success">
// // //                     {leaves?.length || 0}
// // //                   </span>
// // //                 </div>
// // //                 <div style={{ maxHeight: "330px", overflowY: "auto" }}>
// // //                   <table className="table align-middle table-hover">
// // //                     <thead className="table-light sticky-top">
// // //                       <tr>
// // //                         <th>Type</th>
// // //                         <th>Duration</th>
// // //                         <th>Status</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {leaves?.length > 0 ? (
// // //                         leaves.map((l) => (
// // //                           <tr key={l.leave_id}>
// // //                             <td className="fw-semibold">{l.leave_type}</td>
// // //                             <td>
// // //                               {new Date(l.start_date).toLocaleDateString()}
// // //                               <br />
// // //                               <small className="text-muted">
// // //                                 to {new Date(l.end_date).toLocaleDateString()}
// // //                               </small>
// // //                             </td>
// // //                             <td>
// // //                               <span
// // //                                 className={`badge ${
// // //                                   l.status === "Approved"
// // //                                     ? "bg-success-subtle text-success"
// // //                                     : l.status === "Rejected"
// // //                                     ? "bg-danger-subtle text-danger"
// // //                                     : "bg-warning-subtle text-warning"
// // //                                 }`}
// // //                               >
// // //                                 {l.status}
// // //                               </span>
// // //                             </td>
// // //                           </tr>
// // //                         ))
// // //                       ) : (
// // //                         <tr>
// // //                           <td colSpan="3" className="text-center text-muted py-4">
// // //                             No leave records
// // //                           </td>
// // //                         </tr>
// // //                       )}
// // //                     </tbody>
// // //                   </table>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //         </div>
// // //       </PageContent>
// // //       <ChatbotWidget />

// // //       <style>{`
// // //         .hover-card:hover {
// // //           transform: translateY(-5px);
// // //           box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
// // //         }
// // //         .btn-white:hover {
// // //           background: #fff !important;
// // //           color: #4f46e5 !important;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // };

// // // export default EmployeeDashboard;
// // import React, { useState, useEffect, useCallback } from "react";
// // import Sidebar from "../../../layouts/Sidebar";
// // import { PageContent } from "../../../layouts/usePageLayout";
// // import {
// //   Clock, Calendar, FileText, Star, ArrowRight, UserCheck,
// //   Coffee, Mail, Building2, CalendarDays, LogIn, LogOut as LogOutIcon
// // } from "lucide-react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import ChatbotWidget from "../../../components/ChatbotWidget";
// // import "../../../App.css";

// // const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// // const isAdminSelfView = () => {
// //   const role = localStorage.getItem("role");
// //   const activeRole = localStorage.getItem("activeRole");
// //   return role === "company_admin" && activeRole === "self";
// // };

// // // ── Format time "HH:MM:SS" → "10:32 AM" ──
// // const fmtTime = (t) => {
// //   if (!t || t === "Not Available") return null;
// //   const [h, m] = t.split(":");
// //   const hr = parseInt(h, 10);
// //   const ampm = hr >= 12 ? "PM" : "AM";
// //   return `${hr % 12 || 12}:${m} ${ampm}`;
// // };

// // const EmployeeDashboard = ({ selfView }) => {
// //   const navigate  = useNavigate();
// //   const selfMode  = selfView || isAdminSelfView();

// //   const [statsData, setStatsData] = useState({
// //     attendanceToday: "Loading...",
// //     leaveBalance: "12 Days",
// //     upcomingHolidays: "0",
// //     payslipsCount: "0",
// //   });

// //   const [profile, setProfile] = useState({
// //     name: "", employee_id: "", email: "",
// //     employment_type: "", designation: "",
// //     department: "", reporting_manager: "",
// //   });

// //   const [holidays, setHolidays] = useState([]);
// //   const [leaves,   setLeaves]   = useState([]);
// //   const [letters,  setLetters]  = useState([]);

// //   // ── Attendance state ──
// //   const [attendance, setAttendance] = useState({
// //     marked:     false,
// //     status:     null,   // "present" | "absent" | null
// //     check_in:   null,
// //     check_out:  null,
// //   });
// //   const [attLoading,  setAttLoading]  = useState(false);
// //   const [attError,    setAttError]    = useState("");
// //   const [attSuccess,  setAttSuccess]  = useState("");

// //   const [loading, setLoading] = useState(true);

// //   // ── Next upcoming holiday ──
// //   const todayDate = new Date();
// //   todayDate.setHours(0, 0, 0, 0);

// //   const nextHoliday = holidays
// //     ?.filter((h) => new Date(h.holiday_date) >= todayDate)
// //     ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

// //   const daysLeft =
// //     nextHoliday &&
// //     Math.ceil(
// //       (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - todayDate) /
// //         (1000 * 60 * 60 * 24)
// //     );

// //   // ── Fetch today's attendance separately so we can refresh it ──
// //   const fetchAttendance = useCallback(async () => {
// //     try {
// //       const token   = localStorage.getItem("token");
// //       const headers = { "x-auth-token": token };
// //       const res     = await axios.get(`${API}/api/attendance/today`, { headers });
// //       if (res.data.marked) {
// //         const d = res.data.data;
// //         setAttendance({
// //           marked:    true,
// //           status:    d.status,
// //           check_in:  d.check_in  || null,
// //           check_out: d.check_out || null,
// //         });
// //       } else {
// //         setAttendance({ marked: false, status: null, check_in: null, check_out: null });
// //       }
// //     } catch {
// //       // silently ignore
// //     }
// //   }, []);

// //   // ── Main data fetch ──
// //   const fetchDashboardData = useCallback(async () => {
// //     try {
// //       const token   = localStorage.getItem("token");
// //       const headers = { "x-auth-token": token };

// //       const summaryUrl = selfMode
// //         ? `${API}/api/dashboard/summary?mode=self`
// //         : `${API}/api/dashboard/summary`;

// //       const [summaryRes, profileRes, holidayRes, leaveRes, letterRes] =
// //         await Promise.all([
// //           axios.get(summaryUrl,                      { headers }),
// //           axios.get(`${API}/api/employees/profile`,  { headers }),
// //           axios.get(`${API}/api/holidays`,           { headers }),
// //           axios.get(`${API}/api/leaves`,             { headers }),
// //           axios.get(`${API}/api/letters/my-letters`, { headers }),
// //         ]);

// //       const s = summaryRes.data.data;
// //       setStatsData({
// //         attendanceToday:  s.attendanceToday  || "Not Marked",
// //         leaveBalance:     `${s.leaveBalance ?? 12} Days`,
// //         upcomingHolidays: String(s.upcomingHolidays || 0),
// //         payslipsCount:    String(s.payslipsCount    || 0),
// //       });

// //       const d = profileRes.data.data || {};
// //       setProfile({
// //         name:              d.name              || "Employee",
// //         employee_id:       d.employee_id       || "--",
// //         email:             d.email             || "Not Available",
// //         employment_type:   d.employment_type   || "Not Specified",
// //         designation:       d.designation_name  || d.designation_id || "Not Assigned",
// //         department:        d.department_name   || d.department_id  || "Not Assigned",
// //         reporting_manager: d.reporting_manager || "No Manager Assigned",
// //       });

// //       setHolidays(holidayRes.data.data || []);
// //       setLeaves(leaveRes.data.data     || []);
// //       setLetters(letterRes.data.data   || []);

// //       await fetchAttendance();
// //     } catch (err) {
// //       console.error("Dashboard fetch error:", err);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [selfMode, fetchAttendance]);

// //   useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

// //   // ── Check-in / Check-out handler ──
// //   const handleMark = async (type) => {
// //     setAttLoading(true);
// //     setAttError("");
// //     setAttSuccess("");
// //     try {
// //       const token   = localStorage.getItem("token");
// //       const headers = { "x-auth-token": token };
// //       const res     = await axios.post(
// //         `${API}/api/attendance/mark`,
// //         { type },   // "check_in" or "check_out"
// //         { headers }
// //       );
// //       if (res.data.success || res.data.data) {
// //         setAttSuccess(
// //           type === "check_in"
// //             ? "✓ Checked in successfully!"
// //             : "✓ Checked out successfully!"
// //         );
// //         await fetchAttendance();           // refresh attendance card
// //         setTimeout(() => setAttSuccess(""), 3000);
// //       } else {
// //         setAttError(res.data.message || "Something went wrong.");
// //       }
// //     } catch (err) {
// //       setAttError(
// //         err?.response?.data?.message || "Failed to mark attendance. Try again."
// //       );
// //     } finally {
// //       setAttLoading(false);
// //     }
// //   };

// //   // ── Derived booleans for button visibility ──
// //   const canCheckIn  = !attendance.marked || (!attendance.check_in  && attendance.marked);
// //   const canCheckOut =  attendance.marked  &&  attendance.check_in  && !attendance.check_out;

// //   const stats = [
// //     { title: "Attendance",    val: statsData.attendanceToday,  icon: <Clock    size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/attendance" },
// //     { title: "Leave Balance", val: statsData.leaveBalance,     icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: selfMode ? "/employee/leaves" : "/leaves" },
// //     { title: "Holidays",      val: statsData.upcomingHolidays, icon: <Star     size={22} />, color: "#f59e0b", bg: "#fffbeb", link: selfMode ? "/employee/holidays" : "/holidays" },
// //     { title: "Payslips",      val: statsData.payslipsCount,    icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" },
// //   ];

// //   if (loading) {
// //     return (
// //       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
// //         <div className="text-center">
// //           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
// //           <p className="text-muted fw-bold">Syncing your workspace...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="d-flex bg-light min-vh-100">
// //       <Sidebar />
// //       <PageContent>
// //         <div className="container-fluid px-3 px-md-4 py-4">

// //           {/* ── Self-view banner ── */}
// //           {selfMode && (
// //             <div
// //               className="alert d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 border-0"
// //               style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "0.85rem" }}
// //             >
// //               <UserCheck size={16} />
// //               <span>
// //                 Viewing your <strong>personal employee profile</strong>. Switch to{" "}
// //                 <strong>Manager</strong> tab to return to admin view.
// //               </span>
// //             </div>
// //           )}

// //           {/* ══════════════════════════════════════════
// //               HERO CARD — profile + attendance widget
// //           ══════════════════════════════════════════ */}
// //           <div className="row mb-4">
// //             <div className="col-12">
// //               <div
// //                 className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
// //                 style={{ background: "#eef2ff" }}
// //               >
// //                 <div className="row align-items-center">

// //                   {/* ── Left: profile details ── */}
// //                   <div className="col-12 col-lg-8">
// //                     <div className="mb-3 text-center text-lg-start">
// //                       <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
// //                         Welcome back, {localStorage.getItem("name") || "Employee"} 👋
// //                       </h2>
// //                       <p className="fw-semibold" style={{ color: "#475569" }}>
// //                         Here's a quick overview of your profile and performance for today.
// //                       </p>
// //                     </div>

// //                     <div className="row mt-4">
// //                       {[
// //                         { icon: <Mail      size={16} color="#6366f1" />, text: profile.email },
// //                         { icon: <UserCheck size={16} color="#6366f1" />, text: `Employee ID: ${profile.employee_id}` },
// //                         { icon: <Building2 size={16} color="#6366f1" />, text: profile.department },
// //                         { icon: <FileText  size={16} color="#6366f1" />, text: profile.designation },
// //                         { icon: <UserCheck size={16} color="#6366f1" />, text: `Manager: ${profile.reporting_manager}` },
// //                         { icon: <CalendarDays size={16} color="#6366f1" />, text: profile.employment_type },
// //                       ].map((item, i) => (
// //                         <div key={i} className="col-12 col-md-6 mb-3">
// //                           <div className="d-flex align-items-start gap-2">
// //                             <span className="mt-1 flex-shrink-0">{item.icon}</span>
// //                             <span style={{ color: "#334155", fontSize: "0.9rem" }}>{item.text}</span>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </div>

// //                   {/* ── Right: avatar + attendance widget ── */}
// //                   <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">
// //                     {/* Avatar */}
// //                     <div
// //                       className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
// //                       style={{
// //                         width: "80px", height: "80px", fontSize: "28px",
// //                         background: "#6366f1",
// //                         boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
// //                       }}
// //                     >
// //                       {(localStorage.getItem("name") || "E").charAt(0).toUpperCase()}
// //                     </div>
// //                     <h5 className="mt-2 mb-0 fw-bold" style={{ color: "#1e293b" }}>
// //                       {localStorage.getItem("name") || "Employee"}
// //                     </h5>
// //                     <small style={{ color: "#64748b" }}>
// //                       {selfMode ? "Viewing as Employee" : "Employee"}
// //                     </small>

// //                     {/* ── Attendance card with buttons ── */}
// //                   <div
                      
// //                     >
                      

                     
// //                       {/* Success / Error messages */}
// //                       {attSuccess && (
// //                         <div className="rounded-3 px-2 py-1 mb-2 text-center"
// //                           style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.78rem", fontWeight: 600 }}>
// //                           {attSuccess}
// //                         </div>
// //                       )}
// //                       {attError && (
// //                         <div className="rounded-3 px-2 py-1 mb-2 text-center"
// //                           style={{ background: "#fee2e2", color: "#dc2626", fontSize: "0.78rem", fontWeight: 600 }}>
// //                           {attError}
// //                         </div>
// //                       )}

                     

// //                       {/* Already checked out message */}
// //                       {attendance.check_in && attendance.check_out && (
// //                         <p className="text-center mt-2 mb-0"
// //                           style={{ fontSize: "0.75rem", color: "#64748b" }}>
// //                           ✓ Attendance complete for today
// //                         </p>
// //                       )}
// //                     </div>
// //                   </div>

// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── Stat cards ── */}
// //           <div className="row g-3 mb-4">
// //             {stats.map((stat, idx) => (
// //               <div key={idx} className="col-12 col-sm-6 col-xl-3">
// //                 <div
// //                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
// //                   onClick={() => navigate(stat.link)}
// //                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
// //                 >
// //                   <div className="card-body d-flex align-items-center">
// //                     <div
// //                       className="rounded-3 d-flex align-items-center justify-content-center me-3"
// //                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
// //                     >
// //                       {stat.icon}
// //                     </div>
// //                     <div>
// //                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
// //                         {stat.title}
// //                       </p>
// //                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* ── Next holiday banner ── */}
// //           {nextHoliday && (
// //             <div className="row mb-4">
// //               <div className="col-12">
// //                 <div
// //                   className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
// //                   style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
// //                 >
// //                   <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
// //                     Upcoming Holiday
// //                   </span>
// //                   <h5 className="fw-bold fs-2">
// //                     {nextHoliday.description?.charAt(0).toUpperCase() +
// //                       nextHoliday.description?.slice(1)}
// //                   </h5>
// //                   <div className="d-flex align-items-center gap-3 mt-2" style={{ fontSize: "0.9rem" }}>
// //                     <span><Clock size={14} className="me-1" />{new Date(nextHoliday.holiday_date).toLocaleDateString()}</span>
// //                     <span className="fw-bold">{daysLeft} days left</span>
// //                   </div>
// //                   <CalendarDays
// //                     size={80}
// //                     className="position-absolute opacity-25"
// //                     style={{ right: "-10px", bottom: "-10px", transform: "rotate(-15deg)" }}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //           )}

// //           {/* ── Quick actions + holiday spirit ── */}
// //           <div className="row g-4 mb-4">
// //             <div className="col-12 col-lg-8">
// //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// //                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
// //                   <UserCheck size={20} className="text-primary" /> Quick Actions
// //                 </h5>
// //                 <div className="row g-3">
// //                   <div className="col-6 col-md-4">
// //                     <button
// //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// //                       onClick={() => navigate("/attendance")}
// //                       style={{ background: "#f8fafc" }}
// //                     >
// //                       <Clock className="text-success" />
// //                       <span className="small fw-bold">Attendance</span>
// //                     </button>
// //                   </div>
// //                   <div className="col-6 col-md-4">
// //                     <button
// //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// //                       onClick={() => navigate(selfMode ? "/employee/leaves" : "/leaves")}
// //                       style={{ background: "#f8fafc" }}
// //                     >
// //                       <Calendar className="text-primary" />
// //                       <span className="small fw-bold">Request Leave</span>
// //                     </button>
// //                   </div>
// //                   <div className="col-12 col-md-4">
// //                     <button
// //                       className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
// //                       onClick={() => navigate("/employee/my-letters")}
// //                       style={{ background: "#f8fafc" }}
// //                     >
// //                       <FileText className="text-info" />
// //                       <span className="small fw-bold">My Letters</span>
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="col-12 col-lg-4">
// //               <div
// //                 className="text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden"
// //                 style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}
// //               >
// //                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.15 }}>
// //                   <Coffee size={120} />
// //                 </div>
// //                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
// //                 <p className="small mb-4 opacity-75">
// //                   Check out the upcoming holiday calendar to plan your next break!
// //                 </p>
// //                 <button
// //                   className="btn btn-sm fw-bold rounded-pill px-3 py-2"
// //                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
// //                   onClick={() => navigate(selfMode ? "/employee/holidays" : "/holidays")}
// //                 >
// //                   View Calendar <ArrowRight size={14} className="ms-1" />
// //                 </button>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── Letters + Leaves tables ── */}
// //           <div className="row g-4">
// //             <div className="col-12 col-lg-6">
// //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// //                 <div className="d-flex justify-content-between align-items-center mb-3">
// //                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
// //                     <Mail size={18} className="text-primary" /> My Letters
// //                   </h5>
// //                   <span className="badge bg-primary-subtle text-primary">{letters?.length || 0}</span>
// //                 </div>
// //                 <div style={{ maxHeight: "300px", overflowY: "auto" }}>
// //                   <table className="table align-middle table-hover">
// //                     <thead className="table-light sticky-top">
// //                       <tr><th>Letter</th><th>Status</th><th>Date</th></tr>
// //                     </thead>
// //                     <tbody>
// //                       {letters?.length > 0 ? letters.map((l) => (
// //                         <tr key={l.id}>
// //                           <td className="fw-semibold text-capitalize">{l.letter_type}</td>
// //                           <td><span className="badge bg-success-subtle text-success">{l.status === "sent" ? "Received" : l.status}</span></td>
// //                           <td>{new Date(l.created_at).toLocaleDateString()}</td>
// //                         </tr>
// //                       )) : (
// //                         <tr><td colSpan="3" className="text-center text-muted py-4">No letters found</td></tr>
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="col-12 col-lg-6">
// //               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
// //                 <div className="d-flex justify-content-between align-items-center mb-3">
// //                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
// //                     <Calendar size={18} className="text-success" /> My Leaves
// //                   </h5>
// //                   <span className="badge bg-success-subtle text-success">{leaves?.length || 0}</span>
// //                 </div>
// //                 <div style={{ maxHeight: "300px", overflowY: "auto" }}>
// //                   <table className="table align-middle table-hover">
// //                     <thead className="table-light sticky-top">
// //                       <tr><th>Type</th><th>Duration</th><th>Status</th></tr>
// //                     </thead>
// //                     <tbody>
// //                       {leaves?.length > 0 ? leaves.map((l) => (
// //                         <tr key={l.leave_id}>
// //                           <td className="fw-semibold">{l.leave_type}</td>
// //                           <td>
// //                             {new Date(l.start_date).toLocaleDateString()}
// //                             <br />
// //                             <small className="text-muted">to {new Date(l.end_date).toLocaleDateString()}</small>
// //                           </td>
// //                           <td>
// //                             <span className={`badge ${
// //                               l.status === "Approved"  ? "bg-success-subtle text-success" :
// //                               l.status === "Rejected"  ? "bg-danger-subtle text-danger"   :
// //                                                          "bg-warning-subtle text-warning"
// //                             }`}>{l.status}</span>
// //                           </td>
// //                         </tr>
// //                       )) : (
// //                         <tr><td colSpan="3" className="text-center text-muted py-4">No leave records</td></tr>
// //                       )}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //         </div>
// //       </PageContent>
// //       <ChatbotWidget />

// //       <style>{`
// //         .hover-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default EmployeeDashboard;
// import React, { useState, useEffect, useCallback } from "react";
// import Sidebar from "../../../layouts/Sidebar";
// import { PageContent } from "../../../layouts/usePageLayout";
// import {
//   Clock, Calendar, FileText, Star, ArrowRight, UserCheck,
//   Coffee, Mail, Building2, CalendarDays
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ChatbotWidget from "../../../components/ChatbotWidget";
// import "../../../App.css";

// const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// const isAdminSelfView = () => {
//   const role       = localStorage.getItem("role");
//   const activeRole = localStorage.getItem("activeRole");
//   return role === "company_admin" && activeRole === "self";
// };

// const fmtTime = (t) => {
//   if (!t || t === "Not Available") return null;
//   const [h, m] = t.split(":");
//   const hr   = parseInt(h, 10);
//   const ampm = hr >= 12 ? "PM" : "AM";
//   return `${hr % 12 || 12}:${m} ${ampm}`;
// };

// const EmployeeDashboard = ({ selfView }) => {
//   const navigate = useNavigate();
//   const selfMode = selfView || isAdminSelfView();

//   const [statsData, setStatsData] = useState({
//     attendanceToday:  "Loading...",
//     leaveBalance:     "12 Days",
//     upcomingHolidays: "0",
//     payslipsCount:    "0",
//   });

//   const [profile, setProfile] = useState({
//     name:              "",
//     employee_id:       "",
//     email:             "",
//     employment_type:   "",
//     designation:       "",
//     department:        "",
//     reporting_manager: "",
//     avatar:            null,   // ← stores the full avatar URL from the server
//   });

//   const [holidays,   setHolidays]   = useState([]);
//   const [leaves,     setLeaves]     = useState([]);
//   const [letters,    setLetters]    = useState([]);
//   const [attendance, setAttendance] = useState({ check_in: null, check_out: null });
//   const [loading,    setLoading]    = useState(true);
//   const [avatarErr,  setAvatarErr]  = useState(false);

//   // ── Next upcoming holiday ──
//   const todayDate = new Date();
//   todayDate.setHours(0, 0, 0, 0);

//   const nextHoliday = holidays
//     ?.filter((h) => new Date(h.holiday_date) >= todayDate)
//     ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];

//   const daysLeft =
//     nextHoliday &&
//     Math.ceil(
//       (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - todayDate) /
//         (1000 * 60 * 60 * 24)
//     );

//   // ── Fetch today's attendance ──
//   const fetchAttendance = useCallback(async () => {
//     try {
//       const token   = localStorage.getItem("token");
//       const headers = { "x-auth-token": token };
//       const res     = await axios.get(`${API}/api/attendance/today`, { headers });
//       if (res.data.marked) {
//         const d = res.data.data;
//         setAttendance({ check_in: d.check_in || null, check_out: d.check_out || null });
//       } else {
//         setAttendance({ check_in: null, check_out: null });
//       }
//     } catch { /* ignore */ }
//   }, []);

//   // ── Main data fetch ──
//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const token   = localStorage.getItem("token");
//       const headers = { "x-auth-token": token };

//       const summaryUrl = selfMode
//         ? `${API}/api/dashboard/summary?mode=self`
//         : `${API}/api/dashboard/summary`;

//       const [summaryRes, profileRes, holidayRes, leaveRes, letterRes] =
//         await Promise.all([
//           axios.get(summaryUrl,                      { headers }),
//           axios.get(`${API}/api/employees/profile`,  { headers }),
//           axios.get(`${API}/api/holidays`,           { headers }),
//           axios.get(`${API}/api/leaves`,             { headers }),
//           axios.get(`${API}/api/letters/my-letters`, { headers }),
//         ]);

//       // Stats
//       const s = summaryRes.data.data;
//       setStatsData({
//         attendanceToday:  s.attendanceToday  || "Not Marked",
//         leaveBalance:     `${s.leaveBalance ?? 12} Days`,
//         upcomingHolidays: String(s.upcomingHolidays || 0),
//         payslipsCount:    String(s.payslipsCount    || 0),
//       });

//       // Profile — including avatar URL returned by the backend
//       const d = profileRes.data.data || {};
//       setProfile({
//         name:              d.name              || "Employee",
//         employee_id:       d.employee_id       || "--",
//         email:             d.email             || "Not Available",
//         employment_type:   d.employment_type   || "Not Specified",
//         designation:       d.designation_name  || d.designation_id || "Not Assigned",
//         department:        d.department_name   || d.department_id  || "Not Assigned",
//         reporting_manager: d.reporting_manager || "No Manager Assigned",
//         avatar:            d.avatar            || null,  // ← full URL from backend
//       });
//       setAvatarErr(false);

//       setHolidays(holidayRes.data.data || []);
//       setLeaves(leaveRes.data.data     || []);
//       setLetters(letterRes.data.data   || []);

//       await fetchAttendance();
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [selfMode, fetchAttendance]);

//   useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

//   const stats = [
//     { title: "Attendance",    val: statsData.attendanceToday,  icon: <Clock    size={22} />, color: "#10b981", bg: "#ecfdf5", link: "/attendance" },
//     { title: "Leave Balance", val: statsData.leaveBalance,     icon: <Calendar size={22} />, color: "#6366f1", bg: "#eef2ff", link: selfMode ? "/employee/leaves" : "/leaves" },
//     { title: "Holidays",      val: statsData.upcomingHolidays, icon: <Star     size={22} />, color: "#f59e0b", bg: "#fffbeb", link: selfMode ? "/employee/holidays" : "/holidays" },
//     { title: "Payslips",      val: statsData.payslipsCount,    icon: <FileText size={22} />, color: "#3b82f6", bg: "#eff6ff", link: "/employee/payroll" },
//   ];

//   if (loading) {
//     return (
//       <div className="d-flex bg-light min-vh-100 align-items-center justify-content-center">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
//           <p className="text-muted fw-bold">Syncing your workspace...</p>
//         </div>
//       </div>
//     );
//   }

//   const showAvatar = profile.avatar && !avatarErr;

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <PageContent>
//         <div className="container-fluid px-3 px-md-4 py-4">

//           {/* ── Self-view banner ── */}
//           {selfMode && (
//             <div
//               className="alert d-flex align-items-center gap-2 mb-3 py-2 px-3 rounded-3 border-0"
//               style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: "0.85rem" }}
//             >
//               <UserCheck size={16} />
//               <span>
//                 Viewing your <strong>personal employee profile</strong>. Switch to{" "}
//                 <strong>Manager</strong> tab to return to admin view.
//               </span>
//             </div>
//           )}

//           {/* ══════════════════════════════════════════════════════════
//               HERO CARD — profile details + avatar (with real photo)
//           ══════════════════════════════════════════════════════════ */}
//           <div className="row mb-4">
//             <div className="col-12">
//               <div
//                 className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
//                 style={{ background: "#eef2ff" }}
//               >
//                 <div className="row align-items-center">

//                   {/* ── Left: profile details ── */}
//                   <div className="col-12 col-lg-8">
//                     <div className="mb-3 text-center text-lg-start">
//                       <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
//                         Welcome back, {localStorage.getItem("name") || profile.name} 👋
//                       </h2>
//                       <p className="fw-semibold" style={{ color: "#475569" }}>
//                         Here's a quick overview of your profile and performance for today.
//                       </p>
//                     </div>

//                     <div className="row mt-4">
//                       {[
//                         { icon: <Mail         size={16} color="#6366f1" />, text: profile.email },
//                         { icon: <UserCheck    size={16} color="#6366f1" />, text: `Employee ID: ${profile.employee_id}` },
//                         { icon: <Building2    size={16} color="#6366f1" />, text: profile.department },
//                         { icon: <FileText     size={16} color="#6366f1" />, text: profile.designation },
//                         { icon: <UserCheck    size={16} color="#6366f1" />, text: `Manager: ${profile.reporting_manager}` },
//                         { icon: <CalendarDays size={16} color="#6366f1" />, text: profile.employment_type },
//                       ].map((item, i) => (
//                         <div key={i} className="col-12 col-md-6 mb-3">
//                           <div className="d-flex align-items-start gap-2">
//                             <span className="mt-1 flex-shrink-0">{item.icon}</span>
//                             <span style={{ color: "#334155", fontSize: "0.9rem" }}>{item.text}</span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* ── Right: avatar + attendance ── */}
//                   <div className="col-12 col-lg-4 text-center mt-4 mt-lg-0">

//                     {/* ── Avatar: real photo if set, else coloured initial ── */}
//                     <div style={{ position: "relative", display: "inline-block", marginBottom: "8px" }}>
//                       {showAvatar ? (
//                         <img
//                           src={profile.avatar}
//                           alt="profile"
//                           onError={() => setAvatarErr(true)}
//                           style={{
//                             width: "90px",
//                             height: "90px",
//                             borderRadius: "50%",
//                             objectFit: "cover",
//                             boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
//                             border: "4px solid #fff",
//                             outline: "2px solid rgba(99,102,241,0.2)",
//                           }}
//                         />
//                       ) : (
//                         <div
//                           className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
//                           style={{
//                             width: "90px",
//                             height: "90px",
//                             fontSize: "32px",
//                             background: "#6366f1",
//                             boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
//                             border: "4px solid #fff",
//                           }}
//                         >
//                           {(localStorage.getItem("name") || profile.name || "E").charAt(0).toUpperCase()}
//                         </div>
//                       )}
//                     </div>

//                     <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
//                       {localStorage.getItem("name") || profile.name}
//                     </h5>
//                     <small style={{ color: "#64748b" }}>
//                       {selfMode ? "Viewing as Employee" : "Employee"}
//                     </small>

//                     {/* Today's attendance summary */}
//                     <div className="mt-3 p-3 rounded-4 shadow-sm bg-white border">
//                       <h6 className="fw-bold mb-3 text-muted" style={{ fontSize: "0.8rem" }}>Today's Attendance</h6>
//                       <div className="d-flex justify-content-between align-items-center mb-2">
//                         <div className="d-flex align-items-center gap-2">
//                           <Clock size={15} color="#10b981" />
//                           <span className="small fw-semibold">Check In</span>
//                         </div>
//                         <span
//                           className="badge rounded-pill px-3 py-2"
//                           style={{
//                             background: attendance.check_in ? "#dcfce7" : "#fee2e2",
//                             color:      attendance.check_in ? "#15803d" : "#dc2626",
//                             fontSize: "0.75rem",
//                           }}
//                         >
//                           {fmtTime(attendance.check_in) || "Not Marked"}
//                         </span>
//                       </div>
//                       <div className="d-flex justify-content-between align-items-center">
//                         <div className="d-flex align-items-center gap-2">
//                           <Clock size={15} color="#ef4444" />
//                           <span className="small fw-semibold">Check Out</span>
//                         </div>
//                         <span
//                           className="badge rounded-pill px-3 py-2"
//                           style={{
//                             background: attendance.check_out ? "#dcfce7" : "#fee2e2",
//                             color:      attendance.check_out ? "#15803d" : "#dc2626",
//                             fontSize: "0.75rem",
//                           }}
//                         >
//                           {fmtTime(attendance.check_out) || "Not Marked"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* ── Stat cards ── */}
//           <div className="row g-3 mb-4">
//             {stats.map((stat, idx) => (
//               <div key={idx} className="col-12 col-sm-6 col-xl-3">
//                 <div
//                   className="card border-0 shadow-sm rounded-4 h-100 p-2 hover-card"
//                   onClick={() => navigate(stat.link)}
//                   style={{ cursor: "pointer", transition: "transform 0.2s" }}
//                 >
//                   <div className="card-body d-flex align-items-center">
//                     <div
//                       className="rounded-3 d-flex align-items-center justify-content-center me-3"
//                       style={{ width: "56px", height: "56px", backgroundColor: stat.bg, color: stat.color }}
//                     >
//                       {stat.icon}
//                     </div>
//                     <div>
//                       <p className="text-muted small fw-bold text-uppercase mb-1" style={{ letterSpacing: "0.5px" }}>
//                         {stat.title}
//                       </p>
//                       <h4 className="fw-bold mb-0" style={{ color: "#1e293b" }}>{stat.val}</h4>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ── Next holiday banner ── */}
//           {nextHoliday && (
//             <div className="row mb-4">
//               <div className="col-12">
//                 <div
//                   className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
//                   style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}
//                 >
//                   <span className="badge mb-2" style={{ background: "rgba(255,255,255,0.2)" }}>
//                     Upcoming Holiday
//                   </span>
//                   <h5 className="fw-bold fs-2">
//                     {nextHoliday.description?.charAt(0).toUpperCase() + nextHoliday.description?.slice(1)}
//                   </h5>
//                   <div className="d-flex align-items-center gap-3 mt-2" style={{ fontSize: "0.9rem" }}>
//                     <span><Clock size={14} className="me-1" />{new Date(nextHoliday.holiday_date).toLocaleDateString()}</span>
//                     <span className="fw-bold">{daysLeft} days left</span>
//                   </div>
//                   <CalendarDays
//                     size={80}
//                     className="position-absolute opacity-25"
//                     style={{ right: "-10px", bottom: "-10px", transform: "rotate(-15deg)" }}
//                   />
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── Quick actions + holiday spirit ── */}
//           <div className="row g-4 mb-4">
//             <div className="col-12 col-lg-8">
//               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
//                 <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
//                   <UserCheck size={20} className="text-primary" /> Quick Actions
//                 </h5>
//                 <div className="row g-3">
//                   {[
//                     { label: "Attendance",     icon: <Clock     className="text-success"   size={20} />, path: "/attendance" },
//                     { label: "Request Leave",  icon: <Calendar  className="text-primary"   size={20} />, path: selfMode ? "/employee/leaves" : "/leaves" },
//                     { label: "My Letters",     icon: <FileText  className="text-info"      size={20} />, path: "/employee/my-letters" },
//                   ].map((btn) => (
//                     <div key={btn.label} className="col-6 col-md-4">
//                       <button
//                         className="btn btn-light w-100 py-3 rounded-4 border-0 d-flex flex-column align-items-center gap-2"
//                         onClick={() => navigate(btn.path)}
//                         style={{ background: "#f8fafc" }}
//                         onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
//                         onMouseLeave={(e) => e.currentTarget.style.background = "#f8fafc"}
//                       >
//                         {btn.icon}
//                         <span className="small fw-bold">{btn.label}</span>
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-lg-4">
//               <div
//                 className="text-white rounded-4 shadow-sm p-4 h-100 position-relative overflow-hidden"
//                 style={{ background: "linear-gradient(135deg,#6366f1,#818cf8)" }}
//               >
//                 <div style={{ position: "absolute", right: "-20px", bottom: "-20px", opacity: 0.15 }}>
//                   <Coffee size={120} />
//                 </div>
//                 <h5 className="fw-bold mb-3">Holiday Spirit</h5>
//                 <p className="small mb-4 opacity-75">Check out the upcoming holiday calendar to plan your next break!</p>
//                 <button
//                   className="btn btn-sm fw-bold rounded-pill px-3 py-2"
//                   style={{ background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.5)", color: "#fff" }}
//                   onClick={() => navigate(selfMode ? "/employee/holidays" : "/holidays")}
//                 >
//                   View Calendar <ArrowRight size={14} className="ms-1" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ── Letters + Leaves tables ── */}
//           <div className="row g-4">
//             <div className="col-12 col-lg-6">
//               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
//                     <Mail size={18} className="text-primary" /> My Letters
//                   </h5>
//                   <span className="badge bg-primary-subtle text-primary">{letters?.length || 0}</span>
//                 </div>
//                 <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//                   <table className="table align-middle table-hover">
//                     <thead className="table-light sticky-top">
//                       <tr><th>Letter</th><th>Status</th><th>Date</th></tr>
//                     </thead>
//                     <tbody>
//                       {letters?.length > 0 ? letters.map((l) => (
//                         <tr key={l.id}>
//                           <td className="fw-semibold text-capitalize">{l.letter_type}</td>
//                           <td><span className="badge bg-success-subtle text-success">{l.status === "sent" ? "Received" : l.status}</span></td>
//                           <td className="text-muted small">{new Date(l.created_at).toLocaleDateString()}</td>
//                         </tr>
//                       )) : (
//                         <tr><td colSpan="3" className="text-center text-muted py-4">No letters found</td></tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>

//             <div className="col-12 col-lg-6">
//               <div className="bg-white rounded-4 border shadow-sm p-4 h-100">
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h5 className="fw-bold d-flex align-items-center gap-2 mb-0">
//                     <Calendar size={18} className="text-success" /> My Leaves
//                   </h5>
//                   <span className="badge bg-success-subtle text-success">{leaves?.length || 0}</span>
//                 </div>
//                 <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//                   <table className="table align-middle table-hover">
//                     <thead className="table-light sticky-top">
//                       <tr><th>Type</th><th>Duration</th><th>Status</th></tr>
//                     </thead>
//                     <tbody>
//                       {leaves?.length > 0 ? leaves.map((l) => (
//                         <tr key={l.leave_id}>
//                           <td className="fw-semibold">{l.leave_type}</td>
//                           <td className="small">
//                             {new Date(l.start_date).toLocaleDateString()}
//                             <br /><span className="text-muted">to {new Date(l.end_date).toLocaleDateString()}</span>
//                           </td>
//                           <td>
//                             <span className={`badge ${
//                               l.status === "Approved" ? "bg-success-subtle text-success" :
//                               l.status === "Rejected" ? "bg-danger-subtle text-danger"   :
//                                                         "bg-warning-subtle text-warning"
//                             }`}>{l.status}</span>
//                           </td>
//                         </tr>
//                       )) : (
//                         <tr><td colSpan="3" className="text-center text-muted py-4">No leave records</td></tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </PageContent>
//       <ChatbotWidget />

//       <style>{`
//         .hover-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
//         ::-webkit-scrollbar { width: 5px; }
//         ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
//         ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default EmployeeDashboard;
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

  // ── Mark attendance — same payload as MarkAttendancePage ──
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

          {/* Hero card */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="p-3 p-md-4 p-lg-5 rounded-4 shadow-sm" style={{ background: "#eef2ff" }}>
                <div className="row align-items-center">

                  {/* Left: profile */}
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

                  {/* Right: avatar + attendance */}
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

                    {/* Attendance card */}
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

          {/* Stat cards */}
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

          {/* Holiday banner */}
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

          {/* Quick actions */}
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

          {/* Letters + Leaves */}
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