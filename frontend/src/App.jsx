import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features'; // Added
import Pricing from './pages/Pricing';   // Added
import Contact from './pages/Contact';   // Added
import Login from './modules/auth/LoginPage';
import Register from './modules/auth/RegisterPage';

// Dashboard Components
import Dashboard from './roles/Admin/dashboard/AdminDashboardPage';
import AddEmployee from './roles/Admin/employees/AddEmployeePage';
import MarkAttendance from './roles/Employee/attendance/MarkAttendancePage';
import Holidays from './modules/shared/holidays/HolidaysPage';
import Leaves from './modules/shared/leaves/LeavesPage';
import Payroll from './roles/Admin/payroll/PayrollPage';
import EmployeeDashboard from './roles/Employee/dashboard/EmployeeDashboardPage';
import SuperadminDashboard from './roles/Superadmin/saas/SuperadminDashboardPage';
import DepartmentsPage from "./roles/Admin/departments/DepartmentsPage";
import TransactionsPage from "./roles/Superadmin/TransactionsPage";


// --- PROTECTED ROUTE COMPONENT ---
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
        {/* --- PUBLIC LANDING PAGES --- */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} /> {/* Fixed mapping */}
        <Route path="/pricing" element={<Pricing />} />   {/* Fixed mapping */}
        <Route path="/contact" element={<Contact />} />   {/* Fixed mapping */}

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- SUPER ADMIN / SOFTWARE OWNER ROUTES --- */}
        <Route path="/superadmin-dashboard" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <SuperadminDashboard />
          </ProtectedRoute>
        } />

        {/* --- COMPANY ADMIN ROUTES --- */}

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <Dashboard />
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
        

        {/* --- EMPLOYEE ROUTES --- */}
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

        <Route path="/transactions" element={
  <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
    <TransactionsPage />
  </ProtectedRoute>
} />

        {/* --- SHARED PRIVATE ROUTES --- */}
        <Route path="/holidays" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin', 'super_admin']}>
            <Holidays />
          </ProtectedRoute>
        } />
        <Route path="/leaves" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <Leaves />
          </ProtectedRoute>
        } />

        {/* Catch-all: Redirect to home if path not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;