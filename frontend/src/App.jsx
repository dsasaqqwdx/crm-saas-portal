
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './modules/auth/LoginPage';
import Register from './modules/auth/RegisterPage';
import Dashboard from './roles/Admin/dashboard/AdminDashboardPage';
import EmployeeDashboard from './roles/Employee/dashboard/EmployeeDashboardPage';
import SuperadminDashboard from './roles/Superadmin/saas/SuperadminDashboardPage';
import AddEmployee from './roles/Admin/employees/AddEmployeePage';
import Payroll from './roles/Admin/payroll/PayrollPage';
import DepartmentsPage from "./roles/Admin/departments/DepartmentsPage";
import AdminAttendancePage from "./roles/Admin/attendance/AdminAttendancePage";
import AdminSupportPage from "./roles/Admin/support/AdminSupportPage";
import MarkAttendance from './roles/Employee/attendance/MarkAttendancePage';
import Holidays from './modules/shared/holidays/HolidaysPage';
import Leaves from './modules/shared/leaves/LeavesPage';
import TransactionsPage from "./roles/Superadmin/TransactionsPage";
import CompaniesPage from './roles/Superadmin/CompaniesPage';
import AddSuperadminPage from "./roles/Superadmin/saas/AddSuperadminPage";
import PricingPage from "./roles/Superadmin/saas/PricingPage";
import Designations from './roles/Designations';
import WebsiteSettingsPage from "./roles/Superadmin/saas/WebsiteSettingsPage";
import SuperAdminProfile from "./roles/Superadmin/SuperAdminProfile";
import AdminProfile from "./roles/Admin/profile/AdminProfile";
import AdminPaymentsPage from "./roles/Admin/payments/AdminPaymentsPage";
import './styles/responsive.css';
import LetterHeads from "./pages/admin/letters/LetterHeads";
import EmployeeLetters from "./pages/employee/letters/EmployeeLetters.jsx";
import AdminAppreciationPage from "./pages/admin/appreciation/AdminAppreciationPage";
import EmployeeAppreciationPage from "./pages/employee/appreciation/EmployeeAppreciationPage";
import AdminPoliciesPage from "./roles/Admin/policies/PoliciesPage";
import EmployeePoliciesPage from "./roles/Employee/policies/PoliciesPage";
import ProfilePage from './modules/shared/profile/ProfilePage.jsx';
import EmployeePayrollPage from "./roles/Employee/payroll/EmployeePayrollPage";
import TrialManagementPage from "./roles/Superadmin/TrialManagementPage";
  import SuspendedScreen from './pages/Auth/SuspendedScreen.jsx';
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");

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
        {/* ── Public ── */}
        <Route path="/"         element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing"  element={<Pricing />} />
        <Route path="/contact"  element={<Contact />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Superadmin ── */}
        <Route path="/superadmin-dashboard" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <SuperadminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/website-settings" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <WebsiteSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/companiespage" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <CompaniesPage />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/pricing" element={
          <ProtectedRoute allowedRoles={['super_admin', 'software_owner']}>
            <PricingPage />
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
        <Route path="/super-admin" element={<SuperAdminProfile />} />

        {/* ── Admin (Manager tab) ── */}
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
        <Route path="/designations" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <Designations />
          </ProtectedRoute>
        } />
        <Route path="/admin/profile" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AdminProfile />
          </ProtectedRoute>
        } />
        <Route path="/admin/appreciation" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AdminAppreciationPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/policies" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AdminPoliciesPage />
          </ProtectedRoute>
        } />
        <Route path="/admin/letters" element={
          <ProtectedRoute allowedRoles={['company_admin', 'software_owner', 'super_admin']}>
            <LetterHeads />
          </ProtectedRoute>
        } />
        <Route path="/payments" element={
          <ProtectedRoute allowedRoles={['company_admin']}>
            <AdminPaymentsPage />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute allowedRoles={['company_admin', 'software_owner', 'super_admin']}>
            <AdminSupportPage />
          </ProtectedRoute>
        } />

        {/* ── Shared: Holidays & Leaves (admin manager view) ── */}
        <Route path="/holidays" element={
          <ProtectedRoute allowedRoles={['company_admin', 'employee']}>
            <Holidays />
          </ProtectedRoute>
        } />
        <Route path="/employee/payroll" element={<EmployeePayrollPage />} />
        <Route path="/leaves" element={
          <ProtectedRoute allowedRoles={['company_admin', 'employee']}>
            <Leaves />
          </ProtectedRoute>
        } />
        <Route path="/employee-dashboard" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <EmployeeDashboard selfView={true} />
          </ProtectedRoute>
        } />
        <Route path="/employee/holidays" element={
          <ProtectedRoute allowedRoles={['company_admin', 'employee']}>
            <Holidays selfView={true} />
          </ProtectedRoute>
        } />
        <Route path="/employee/leaves" element={
          <ProtectedRoute allowedRoles={['company_admin', 'employee']}>
            <Leaves selfView={true} />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/attendance" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <MarkAttendance />
          </ProtectedRoute>
        } />
        <Route path="/employee/my-letters" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <EmployeeLetters />
          </ProtectedRoute>
        } />
        <Route path="/suspended" element={<SuspendedScreen />} />
        <Route path="/employee/appreciation" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <EmployeeAppreciationPage />
          </ProtectedRoute>
        } />
        <Route path="/employee/policies" element={
          <ProtectedRoute allowedRoles={['employee', 'company_admin']}>
            <EmployeePoliciesPage />
          </ProtectedRoute>
        } />
<Route path="/superadmin/trials" element={<TrialManagementPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;