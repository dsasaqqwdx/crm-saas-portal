const pool = require('../../config/db');

exports.getSummary = async (req, res) => {
    try {
        const userId = req.user.id;
        const companyId = req.user.company_id;
        const role = req.user.role;

        // Normalize roles to handle super_admin and software_owner same as company_admin for stats
        if (['company_admin', 'super_admin', 'software_owner'].includes(role)) {
            const query = `
                SELECT 
                    (SELECT COUNT(*)::int FROM public.users WHERE company_id = $1) as "totalEmployees",
                    (SELECT COUNT(DISTINCT employee_id)::int FROM public.attendance 
                     WHERE attendance_date = CURRENT_DATE 
                     AND LOWER(status) = 'present' 
                     AND employee_id IN (SELECT employee_id FROM public.employees WHERE company_id = $1)) as "presentToday",
                    (SELECT COUNT(*)::int FROM public.leave_applications 
                     WHERE LOWER(status) = 'pending' 
                     AND employee_id IN (SELECT employee_id FROM public.employees WHERE company_id = $1)) as "pendingLeaves",
                    (SELECT COUNT(*)::int FROM public.companies) as "totalCompanies"
            `;
            const result = await pool.query(query, [companyId]);

            // Fallback to zeros if result is undefined
            const data = result.rows[0] || { totalEmployees: 0, presentToday: 0, pendingLeaves: 0, totalCompanies: 0 };
            return res.json({ success: true, data });

        } else {
            // Employee sees personal stats
            const query = `
                SELECT 
                    (SELECT status FROM public.attendance 
                     WHERE employee_id = (SELECT employee_id FROM public.employees WHERE email = (SELECT email FROM public.users WHERE user_id = $1)) 
                     AND attendance_date = CURRENT_DATE LIMIT 1) as "attendanceToday",
                    (SELECT COALESCE(SUM(remaining_leaves), 0)::int FROM public.leave_balances 
                     WHERE employee_id = (SELECT employee_id FROM public.employees WHERE email = (SELECT email FROM public.users WHERE user_id = $1))) as "leaveBalance",
                    (SELECT COUNT(*)::int FROM public.holidays WHERE company_id = $2 AND holiday_date >= CURRENT_DATE) as "upcomingHolidays",
                    (SELECT COUNT(*)::int FROM public.payroll 
                     WHERE employee_id = (SELECT employee_id FROM public.employees WHERE email = (SELECT email FROM public.users WHERE user_id = $1))) as "payslipsCount"
            `;
            const result = await pool.query(query, [userId, companyId]);
            return res.json({ success: true, data: result.rows[0] });
        }
    } catch (err) {
        console.error("Dashboard Summary Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getActivities = async (req, res) => {
    try {
        const query = `
            SELECT * FROM (
                (SELECT 'Attendance' as type, status as detail, attendance_date::text as date 
                 FROM public.attendance a 
                 JOIN public.employees e ON a.employee_id = e.employee_id 
                 WHERE e.company_id = $1)
                UNION ALL
                (SELECT 'Leave' as type, status as detail, start_date::text as date 
                 FROM public.leave_applications l 
                 JOIN public.employees e ON l.employee_id = e.employee_id 
                 WHERE e.company_id = $1)
            ) as combined_activities
            ORDER BY date DESC LIMIT 5
        `;
        const result = await pool.query(query, [req.user.company_id]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error("Dashboard Activities Error:", err.message);
        res.status(500).json({ error: err.message });
    }
};