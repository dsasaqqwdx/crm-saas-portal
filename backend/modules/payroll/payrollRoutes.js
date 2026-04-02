
const express   = require("express");
const router    = express.Router();
const auth      = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");
const {
  getPayrollList,
  processPayment,
  getMyPayslips,
  downloadPayslip,
  deletePayroll,
  getAllPayrollHistory,
} = require("./payrollController");

const isAdmin    = roleCheck(["company_admin", "super_admin"]);
const isEmployee = roleCheck(["employee", "company_admin", "super_admin"]);

router.get("/",              auth, isAdmin,    getPayrollList);
router.get("/history",       auth, isAdmin,    getAllPayrollHistory);
router.post("/generate",     auth, isAdmin,    processPayment);
router.get("/my-payslips",   auth, isEmployee, getMyPayslips);
router.get("/download/:id",  auth, isAdmin,    downloadPayslip);
router.delete("/:id",        auth, isAdmin,    deletePayroll);

module.exports = router;