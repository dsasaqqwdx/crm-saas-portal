<<<<<<< HEAD
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserPlus, 
  Clock, 
  Package, 
  Palmtree, 
  CalendarRange, 
  Wallet, 
  Settings, 
  LogOut 
} from 'lucide-react';
=======
// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, 
//   UserPlus, 
//   Clock, 
//   Package, 
//   Palmtree, 
//   CalendarRange, 
//   Wallet, 
//   Settings, 
//   LogOut 
// } from 'lucide-react';

// const Sidebar = () => {
//   const location = useLocation();

//   const menuItems = [
//     { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
//     { name: 'Add Employee', path: '/add-employee', icon: <UserPlus size={20} /> },
//     { name: 'Attendance', path: '/attendance', icon: <Clock size={20} /> },
//     { name: 'Assets', path: '/assets', icon: <Package size={20} /> },
//     { name: 'Holidays', path: '/holidays', icon: <Palmtree size={20} /> },
//     { name: 'Leaves', path: '/leaves', icon: <CalendarRange size={20} /> },
//     { name: 'Payroll', path: '/payroll', icon: <Wallet size={20} /> },
//   ];

//   return (
//     <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1c23] text-gray-300 flex flex-col border-r border-gray-800 z-50">
//       {/* Brand Logo */}
//       <div className="p-6 flex items-center space-x-3 border-b border-gray-800/50">
//         <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//           <span className="text-white font-bold">S</span>
//         </div>
//         <span className="text-white font-bold tracking-tight text-lg uppercase">Shnoor</span>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
//         <ul className="space-y-1 px-3">
//           {menuItems.map((item) => {
//             const isActive = location.pathname === item.path;
//             return (
//               <li key={item.path}>
//                 <Link
//                   to={item.path}
//                   className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
//                     isActive 
//                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
//                     : 'hover:bg-gray-800 hover:text-white'
//                   }`}
//                 >
//                   <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`}>
//                     {item.icon}
//                   </span>
//                   <span className="text-sm font-medium">{item.name}</span>
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Footer Actions */}
//       <div className="p-4 border-t border-gray-800/50 space-y-1">
//         <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-all">
//           <Settings size={20} className="text-gray-400" />
//           <span className="text-sm font-medium">Settings</span>
//         </Link>
//         <button 
//           onClick={() => {
//             localStorage.clear();
//             window.location.href = '/login';
//           }}
//           className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-left"
//         >
//           <LogOut size={20} className="text-gray-400" />
//           <span className="text-sm font-medium">Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Clock,
  Package,
  Palmtree,
  CalendarRange,
  Wallet,
  Settings,
  LogOut
} from "lucide-react";
>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
<<<<<<< HEAD
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Add Employee', path: '/add-employee', icon: <UserPlus size={20} /> },
    { name: 'Attendance', path: '/attendance', icon: <Clock size={20} /> },
    { name: 'Assets', path: '/assets', icon: <Package size={20} /> },
    { name: 'Holidays', path: '/holidays', icon: <Palmtree size={20} /> },
    { name: 'Leaves', path: '/leaves', icon: <CalendarRange size={20} /> },
    { name: 'Payroll', path: '/payroll', icon: <Wallet size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1a1c23] text-gray-300 flex flex-col border-r border-gray-800 z-50">
      {/* Brand Logo */}
      <div className="p-6 flex items-center space-x-3 border-b border-gray-800/50">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">S</span>
        </div>
        <span className="text-white font-bold tracking-tight text-lg uppercase">Shnoor</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto pt-4 custom-scrollbar">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-800/50 space-y-1">
        <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-800 transition-all">
          <Settings size={20} className="text-gray-400" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-left"
        >
          <LogOut size={20} className="text-gray-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
=======
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Add Employee", path: "/add-employee", icon: <UserPlus size={18} /> },
    { name: "Attendance", path: "/attendance", icon: <Clock size={18} /> },
    { name: "Assets", path: "/assets", icon: <Package size={18} /> },
    { name: "Holidays", path: "/holidays", icon: <Palmtree size={18} /> },
    { name: "Leaves", path: "/leaves", icon: <CalendarRange size={18} /> },
    { name: "Payroll", path: "/payroll", icon: <Wallet size={18} /> }
  ];

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
      style={{ width: "250px", height: "100vh", position: "fixed" }}
    >

      {/* LOGO */}
      <div className="d-flex align-items-center mb-4 border-bottom pb-3">
        <div
          className="bg-primary text-white d-flex align-items-center justify-content-center rounded"
          style={{ width: "35px", height: "35px" }}
        >
          S
        </div>

        <span className="ms-2 fs-5 fw-bold">
          Shnoor
        </span>
      </div>


      {/* MENU */}
      <ul className="nav nav-pills flex-column mb-auto">

        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <li key={item.path} className="nav-item mb-1">

              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${
                  isActive ? "active bg-primary text-white" : "text-white"
                }`}
              >

                <span className="me-2">{item.icon}</span>

                {item.name}

              </Link>

            </li>
          );
        })}
      </ul>


      {/* FOOTER */}
      <hr />

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <Link to="/settings" className="nav-link text-white d-flex align-items-center">
            <Settings size={18} className="me-2" />
            Settings
          </Link>
        </li>

        <li className="nav-item">
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <LogOut size={18} className="me-2" />
            Logout
          </button>
        </li>

      </ul>

    </div>
>>>>>>> 9c5a8010b4b016477788cc1b54819ccbe65ae531
  );
};

export default Sidebar;