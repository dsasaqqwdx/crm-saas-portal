const pool = require('../../config/db');

exports.markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        let { status } = req.body;
        // Normalize status to Title Case (present -> Present)
        status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

        // Find employee_id from user email (case-insensitive)
        const empQuery = `
            SELECT employee_id FROM public.employees 
            WHERE LOWER(email) = (SELECT LOWER(email) FROM public.users WHERE user_id = $1)
        `;
        const empResult = await pool.query(empQuery, [userId]);

        if (empResult.rows.length === 0) {
            // If they are an admin, auto-create an employee record for them to allow testing attendance
            if (req.user.role === 'company_admin' || req.user.role === 'super_admin') {
                console.log(`Auto-creating employee record for admin: ${req.user.email}`);
                const userQuery = await pool.query('SELECT name, email, company_id FROM public.users WHERE user_id = $1', [userId]);
                const admin = userQuery.rows[0];
                const createEmp = await pool.query(
                    'INSERT INTO public.employees (name, email, company_id, joining_date) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING employee_id',
                    [admin.name, admin.email, admin.company_id]
                );
                empResult.rows = createEmp.rows;
            } else {
                return res.status(404).json({ success: false, msg: "Employee profile not found. Please contact support." });
            }
        }

        const employeeId = empResult.rows[0].employee_id;

        const upsertQuery = `
            INSERT INTO public.attendance (employee_id, attendance_date, status) 
            VALUES ($1, CURRENT_DATE, $2)
            ON CONFLICT ON CONSTRAINT unique_emp_day 
            DO UPDATE SET status = EXCLUDED.status
            RETURNING *`;

        const result = await pool.query(upsertQuery, [employeeId, status]);

        res.status(200).json({ success: true, msg: "Attendance marked!", data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
};