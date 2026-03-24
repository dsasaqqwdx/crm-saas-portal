const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const authRoutes         = require('./modules/auth/authRoutes');
const dashboardRoutes    = require('./modules/dashboard/dashboardRoutes');
const employeeRoutes     = require('./modules/employees/employeeRoutes');
const attendanceRoutes   = require('./modules/attendance/attendanceRoutes');
const holidayRoutes      = require('./modules/holidays/holidayRoutes');
const leaveRoutes        = require('./modules/leaves/leaveRoutes');
const payrollRoutes      = require('./modules/payroll/payrollRoutes');
const saasRoutes         = require('./modules/saas/saasRoutes');
const departmentRoutes   = require("./modules/departments/departmentRoutes");
const designationRoutes  = require("./routes/designations");
const planRoutes         = require("./modules/saas/planRoutes");
const attachmentRoutes   = require("./modules/support/attachmentRoutes");
const adminProfileRoutes = require("./routes/AdminProfile");

const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/attachments",     attachmentRoutes);
app.use("/api/transactions",    require("./modules/transactions/transactionRoutes"));
app.use("/api/designations",    designationRoutes);
app.use("/api/plans",           planRoutes);
app.use("/api/support",         require("./modules/support/supportRoutes"));
app.use("/api/notifications",   require("./modules/notifications/notificationRoutes"));
app.use("/api/message-actions", require("./modules/support/messageActionRoutes"));
app.use("/api/website-settings",require("./modules/websiteSettings/websiteSettingsRoutes"));
app.use("/api/admin", adminProfileRoutes);
app.use('/api/auth',        authRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/employees',   employeeRoutes);
app.use('/api/attendance',  attendanceRoutes);
app.use('/api/holidays',    holidayRoutes);
app.use('/api/leaves',      leaveRoutes);
app.use('/api/payroll',     payrollRoutes);
app.use('/api/saas',        saasRoutes);
app.use("/api/departments", departmentRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});