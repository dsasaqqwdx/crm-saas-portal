
// import React, { useState, useEffect } from "react";
// import { Users, Building2, CheckCircle, CalendarRange, ArrowUpRight } from "lucide-react";
// import axios from "axios";
// import Sidebar from "../../../layouts/Sidebar"; 
// import { PageContent } from "../../../layouts/usePageLayout";

// const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

// const Dashboard = () => {
//   const [statsData, setStatsData] = useState({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, totalCompanies: 0 });
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [adminName, setAdminName] = useState("Admin");

//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const headers = { "x-auth-token": token };
//         try {
//           const payload = JSON.parse(atob(token.split(".")[1]));
//           if (payload.name) setAdminName(payload.name.split(" ")[0]);
//         } catch {}
        
//         const [sumRes, empRes] = await Promise.all([
//           axios.get(`${API}/api/dashboard/summary`, { headers }),
//           axios.get(`${API}/api/employees`, { headers }),
//         ]);
//         setStatsData(sumRes.data.data || {});
//         setEmployees(empRes.data.data || []);
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAll();
//   }, []);

//   const getTimeGreeting = () => {
//     const h = new Date().getHours();
//     if (h < 12) return "Good Morning";
//     if (h < 17) return "Good Afternoon";
//     return "Good Evening";
//   };

//   const stats = [
//     { title: "Total Talent", value: statsData.totalEmployees, icon: Users, color: "#6366f1", bg: "#f5f3ff" },
//     { title: "Active Today", value: statsData.presentToday, icon: CheckCircle, color: "#10b981", bg: "#f0fdf4" },
//     { title: "Pending Requests", value: statsData.pendingLeaves, icon: CalendarRange, color: "#f59e0b", bg: "#fffbeb" },
//     { title: "Partner Entities", value: statsData.totalCompanies, icon: Building2, color: "#3b82f6", bg: "#eff6ff" },
//   ];

//   return (
//     <div className="d-flex bg-light min-vh-100">
//       <Sidebar />
//       <PageContent>
//         <div className="container-fluid px-3 px-md-4 py-4">
          
//           {/* Header Section */}
//           <div className="mb-4">
//             <h1 className="fw-bold fs-3 mb-1" style={{ color: "#0f172a", letterSpacing: "-0.5px" }}>
//               {getTimeGreeting()}, {adminName}
//             </h1>
//             <p className="text-muted small">Here's what's happening with your workspace today.</p>
//           </div>

//           {/* Stats Grid */}
//           <div className="row g-3 mb-4">
//             {stats.map((stat, i) => (
//               <div key={i} className="col-12 col-sm-6 col-xl-3">
//                 <div className="p-4 h-100" style={{ background: "#fff", borderRadius: "18px", border: "1px solid #f1f5f9" }}>
//                   <div style={{ 
//                     width: "44px", height: "44px", borderRadius: "12px", 
//                     backgroundColor: stat.bg, color: stat.color, 
//                     display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" 
//                   }}>
//                     <stat.icon size={20} />
//                   </div>
//                   <span className="text-muted fw-semibold" style={{ fontSize: "14px" }}>{stat.title}</span>
//                   <div className="d-flex align-items-baseline gap-2 mt-1">
//                     <h3 className="fw-bold mb-0" style={{ fontSize: "28px", color: "#1e293b" }}>{stat.value || 0}</h3>
//                     <div className="d-flex align-items-center px-2 py-1 rounded-2" style={{ fontSize: "12px", color: "#10b981", fontWeight: "700", background: "#f0fdf4" }}>
//                       <ArrowUpRight size={14} /> 8%
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Table Section */}
//           <div className="p-3 p-md-4" style={{ background: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h3 className="fw-bold mb-0" style={{ fontSize: "20px", color: "#1e293b" }}>Employee Directory</h3>
//             </div>

//             <div className="table-responsive">
//               <table className="table align-middle">
//                 <thead>
//                   <tr style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
//                     <th className="border-0 pb-3">Employee Identity</th>
//                     <th className="border-0 pb-3">Digital Contact</th>
//                     <th className="border-0 pb-3">Department</th>
//                     <th className="border-0 pb-3">Availability</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loading ? (
//                     <tr><td colSpan="4" className="text-center py-5 text-muted">Synchronizing database...</td></tr>
//                   ) : employees.length > 0 ? (
//                     employees.map((emp, i) => (
//                       <tr key={i} style={{ cursor: "pointer" }}>
//                         <td className="py-3">
//                           <div className="d-flex align-items-center">
//                             <div style={{ 
//                               width: "36px", height: "36px", borderRadius: "10px", 
//                               background: "#6366f1", color: "#fff", 
//                               display: "inline-flex", alignItems: "center", justifyContent: "center", 
//                               marginRight: "12px", fontWeight: "700" 
//                             }}>
//                               {emp.name.charAt(0)}
//                             </div>
//                             <span className="fw-bold" style={{ color: "#1e293b" }}>{emp.name}</span>
//                           </div>
//                         </td>
//                         <td className="py-3" style={{ fontSize: "14px" }}>{emp.email}</td>
//                         <td className="py-3">
//                           <span className="fw-medium" style={{ color: "#64748b", fontSize: "14px" }}>Operations</span>
//                         </td>
//                         <td className="py-3">
//                           <div className="d-flex align-items-center gap-2" style={{ color: "#10b981", fontWeight: "700", fontSize: "12px" }}>
//                             <div style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }}></div>
//                             On Duty
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr><td colSpan="4" className="text-center py-5 text-muted">No records found.</td></tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </PageContent>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import {
Users,
Building2,
CheckCircle,
CalendarRange,
Check,
XCircle,
AlertCircle,
Download,
CalendarDays,
Clock,
Trash2,
Edit2,
Info,
MapPin,
Phone,
Mail,
} from "lucide-react";
import axios from "axios";
import Sidebar from "../../../layouts/Sidebar";
import { PageContent } from "../../../layouts/usePageLayout";
import Api from "../../../api/api";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

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
  const [editItem, setEditItem] = useState(null);
    const [formName, setFormName] = useState("");
const [search, setSearch] = useState("");
  const [formError, setFormError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
      const [deleteConfirm, setDeleteConfirm] = useState(null);
        const [toast, setToast] = useState(null);
          const [tickets, setTickets] = useState([]);
            const [transactions, setTransactions] = useState([]);

              const [profile, setProfile] = useState({
                name: "", email: "", phone: "", department: "",
                role: "Admin", joined: "", avatar: "",
              });

const role = localStorage.getItem("role");
const isAdmin = role === "company_admin" || role === "super_admin";


  const showToast = (message, type = "success") => {
  setToast({ message, type });
  setTimeout(() => setToast(null), 3000);
};

const openEdit = (dept) => { setEditItem(dept); setFormName(dept.department_name); setFormError(""); setModalOpen(true); };


  const fmtAmount = (a) => "₹" + Number(a).toLocaleString("en-IN");
    const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


const today = new Date();
today.setHours(0, 0, 0, 0);

const nextHoliday = holidays
  ?.filter((h) => new Date(h.holiday_date) >= today)
  ?.sort((a, b) => new Date(a.holiday_date) - new Date(b.holiday_date))[0];



  const filtered = departments.filter((d) =>
  d.department_name.toLowerCase().includes(search.toLowerCase())
);

const daysLeft =
  nextHoliday &&
  Math.ceil(
    (new Date(nextHoliday.holiday_date).setHours(0, 0, 0, 0) - today) /
      (1000 * 60 * 60 * 24)
  );

    const deleteDesignation = async (id) => {
  if (window.confirm("Are you sure you want to remove this role?")) {
    try {
      await axios.delete(`http://localhost:5001/api/designations/${id}`);
      fetchAllData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete designation");
    }
  }
};



const getBadgeStyle = (status) => ({
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  backgroundColor: status === "Present" ? "#dcfce7" : "#fef3c7",
  color: status === "Present" ? "#15803d" : "#b45309",
});



const STATUS_STYLE = {
approved: { bg: "#dcfce7", text: "#16a34a" },
pending: { bg: "#fef9c3", text: "#a16207" },
rejected: { bg: "#fee2e2", text: "#dc2626" },
};

const getStatusBadge = (status) => {
  const configs = {
    Approved: { bg: "#dcfce7", color: "#16a34a", icon: <Check size={12} /> },
    Rejected: { bg: "#fee2e2", color: "#ef4444", icon: <XCircle size={12} /> },
    Pending: { bg: "#fef3c7", color: "#d97706", icon: <AlertCircle size={12} /> },
  };
  const style = configs[status] || configs.Pending;
  return (
    <span
      className="badge d-inline-flex align-items-center gap-1 rounded-pill px-3 py-2"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        fontSize: "12px",
        fontWeight: "600",
      }}
    >
      {style.icon} {status}
    </span>
  );
};

useEffect(() => {
  fetchAllData();
}, []);





const fetchAllData = async () => {
  try {
    const token = localStorage.getItem("token");
    const headers = { "x-auth-token": token };

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.name) setAdminName(payload.name.split(" ")[0]);
    } catch {}

    const [summary, employeeList, attendanceList, holidayList, leavesList, payrollList,departmentList,designationList,ticketList,paymentList,profile] =
      await Promise.all([
        axios.get(`${API}/api/dashboard/summary`, { headers }),
        axios.get(`${API}/api/employees`, { headers }),
        Api.get("/attendance/all"),
        axios.get(`${API}/api/holidays`, { headers }),
        axios.get(`${API}/api/leaves`, { headers }),
        axios.get(`${API}/api/payroll`, { headers }),
        axios.get(`${API}/api/departments`, { headers }),
        axios.get(`${API}/api/designations`, { headers }),
        axios.get(`${API}/api/support`, { headers }),
        axios.get(`${API}/api/transactions/my`, { headers }),
        axios.get(`${API}/api/admin/profile`, { headers })
      ]);

    setStatsData(summary.data?.data || {});
    setEmployees(employeeList.data?.data || []);
    console.log(summary)
    setAttendance(attendanceList.data || []);
    setHolidays(holidayList.data?.data || []);
    setLeaveRequests(leavesList.data?.data || []);
    setPayrollData(payrollList.data?.data || []);
    setDepartments(departmentList.data.data || []);
    setDesignations(designationList.data || []);
    setTickets(ticketList.data?.data);
    setTransactions(paymentList.data?.data || []);
    const d = profile.data.data || [];
    const p = {
        name: d.name || "", email: d.email || "", phone: d.phone || "",
        department: d.department || "Administration", role: d.role || "Admin",
        joined: d.joined_at || d.created_at || "", avatar: d.avatar || "",
      };
    
    setProfile(p)
    console.log(profile)
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
  {
    title: "Total Employees",
    value: statsData.totalEmployees,
    icon: Users,
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    title: "Present Today",
    value: statsData.presentToday,
    icon: CheckCircle,
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    title: "Pending Leaves",
    value: statsData.pendingLeaves,
    icon: CalendarRange,
    color: "#f59e0b",
    bg: "#fffbeb",
  },
  {
    title: "Companies",
    value: statsData.totalCompanies,
    icon: Building2,
    color: "#3b82f6",
    bg: "#eff6ff",
  },
];


  const palette = [
  { bg: "#eef2ff", color: "#6366f1" },
  { bg: "#ecfdf5", color: "#10b981" },
  { bg: "#fffbeb", color: "#f59e0b" },
  { bg: "#fdf4ff", color: "#d946ef" },
  { bg: "#eff6ff", color: "#3b82f6" },
  { bg: "#fef2f2", color: "#ef4444" },
];

const handleDownload = async (payrollId, employeeName) => {
  if (!payrollId) return;
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${API}/api/payroll/download/${payrollId}`,
      { headers: { "x-auth-token": token } }
    );
    const data = res.data.data;

    const content = `
PAYSLIP
Employee : ${data.name}
Employee ID : EMP-${data.employee_id}
Pay Date : ${new Date(data.pay_date).toLocaleDateString()}
Net Salary : ₹${data.net_salary}
`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Payslip_${employeeName}.txt`;
    document.body.appendChild(element);
    element.click();
  } catch {
    alert("Download failed");
  }
};

const cardStyle = {
  height: "450px",
  display: "flex",
  flexDirection: "column",
};

return (
  <div className="d-flex bg-light min-vh-100">
    <Sidebar />

    <PageContent>
      <div className="container-fluid py-4 px-4">


<div className="row mb-4">
<div className="col-12">
  <div
    className="p-4 p-lg-5 rounded-4 shadow-sm position-relative overflow-hidden"
    style={{
      background: "#eef2ff",
    }}
  >
    <div className="row align-items-center">
      <div className="col-lg-8">
        <div className="mb-3">
          <h2
            className="fw-bold mb-1"
            style={{ color: "#1e293b" }}
          >
            {getTimeGreeting()}, {profile.name || adminName} 👋
          </h2>

          <p style={{ color: "#475569" }}>
            Welcome back! Here is your company overview.
          </p>
        </div>
        <div className="row g-3 mt-2">

          <div className="col-md-6">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#334155" }}
            >
              <Mail size={16} color="#6366f1" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#334155" }}
            >
              <Phone size={16} color="#6366f1" />
              <span>{profile.phone || "Not available"}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#334155" }}
            >
              <Building2 size={16} color="#6366f1" />
              <span>{profile.department}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#334155" }}
            >
              <MapPin size={16} color="#6366f1" />
              <span>{profile.address || "Not available"}</span>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="d-flex align-items-center gap-2"
              style={{ color: "#334155" }}
            >
              <CalendarDays size={16} color="#6366f1" />
              <span>
                Joined:{" "}
                {profile.joined
                  ? new Date(profile.joined).toLocaleDateString()
                  : "-"}
              </span>
            </div>
          </div>

        </div>
      </div>


      <div className="col-lg-4 text-center mt-4 mt-lg-0">
        <div
          className="rounded-circle d-flex align-items-center justify-content-center mx-auto fw-bold text-white"
          style={{
            width: 110,
            height: 110,
            fontSize: 40,
            background: "#6366f1",
            boxShadow: "0 10px 25px rgba(99,102,241,0.3)",
          }}
        >
          {profile.name?.charAt(0) || "A"}
        </div>

        <h4 className="mt-3 mb-0" style={{ color: "#1e293b" }}>
          {profile.name}
        </h4>

        <small style={{ color: "#64748b" }}>
          {profile.role}
        </small>
      </div>

    </div>
  </div>
</div>
</div>


    <div className="row g-4 mb-4">
          {stats.map((stat, index) => (
            <div key={index} className="col-xl-3 col-md-6">
              <div className="p-4 shadow-sm bg-white rounded-4">
                <div
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 12,
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    color: stat.color,
                  }}
                >
                  <stat.icon size={20} />
                </div>

                <p className="text-muted mb-1">{stat.title}</p>
                <h3 className="fw-bold">{stat.value || 0}</h3>
              </div>
            </div>
          ))}


{!loading && nextHoliday && (
<div className="row mb-4 mt-4">
  <div className=" col-md-12">
    <div
      className="p-4 text-white rounded-4 shadow-sm position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#4f46e5,#7c3aed)",
        // minHeight: "140px",
      }}
    >
      <span
        className="badge mb-2"
        style={{ background: "rgba(255,255,255,0.2)" }}
      >
        Upcoming Holiday
      </span>

      <h5 className="fw-bold fs-2">
        {nextHoliday.description?.charAt(0).toUpperCase() +
          nextHoliday.description?.slice(1)}
      </h5>

      <div className=" mt-2">
        <div className="d-flex align-items-center gap-2" style={{fontSize:"15px"}}>
          <Clock size={14} />
          {new Date(nextHoliday.holiday_date).toLocaleDateString()}
        </div>

        <div className="fw-semibold mt-1" style={{fontSize:"15px"}}>
          {daysLeft} days left
        </div>
      </div>

      <CalendarDays
        size={80}
        className="position-absolute opacity-25"
        style={{
          right: "-10px",
          bottom: "-10px",
          transform: "rotate(-15deg)",
        }}
      />
    </div>
  </div>
</div>
)}
</div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
              <h5 className="fw-bold mb-3">Employees</h5>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
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
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>In</th>
                      <th>Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((a, i) => (
                      <tr key={i}>
                        <td>{a.name}</td>
                        <td>{new Date(a.date).toLocaleDateString()}</td>
                        <td>
                          <span style={getBadgeStyle(a.status)}>
                            {a.status}
                          </span>
                        </td>
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
                      <th>Leave Type</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((req) => (
                      <tr key={req.leave_id}>
                        {isAdmin && <td>{req.employee_name}</td>}
                        <td>{req.leave_type}</td>
                        <td>
                          {new Date(req.start_date).toLocaleDateString()} -{" "}
                          {new Date(req.end_date).toLocaleDateString()}
                        </td>
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
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Salary</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrollData.map((pay) => (
                      <tr key={pay.employee_id}>
                        <td>{pay.name}</td>
                        <td>₹{pay.last_net_salary}</td>
                        <td>
                          {pay.pay_date ? "Paid" : "Pending"}
                        </td>
                        <td>
                          {pay.pay_date
                            ? new Date(pay.pay_date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            disabled={!pay.pay_date}
                            onClick={() =>
                              handleDownload(pay.payroll_id, pay.name)
                            }
                          >
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
      <thead>
        <tr>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="3" className="text-center py-4">
              <div className="spinner-border text-primary" />
            </td>
          </tr>
        ) : filtered.length > 0 ? (
          filtered.map((dept, idx) => (
            <tr key={dept.department_id}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center fw-bold"
                    style={{
                      width: 38,
                      height: 38,
                      background: palette[idx % palette.length].bg,
                      color: palette[idx % palette.length].color,
                    }}
                  >
                    {dept.department_name.charAt(0)}
                  </div>

                  <div>
                    <div className="fw-semibold">{dept.department_name}</div>
                    <small className="text-muted">
                      ID: DEPT_{dept.department_id}
                    </small>
                  </div>
                </div>
              </td>

              <td>
                <span className="badge bg-success-subtle text-success">
                  Active
                </span>
              </td>

            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center py-4 text-muted">
              No departments found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

</div>

<div className="col-lg-6">  
        <div className="bg-white p-4 rounded-4 border shadow-sm overflow-hidden" style={cardStyle}>
            <h5 className="fw-bold mb-3">Designations</h5>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-light">
                <tr style={{ fontSize: "11px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th className="px-4 py-3 border-0">Identity</th>
                  <th className="px-4 py-3 border-0">Role Designation</th>
                  <th className="px-4 py-3 border-0">Entity Mapping</th>
                  <th className="px-4 py-3 border-0 text-end">Management</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="spinner-border text-primary border-0" role="status" style={{ width: "2rem", height: "2rem" }} />
                      <p className="mt-2 text-muted small fw-medium">Loading directory...</p>
                    </td>
                  </tr>
                ) : designations.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <Info size={40} className="text-light mb-2" />
                      <p className="text-muted small mb-0">The role directory is currently empty.</p>
                    </td>
                  </tr>
                ) : (
                  designations.map((d) => (
                    <tr key={d.designation_id} className="hover-row">
                      <td className="px-4 py-3">
                        <span className="badge font-monospace text-secondary bg-light border px-2 py-1" style={{ fontSize: "11px" }}>
                          #{d.designation_id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>{d.designation_name}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        <span className="badge rounded-pill bg-primary-subtle text-primary px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>
                          ORG_UNIT_{d.company_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <button
                          className="btn btn-sm btn-outline-danger border-0 rounded-2 p-2 shadow-none"
                          onClick={() => deleteDesignation(d.designation_id)}
                          title="Remove Role"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div>
        </div>
</div>


<div className="col-lg-6">
<div className="p-4 shadow-sm bg-white rounded-4" style={cardStyle}>
  <h5 className="fw-bold mb-3">Support Tickets</h5>

  <div style={{ flex: 1, overflowY: "auto" }}>
    <table className="table align-middle">
      <thead>
        <tr>
          <th>Ticket ID</th>
          <th>Employee</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>

      <tbody>
        {loading ? (
          <tr>
            <td colSpan="5" className="text-center py-4">
              <div className="spinner-border text-primary" />
            </td>
          </tr>
        ) : tickets && tickets.length > 0 ? (
          tickets.map((ticket) => (
            <tr key={ticket.username || "N/A"}>
              <td>
                <span className="badge bg-light text-dark">
                  #{ticket.user_email}
                </span>
              </td>
              <td>{ticket.subject }</td>
              <td>{ticket.created_at}</td>
              <td>
                <span
                  className={`badge ${
                    ticket.status === "Open"
                      ? "bg-warning-subtle text-warning"
                      : ticket.status === "Closed"
                      ? "bg-success-subtle text-success"
                      : "bg-secondary-subtle text-secondary"
                  }`}
                >
                  {ticket.status}
                </span>
              </td>
              <td>
                {ticket.created_at
                  ? new Date(ticket.created_at).toLocaleDateString()
                  : "-"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center py-4 text-muted">
              No support tickets found
            </td>
          </tr>
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
        <div className="text-muted small">
          Click Submit Payment to add your first record
        </div>
      </div>
    ) : (
      <div className="table-responsive">
        <table className="table align-middle mb-0">
          <thead className="bg-light">
            <tr
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <th className="px-4 py-3">#</th>
              <th className="py-3">Plan</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Payment Date</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-end px-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx, i) => (
              <tr key={tx.transaction_id} className="hover-row">
                <td className="px-4 py-3 text-muted small">{i + 1}</td>

                <td className="py-3 fw-semibold text-dark">
                  {tx.plan_name || "—"}
                </td>

                <td className="py-3 fw-bold text-dark">
                  {fmtAmount(tx.amount)}
                </td>

                <td className="py-3 text-muted small">
                  {fmtDate(tx.payment_date)}
                </td>

                <td className="py-3">
                  <span
                    className="badge rounded-pill px-2 py-1"
                    style={{
                      background:
                        STATUS_STYLE[tx.status]?.bg || "#f1f5f9",
                      color:
                        STATUS_STYLE[tx.status]?.text || "#64748b",
                      fontSize: "11px",
                    }}
                  >
                    {tx.status}
                  </span>
                </td>

                <td className="py-3 text-end px-4">
                  {tx.status === "rejected" ? (
                    <span
                      className="text-danger small"
                      title={tx.reject_reason}
                    >
                      View Reason
                    </span>
                  ) : (
                    <span className="text-muted small">—</span>
                  )}
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