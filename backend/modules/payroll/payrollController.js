const pool = require('../../config/db');

// Get all employees and their latest payroll status

exports.getPayrollList = async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const query = `
            SELECT 
                p.payroll_id,  -- <--- THIS WAS LIKELY MISSING
                e.employee_id, 
                e.name, 
                e.email,
                p.net_salary as last_net_salary,
                p.pay_date,
                CASE 
                    WHEN p.pay_date IS NULL THEN 'Unpaid'
                    WHEN EXTRACT(MONTH FROM p.pay_date) = EXTRACT(MONTH FROM CURRENT_DATE) 
                         AND EXTRACT(YEAR FROM p.pay_date) = EXTRACT(YEAR FROM CURRENT_DATE) THEN 'Paid'
                    ELSE 'Unpaid'
                END as payment_status
            FROM public.employees e
            LEFT JOIN LATERAL (
                SELECT payroll_id, net_salary, pay_date 
                FROM public.payroll 
                WHERE employee_id = e.employee_id 
                ORDER BY pay_date DESC LIMIT 1
            ) p ON true
            WHERE e.company_id = $1
            ORDER BY e.name ASC
        `;

        const result = await pool.query(query, [companyId]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to load payroll list" });
    }
};

// Process the actual payment record
exports.processPayment = async (req, res) => {
    const { employee_id, salary, deductions, bonus } = req.body;
    try {
        const baseSalary = parseFloat(salary || 0);
        const extraBonus = parseFloat(bonus || 0);
        const totalDeductions = parseFloat(deductions || 0);
        const net_salary = baseSalary + extraBonus - totalDeductions;

        const query = `
            INSERT INTO public.payroll (employee_id, salary, bonus, deductions, net_salary, pay_date)
            VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
            RETURNING *
        `;
        const result = await pool.query(query, [employee_id, baseSalary, extraBonus, totalDeductions, net_salary]);

        res.json({ success: true, msg: "Payment processed successfully", data: result.rows[0] });
    } catch (err) {
        console.error("Process Payment Error:", err);
        res.status(500).json({ error: err.message });
    }
};


// @desc    Get specific payslip data for download
exports.downloadPayslip = async (req, res) => {
    try {
        const { id } = req.params; // payroll_id
        const companyId = req.user.company_id;

        const query = `
            SELECT p.*, e.name, e.email, c.company_name, d.department_name
            FROM public.payroll p
            JOIN public.employees e ON p.employee_id = e.employee_id
            JOIN public.companies c ON e.company_id = c.company_id
            LEFT JOIN public.departments d ON e.department_id = d.department_id
            WHERE p.payroll_id = $1 AND e.company_id = $2
        `;

        const result = await pool.query(query, [id, companyId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Payslip not found" });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: "Error generating payslip" });
    }
};