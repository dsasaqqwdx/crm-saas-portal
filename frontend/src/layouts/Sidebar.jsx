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
  CreditCard,
  UserCog
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const allItems = [
    { name: "Admin Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} />, roles: ["company_admin"] },
    { name: "Super Control Panel", path: "/superadmin-dashboard", icon: <LayoutDashboard size={18} />, roles: ["super_admin", "software_owner"] },
    { name: "My Dashboard", path: "/employee-dashboard", icon: <LayoutDashboard size={18} />, roles: ["employee"] },

    { name: "Add Employee", path: "/add-employee", icon: <UserPlus size={18} />, roles: ["company_admin"] },
    { name: "Employee Attendance", path: "/admin-attendance", icon: <Clock size={18} />, roles: ["company_admin"] },

    { name: "Attendance", path: "/attendance", icon: <Clock size={18} />, roles: ["company_admin", "employee"] },
    { name: "Holidays", path: "/holidays", icon: <Palmtree size={18} />, roles: ["company_admin", "employee"] },
    { name: "Leaves", path: "/leaves", icon: <CalendarRange size={18} />, roles: ["company_admin","employee"] },
    { name: "Payroll", path: "/payroll", icon: <Wallet size={18} />, roles: ["company_admin"] },
    { name: "Departments", path: "/departments", icon: <Building2 size={18} />, roles: ["company_admin"] },

    { name: "Transactions", path: "/transactions", icon: <CreditCard size={18} />, roles: ["super_admin", "software_owner"] },
<<<<<<< HEAD
    { name: "Companies", path: "/superadmin/companiespage", icon: <Building2 size={18} />, roles: ["super_admin", "software_owner"] },
    { name: "Add Super Admin", path: "/add-superadmin", icon: <UserCog size={18} />, roles: ["super_admin", "software_owner"] },

    { name: "Designations", path: "/designations", icon: <UserPlus size={18} />, roles: ["company_admin"] }
=======
    {name :"CompaniesPage", path: "/superadmin-companiespage", icon: <Building2 size={18} />, roles: ["super_admin", "software_owner"] },
    { name: "Designations", path: "/designations", icon: <UserPlus size={18} />, roles: ["company_admin"] },

    { name: "Add Super Admin", path: "/add-superadmin", icon: <UserCog size={18} />, roles: ["super_admin", "software_owner"] },
     { 
   name: "Pricing Plans", 
   path: "/superadmin/pricing", 
   icon: <CreditCard size={18} />, 
   roles: ["super_admin", "software_owner"] 
 },
>>>>>>> 1b99b676a3e6a2bfcf8a38dadea23f9a37b18a22
  ];

  const menuItems = allItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="d-flex flex-column p-3 bg-dark text-white" style={{ width: "250px", height: "100vh", position: "fixed" }}>
      <h4>Shnoor</h4>

      <ul className="nav flex-column">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link to={item.path} className={`nav-link ${location.pathname === item.path ? "active text-white" : "text-secondary"}`}>
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>

      <button className="btn btn-danger mt-auto" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;