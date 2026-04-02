
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { NotificationBell, useNotifications } from "../context/NotificationContext";
import logo from "../assets/logo.png";
import {
  LayoutDashboard, UserPlus, Clock, Palmtree, CalendarRange, Wallet,
  LogOut, Building2, CreditCard, HeadphonesIcon, UserCog, Globe,
  Menu, ChevronLeft, X, FileText, Mail, Heart, Award, User
} from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const role = localStorage.getItem("role") || "";
  const { unreadCount, unreadAppCount } = useNotifications();

  const [activeRole, setActiveRole] = useState(() => {
    if (role === "company_admin") {
      return localStorage.getItem("activeRole") || "manager";
    }
    return role;
  });

  const handleRoleSwitch = (tab) => {
    setActiveRole(tab);
    localStorage.setItem("activeRole", tab);
    const target = tab === "self" ? "/employee-dashboard" : "/dashboard";
    window.location.href = target;
  };

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
      else setMobileOpen(false);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const managerItems = [
    { name: "Dashboard",        path: "/dashboard",          icon: <LayoutDashboard size={18} /> },
    { name: "Add Employees",    path: "/add-employee",       icon: <UserPlus size={18} /> },
    { name: "Employee Attendance", path: "/admin-attendance", icon: <Clock size={18} /> },
    { name: "Holidays",         path: "/holidays",           icon: <Palmtree size={18} /> },
    { name: "Leaves Requests",  path: "/leaves",             icon: <CalendarRange size={18} /> },
    { name: "Payroll",          path: "/payroll",            icon: <Wallet size={18} /> },
    { name: "Company Policies", path: "/admin/policies",     icon: <FileText size={18} /> },
    { name: "Payments",         path: "/payments",           icon: <CreditCard size={18} /> },
    { name: "Departments",      path: "/departments",        icon: <Building2 size={18} /> },
    { name: "Designations",     path: "/designations",       icon: <UserPlus size={18} /> },
    { name: "Support",          path: "/support",            icon: <HeadphonesIcon size={18} /> },
    { name: "Letter Heads",     path: "/admin/letters",      icon: <FileText size={18} /> },
    { name: "Appreciations",    path: "/admin/appreciation", icon: <Heart size={18} /> },
    { name: "Profile",          path: "/admin/profile",      icon: <UserCog size={18} /> },
  ];

  // ── Self view: admin acting as employee ──
  // Profile goes to /admin/self-profile (NOT /profile) so the backend
  // knows to look up the admin's own employee-facing data using admin token
  const selfItems = [
    { name: "Dashboard",        path: "/employee-dashboard",    icon: <LayoutDashboard size={18} /> },
    { name: "Holidays",         path: "/employee/holidays",     icon: <Palmtree size={18} /> },
    { name: "My Attendance",    path: "/attendance",            icon: <Clock size={18} /> },
    { name: "Leaves",           path: "/employee/leaves",       icon: <CalendarRange size={18} /> },
    { name: "Appreciations",    path: "/employee/appreciation", icon: <Award size={18} />, badge: unreadAppCount },
    { name: "Company Policies", path: "/employee/policies",     icon: <FileText size={18} /> },
    { name: "Letter Heads",     path: "/employee/my-letters",   icon: <Mail size={18} />, badge: unreadCount },
    // Uses /profile route — backend will use admin token's user_id
    // to look up the linked employee_profiles record
    { name: "Profile",          path: "/profile",               icon: <User size={18} /> },
  ];

  const employeeItems = [
    { name: "My Dashboard",     path: "/employee-dashboard",    icon: <LayoutDashboard size={18} /> },
    { name: "Holidays",         path: "/holidays",              icon: <Palmtree size={18} /> },
    { name: "My Attendance",    path: "/attendance",            icon: <Clock size={18} /> },
    { name: "Leaves",           path: "/leaves",                icon: <CalendarRange size={18} /> },
    { name: "Company Policies", path: "/employee/policies",     icon: <FileText size={18} /> },
    { name: "My Letters",       path: "/employee/my-letters",   icon: <Mail size={18} />, badge: unreadCount },
    { name: "Appreciations",    path: "/employee/appreciation", icon: <Award size={18} />, badge: unreadAppCount },
    { name: "Payroll", path: "/employee/payroll", icon: <Wallet size={18} />, roles: ["employee"] },
    { name: "Profile",          path: "/profile",               icon: <User size={18} /> },
  ];

  const superadminItems = [
    { name: "Super Control Panel", path: "/superadmin-dashboard",        icon: <LayoutDashboard size={18} /> },
    { name: "Transactions",        path: "/transactions",                icon: <CreditCard size={18} /> },
    { name: "Companies",           path: "/superadmin/companiespage",    icon: <Building2 size={18} /> },
    { name: "Add Super Admin",     path: "/add-superadmin",              icon: <UserCog size={18} /> },
    { name: "Pricing Plans",       path: "/superadmin/pricing",          icon: <CreditCard size={18} /> },
    { name: "Website Settings",    path: "/superadmin/website-settings", icon: <Globe size={18} /> },
    { name: "Support",             path: "/support",                     icon: <HeadphonesIcon size={18} /> },
    { name: "Profile",             path: "/super-admin",                 icon: <UserCog size={18} /> },
    { name: "Trial Management", path: "/superadmin/trials", icon: <Clock size={18} />, roles: ["super_admin", "software_owner"] },
  ];

  const getMenuItems = () => {
    if (role === "company_admin") {
      return activeRole === "self" ? selfItems : managerItems;
    }
    if (role === "employee") return employeeItems;
    if (role === "super_admin" || role === "software_owner") return superadminItems;
    return [];
  };

  const menuItems = getMenuItems();
  const handleLogout = () => { localStorage.clear(); window.location.href = "/"; };
  const sidebarWidth = isMobile ? "260px" : (isOpen ? "250px" : "72px");
  const showLabels = isMobile ? true : isOpen;

  const sidebarContent = (
    <div
      className="d-flex flex-column flex-shrink-0 bg-dark text-white shadow"
      style={{
        width: sidebarWidth, height: "100vh", position: "fixed",
        zIndex: 1050, overflowY: "auto", overflowX: "hidden",
        left: isMobile ? (mobileOpen ? 0 : "-260px") : 0, top: 0,
        transition: "width 0.3s ease, left 0.3s ease"
      }}
    >
      {/* ── Logo row ── */}
      <div className="d-flex align-items-center justify-content-between px-3 pt-3 pb-2">
        <div className={`d-flex align-items-center ${!showLabels && "justify-content-center w-100"}`}>
          <img src={logo} alt="logo"
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover", background: "#fff", padding: 2, flexShrink: 0 }} />
          {showLabels && <span className="ms-2 fs-5 fw-bold">Shnoor</span>}
        </div>
        {isMobile
          ? <button className="btn btn-sm btn-outline-light border-0 p-1" onClick={() => setMobileOpen(false)}><X size={20} /></button>
          : showLabels && <button className="btn btn-sm btn-outline-light border-0 p-1" onClick={() => setIsOpen(false)}><ChevronLeft size={20} /></button>
        }
      </div>

      {!isMobile && !isOpen && (
        <button className="btn btn-sm btn-outline-light border-0 mb-2 mx-2 d-flex justify-content-center" onClick={() => setIsOpen(true)}>
          <Menu size={20} />
        </button>
      )}

      {/* ── Self / Manager tab switcher (company_admin only) ── */}
      {role === "company_admin" && showLabels && (
        <div className="mx-3 mb-2 d-flex" style={{ borderBottom: "2px solid rgba(255,255,255,0.12)" }}>
          {[
            { key: "self", label: "Self", Icon: User },
            { key: "manager", label: "Manager", Icon: UserCog },
          ].map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleRoleSwitch(key)}
              className="d-flex align-items-center gap-2 border-0 bg-transparent py-2 pe-4 ps-1"
              style={{
                color: activeRole === key ? "#4f9cf9" : "#9ca3af",
                fontWeight: "600", fontSize: "0.88rem",
                borderBottom: activeRole === key ? "2px solid #4f9cf9" : "2px solid transparent",
                marginBottom: "-2px", transition: "all 0.2s", cursor: "pointer"
              }}
            >
              <Icon size={14} />{label}
            </button>
          ))}
        </div>
      )}

      {/* ── Notifications ── */}
      {showLabels && role !== "super_admin" && (
        <div className="px-3 py-1 d-flex align-items-center justify-content-between mb-1">
          <span style={{ fontSize: "0.72rem", color: "#6c757d" }}>Notifications</span>
          <NotificationBell />
        </div>
      )}

      {/* ── Nav items ── */}
      <ul className="nav nav-pills flex-column mb-auto px-2">
        {menuItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center py-2 px-3 rounded-3 ${isActive ? "active bg-primary text-white shadow-sm" : "text-white-50"} ${!showLabels && "justify-content-center"}`}
                title={!showLabels ? item.name : ""}
                style={{ transition: "all 0.15s", position: "relative" }}
              >
                <span className={showLabels ? "me-3" : ""}>{item.icon}</span>
                {showLabels && <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}>{item.name}</span>}
                {item.badge > 0 && (
                  <span className="badge bg-danger rounded-pill position-absolute" style={{ top: "8px", right: "12px", fontSize: "10px" }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Footer ── */}
      <div className="mt-auto pt-3 px-3 pb-3 border-top border-secondary">
        {showLabels && (
          <div className="fw-semibold text-truncate mb-3" style={{ fontSize: "0.9rem" }}>
            {localStorage.getItem("name") || "Administrator"}
          </div>
        )}
        <button
          className="btn w-100 d-flex align-items-center py-2 justify-content-center"
          style={{ background: "rgba(220,53,69,0.12)", border: "none", color: "#ef4444", borderRadius: "10px", fontWeight: "700" }}
          onClick={handleLogout}
        >
          <LogOut size={16} className={showLabels ? "me-2" : ""} />
          {showLabels && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1040,
          background: "#212529", padding: "10px 16px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
        }}>
          <button className="btn btn-sm btn-outline-light border-0" onClick={() => setMobileOpen(true)}><Menu size={22} /></button>
          <span className="text-white fw-bold" style={{ fontSize: "1rem" }}>Shnoor</span>
          <div style={{ width: 36 }} />
        </div>
      )}
      {isMobile && mobileOpen && (
        <div onClick={() => setMobileOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1045, backdropFilter: "blur(2px)" }} />
      )}
      {sidebarContent}
    </>
  );
};

export default Sidebar;