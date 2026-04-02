
const pool = require("../../config/db");
const { sendPayslipEmail } = require("../../utils/emailHelper");

exports.getPayrollList = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const result = await pool.query(
      `SELECT
         p.payroll_id, e.employee_id, e.name, e.email,
         p.salary, p.bonus, p.bonus_reason, p.allowances, p.allowance_reason,
         p.deductions, p.deduction_reason, p.tax, p.tax_reason,
         p.net_salary AS last_net_salary, p.pay_date, p.pay_period, p.notes,
         CASE
           WHEN p.pay_date IS NULL THEN 'Unpaid'
           WHEN EXTRACT(MONTH FROM p.pay_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR  FROM p.pay_date) = EXTRACT(YEAR  FROM CURRENT_DATE) THEN 'Paid'
           ELSE 'Unpaid'
         END AS payment_status
       FROM employees e
       LEFT JOIN LATERAL (
         SELECT payroll_id, salary, bonus, bonus_reason, allowances, allowance_reason,
                deductions, deduction_reason, tax, tax_reason, net_salary, pay_date, pay_period, notes
         FROM payroll WHERE employee_id = e.employee_id
         ORDER BY pay_date DESC NULLS LAST LIMIT 1
       ) p ON true
       WHERE e.company_id = $1
       ORDER BY e.name ASC`,
      [companyId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load payroll list" });
  }
};

exports.processPayment = async (req, res) => {
  const {
    employee_id, pay_date, pay_period,
    salary, bonus, bonus_reason,
    allowances, allowance_reason,
    deductions, deduction_reason,
    tax, tax_reason, notes,
  } = req.body;

  try {
    const base         = parseFloat(salary      || 0);
    const bonusAmt     = parseFloat(bonus       || 0);
    const allowanceAmt = parseFloat(allowances  || 0);
    const deductionAmt = parseFloat(deductions  || 0);
    const taxAmt       = parseFloat(tax         || 0);
    const netSalary    = base + bonusAmt + allowanceAmt - deductionAmt - taxAmt;

    const result = await pool.query(
      `INSERT INTO payroll
         (employee_id, salary, bonus, bonus_reason, allowances, allowance_reason,
          deductions, deduction_reason, tax, tax_reason,
          net_salary, pay_date, pay_period, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        employee_id, base, bonusAmt, bonus_reason || null,
        allowanceAmt, allowance_reason || null,
        deductionAmt, deduction_reason || null,
        taxAmt, tax_reason || null,
        netSalary,
        pay_date || new Date(),
        pay_period || null,
        notes || null,
      ]
    );

    const payroll = result.rows[0];

    const empRow = await pool.query(
      `SELECT e.name, e.email, e.employee_id, c.company_name
       FROM employees e JOIN companies c ON e.company_id = c.company_id
       WHERE e.employee_id = $1`,
      [employee_id]
    );

    if (empRow.rows.length) {
      const emp = empRow.rows[0];
      sendPayslipEmail({
        name: emp.name, email: emp.email, companyName: emp.company_name,
        employeeId: emp.employee_id, payrollId: payroll.payroll_id,
        baseSalary: base, bonus: bonusAmt, bonusReason: bonus_reason,
        allowances: allowanceAmt, allowanceReason: allowance_reason,
        deductions: deductionAmt, deductionReason: deduction_reason,
        tax: taxAmt, taxReason: tax_reason,
        netSalary, payDate: payroll.pay_date,
        payPeriod: pay_period || "", notes: notes || "",
      }).catch(err => console.error("Payslip email failed:", err.message));
    }

    return res.json({ success: true, msg: "Payment processed and email sent", data: payroll });
  } catch (err) {
    console.error("Process Payment Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyPayslips = async (req, res) => {
  try {
    const userId = req.user.id;
    const empRow = await pool.query("SELECT employee_id FROM employees WHERE user_id = $1", [userId]);
    if (!empRow.rows.length)
      return res.status(404).json({ success: false, error: "Employee not found" });

    const result = await pool.query(
      `SELECT p.*, e.name, e.email, e.employee_id, c.company_name, d.department_name
       FROM payroll p
       JOIN employees e   ON p.employee_id = e.employee_id
       JOIN companies c   ON e.company_id  = c.company_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       WHERE p.employee_id = $1
       ORDER BY p.pay_date DESC NULLS LAST`,
      [empRow.rows[0].employee_id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load payslips" });
  }
};

exports.downloadPayslip = async (req, res) => {
  try {
    const { id }    = req.params;
    const companyId = req.user.company_id;
    const result = await pool.query(
      `SELECT p.*, e.name, e.email, e.employee_id, c.company_name, d.department_name
       FROM payroll p
       JOIN employees   e ON p.employee_id  = e.employee_id
       JOIN companies   c ON e.company_id   = c.company_id
       LEFT JOIN departments d ON e.department_id = d.department_id
       WHERE p.payroll_id = $1 AND e.company_id = $2`,
      [id, companyId]
    );
    if (!result.rows.length)
      return res.status(404).json({ error: "Payslip not found" });
    return res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ error: "Error fetching payslip" });
  }
};

exports.deletePayroll = async (req, res) => {
  try {
    const { id }    = req.params;
    const companyId = req.user.company_id;
    const check = await pool.query(
      `SELECT p.payroll_id FROM payroll p
       JOIN employees e ON p.employee_id = e.employee_id
       WHERE p.payroll_id = $1 AND e.company_id = $2`,
      [id, companyId]
    );
    if (!check.rows.length)
      return res.status(404).json({ error: "Record not found" });
    await pool.query("DELETE FROM payroll WHERE payroll_id = $1", [id]);
    return res.json({ success: true, message: "Payroll record deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
};

exports.getAllPayrollHistory = async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const result = await pool.query(
      `SELECT p.*, e.name, e.email, e.employee_id, c.company_name,
              'Paid' AS payment_status
       FROM payroll p
       JOIN employees e ON p.employee_id = e.employee_id
       JOIN companies c ON e.company_id  = c.company_id
       WHERE e.company_id = $1
       ORDER BY p.pay_date DESC NULLS LAST`,
      [companyId]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load history" });
  }
};