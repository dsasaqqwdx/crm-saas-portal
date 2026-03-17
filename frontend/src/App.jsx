import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';

import Login from './modules/auth/LoginPage';
import Register from './modules/auth/RegisterPage';
<<<<<<< HEAD

// Dashboards
=======
>>>>>>> 1b99b676a3e6a2bfcf8a38dadea23f9a37b18a22
import Dashboard from './roles/Admin/dashboard/AdminDashboardPage';
import EmployeeDashboard from './roles/Employee/dashboard/EmployeeDashboardPage';
import SuperadminDashboard from './roles/Superadmin/saas/SuperadminDashboardPage';

// Admin
import AddEmployee from './roles/Admin/employees/AddEmployeePage';
import Payroll from './roles/Admin/payroll/PayrollPage';
import DepartmentsPage from "./roles/Admin/departments/DepartmentsPage";
import AdminAttendancePage from "./roles/Admin/attendance/AdminAttendancePage";

// Employee
import MarkAttendance from './roles/Employee/attendance/MarkAttendancePage';

// Shared
import Holidays from './modules/shared/holidays/HolidaysPage';
import Leaves from './modules/shared/leaves/LeavesPage';

// Superadmin
import TransactionsPage from "./roles/Superadmin/TransactionsPage";
import CompaniesPage from './roles/Superadmin/CompaniesPage';
import AddSuperadminPage from "./roles/Superadmin/saas/AddSuperadminPage";

import PricingPage from "./roles/Superadmin/saas/PricingPage";
import Designations from './roles/Designations';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    const fallback = role === "employee" ? "/employee-dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* SUPER ADMIN */}
        <Route path="/superadmin-dashboard" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <SuperadminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/superadmin/companiespage" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <CompaniesPage />
          </ProtectedRoute>
        } />

        <Route path="/transactions" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <TransactionsPage />
          </ProtectedRoute>
        } />

        <Route path="/add-superadmin" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <AddSuperadminPage />
          </ProtectedRoute>
        } />

        {/* ADMIN */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-attendance" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AdminAttendancePage />
          </ProtectedRoute>
        } />

        <Route path="/add-employee" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AddEmployee />
          </ProtectedRoute>
        } />

        <Route path="/payroll" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <Payroll />
          </ProtectedRoute>
        } />

        <Route path="/departments" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <DepartmentsPage />
          </ProtectedRoute>
        } />
<<<<<<< HEAD

        <Route path="/designations" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <Designations />
          </ProtectedRoute>
        } />

        {/* EMPLOYEE */}
=======
        
<Route path="/superadmin/pricing" element={<PricingPage />} />
        {/* --- EMPLOYEE ROUTES --- */}
>>>>>>> 1b99b676a3e6a2bfcf8a38dadea23f9a37b18a22
        <Route path="/employee-dashboard" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
          </ProtectedRoute>
        } />

        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <MarkAttendance />
          </ProtectedRoute>
        } />

<<<<<<< HEAD
        {/* SHARED */}
=======
        <Route path="/transactions" element={
  <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
    <TransactionsPage />
  </ProtectedRoute>
} />


<Route path="/add-superadmin" element={
  <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
    <AddSuperadminPage />
  </ProtectedRoute>
} />

        {/* --- SHARED PRIVATE ROUTES --- */}
>>>>>>> 1b99b676a3e6a2bfcf8a38dadea23f9a37b18a22
        <Route path="/holidays" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <Holidays />
          </ProtectedRoute>
        } />

        <Route path="/leaves" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <Leaves />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default App;