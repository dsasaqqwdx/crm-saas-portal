import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';

// Dashboard Components
import Dashboard from './pages/Dashboard';
import AddEmployee from './pages/AddEmployee';
import MarkAttendance from './pages/MarkAttendance';
import Assets from './pages/Assets';
import Holidays from './pages/Holidays';
import Leaves from './pages/Leaves';
import Payroll from './pages/Payroll';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Home />} />
        <Route path="/pricing" element={<Home />} />
        <Route path="/contact" element={<Home />} />
        
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Unified Dashboard Route with Nested Sub-routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Specific Module Routes */}
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/attendance" element={<MarkAttendance />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/holidays" element={<Holidays />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/payroll" element={<Payroll />} />

        {/* Catch-all: Redirect to home if path not found */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;