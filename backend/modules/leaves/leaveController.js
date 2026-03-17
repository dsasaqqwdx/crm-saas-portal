const pool = require('../../config/db');

// @route   POST /api/leaves/apply
exports.applyLeave = async (req, res) => {
    const { leave_type, start_date, end_date, reason } = req.body;

    try {
        const empCheck = await pool.query('SELECT employee_id FROM public.employees WHERE LOWER(email) = LOWER($1)', [req.user.email]);
        if (empCheck.rows.length === 0) return res.status(404).json({ error: "Employee record not found" });
        const employee_id = empCheck.rows[0].employee_id;

        const result = await pool.query(
            `INSERT INTO public.leave_applications (employee_id, leave_type, start_date, end_date, reason, status) 
             VALUES ($1, $2, $3, $4, $5, 'Pending') RETURNING *`,
            [employee_id, leave_type, start_date, end_date, reason]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("APPLY LEAVE ERROR:", err);
        res.status(500).json({ error: "Database error while applying for leave" });
    }
};

exports.getLeaves = async (req, res) => {
    const company_id = req.user.company_id;
    const role = req.user.role;

    try {
        let query = `
            SELECT l.leave_id, l.leave_type, l.start_date::text as start_date, l.end_date::text as end_date, l.reason, l.status, e.name as employee_name
            FROM public.leave_applications l
            JOIN public.employees e ON l.employee_id = e.employee_id
            WHERE e.company_id = $1
        `;
        let params = [company_id];

        // Ensure Employee only sees their own leaves
        if (role === 'employee') {
            query += ` AND LOWER(e.email) = LOWER($2)`;
            params.push(req.user.email);
        }

        query += ` ORDER BY l.leave_id DESC`;

        const result = await pool.query(query, params);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error("GET LEAVES ERROR:", err);
        res.status(500).json({ error: "Database error while fetching leaves" });
    }
};

// @desc    Approve or reject a leave request
exports.approveLeave = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const company_id = req.user.company_id;

    if (!['Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: "Status must be 'Approved' or 'Rejected'" });
    }

    try {
        // 1. Fetch leave data and calculate actual days
        const leaveData = await pool.query(`
            SELECT l.employee_id, l.leave_type, (l.end_date - l.start_date + 1) as days_requested 
            FROM leave_applications l
            JOIN employees e ON l.employee_id = e.employee_id
            WHERE l.leave_id = $1 AND e.company_id = $2
        `, [id, company_id]);

        if (leaveData.rows.length === 0) {
            return res.status(404).json({ error: "Leave record not found or access denied" });
        }

        const { employee_id, leave_type, days_requested } = leaveData.rows[0];

        if (status === 'Approved') {
            // 2. Check Balance from leave_balances table
            const balanceCheck = await pool.query(
                'SELECT remaining_leaves FROM leave_balances WHERE employee_id = $1 AND leave_type = $2',
                [employee_id, leave_type]
            );

            if (balanceCheck.rows.length === 0) {
                return res.status(400).json({ error: "No leave balance initialized for this employee" });
            }

            if (balanceCheck.rows[0].remaining_leaves < days_requested) {
                return res.status(400).json({ error: `Insufficient balance. Required: ${days_requested}, Available: ${balanceCheck.rows[0].remaining_leaves}` });
            }

            // 3. Update Balance dynamically based on date range
            await pool.query(
                'UPDATE leave_balances SET used_leaves = used_leaves + $1, remaining_leaves = remaining_leaves - $1 WHERE employee_id = $2 AND leave_type = $3',
                [days_requested, employee_id, leave_type]
            );
        }

        // 4. Update the application status
        const result = await pool.query(
            `UPDATE leave_applications SET status = $1 WHERE leave_id = $2 RETURNING *`,
            [status, id]
        );

        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error("APPROVE LEAVE ERROR:", err);
        res.status(500).json({ error: "Database error while updating leave" });
    }
};