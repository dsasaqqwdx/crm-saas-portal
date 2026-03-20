import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Clock,
  Palmtree,
  CalendarRange,
  Wallet,
  LogOut,
  Building2,  
  Briefcase
} from "lucide-react";
import { CreditCard } from "lucide-react"; 
import { HeadphonesIcon } from "lucide-react";

import { UserCog } from "lucide-react"; 
const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const allItems = [
  { name: "Admin Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, roles: ["company_admin"] },
  { name: "Super Control Panel", path: "/superadmin-dashboard", icon: <LayoutDashboard size={18} />, roles: ["super_admin", "software_owner"] },
  { name: "My Dashboard", path: "/employee-dashboard", icon: <LayoutDashboard size={18} />, roles: ["employee"] },

  { name: "Add Employee", path: "/add-employee", icon: <UserPlus size={18} />, roles: ["company_admin"] },

  { 
    name: "Employee Attendance", 
    path: "/admin-attendance",  
    icon: <Clock size={18} />, 
    roles: ["company_admin"] 
  },

  { 
    name: "My Attendance", 
    path: "/attendance",         
    icon: <Clock size={18} />, 
    roles: ["employee"] 
  },

  { name: "Holidays", path: "/holidays", icon: <Palmtree size={18} />, roles: ["company_admin", "employee"] },
  { name: "Leaves", path: "/leaves", icon: <CalendarRange size={18} />, roles: ["company_admin","employee"] },
  { name: "Payroll", path: "/payroll", icon: <Wallet size={18} />, roles: ["company_admin"] },
  { name: "Departments", path: "/departments", icon: <Building2 size={18} />, roles: ["company_admin"] },

  { name: "Transactions", path: "/transactions", icon: <CreditCard size={18} />, roles: ["super_admin", "software_owner"] },
  { name: "Companies", path: "/superadmin/companiespage", icon: <Building2 size={18} />, roles: ["super_admin", "software_owner"] },

  { name: "Designations", path: "/designations", icon: <UserPlus size={18} />, roles: ["company_admin"] },

  { name: "Add Super Admin", path: "/add-superadmin", icon: <UserCog size={18} />, roles: ["super_admin", "software_owner"] },

  { 
    name: "Pricing Plans", 
    path: "/superadmin/pricing", 
    icon: <CreditCard size={18} />, 
    roles: ["super_admin", "software_owner"] 
  },
  { name: "Support ", path: "/support", icon: <HeadphonesIcon size={18} />, roles: ["company_admin"] },
];

  const menuItems = allItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow"
      style={{ width: "250px", height: "100vh", position: "fixed", zIndex: 1000 }}
    >
      
      <div className="d-flex align-items-center mb-4 border-bottom border-secondary pb-3">
        <div
          className="bg-primary text-white d-flex align-items-center justify-content-center rounded fw-bold"
          style={{ width: "35px", height: "35px" }}
        >
          S
        </div>
        <span className="ms-2 fs-5 fw-bold tracking-tight">
          Shnoor
        </span>
      </div>

      
      <ul className="nav nav-pills flex-column mb-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="nav-item mb-1">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center py-2 px-3 rounded-3 transition-all ${isActive ? "active bg-primary text-white shadow-sm" : "text-secondary text-white-50 hover-bg-secondary"
                  }`}
              >
                <span className="me-3">{item.icon}</span>
                <span style={{ fontSize: "0.95rem" }}>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      
      <div className="mt-auto pt-3 px-2 border-top border-secondary">
        <div className="small text-muted mb-0" style={{ fontSize: '0.75rem' }}>Account</div>
        <div className="fw-semibold text-truncate mb-3" style={{ fontSize: '0.9rem' }}>
          {localStorage.getItem("name") || "Administrator"}
        </div>

        
        <button
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2 border-0 bg-danger bg-opacity-10"
          onClick={handleLogout}
        >
          <LogOut size={16} className="me-2" />
          <span className="fw-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;