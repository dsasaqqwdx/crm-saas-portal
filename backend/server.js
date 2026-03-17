const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Global Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Matches your React port
  credentials: true
}));
app.use(express.json());

// 2. Request logger (Very helpful for debugging 404s!)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 3. Import Routes
const authRoutes = require('./modules/auth/authRoutes');
const dashboardRoutes = require('./modules/dashboard/dashboardRoutes');
const employeeRoutes = require('./modules/employees/employeeRoutes');
const attendanceRoutes = require('./modules/attendance/attendanceRoutes');
const holidayRoutes = require('./modules/holidays/holidayRoutes');
const leaveRoutes = require('./modules/leaves/leaveRoutes');
const payrollRoutes = require('./modules/payroll/payrollRoutes');
const saasRoutes = require('./modules/saas/saasRoutes');
const departmentRoutes = require("./modules/departments/departmentRoutes");
const designationRoutes = require("./routes/designations");
app.use("/api/transactions", require("./modules/transactions/transactionRoutes"));
app.use("/api/designations", designationRoutes);


// 4. Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes); // This handles /api/attendance/mark
app.use('/api/holidays', holidayRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/saas', saasRoutes);
app.use("/api/departments", departmentRoutes);


// 5. Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

// 6. Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});