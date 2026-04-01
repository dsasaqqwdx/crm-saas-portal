const express = require('express');
const router = express.Router();
const { markAttendance } = require('./attendanceController');
const protect = require('../../middleware/authMiddleware');
const roleCheck = require('../../middleware/roleCheck');
const pool = require('../../config/db');
const isAdmin = roleCheck(["company_admin", "super_admin", "software_owner"]);
router.post('/mark', protect, markAttendance);
router.get('/today', protect, async (req, res) => {
try {
const userId = req.user.id;
const result = await pool.query(`
SELECT a.status, a.check_in, a.check_out
FROM public.attendance a
JOIN public.employees e ON a.employee_id = e.employee_id
JOIN public.users u ON LOWER(u.email) = LOWER(e.email)
WHERE u.user_id = $1
AND a.attendance_date = CURRENT_DATE
`, [userId]);
if (result.rows.length === 0) return res.json({ marked: false });
res.json({ marked: true, data: result.rows[0] });
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});

router.get('/all', protect, async (req, res) => {
try {
const result = await pool.query(`
SELECT
e.employee_id,
e.name,
TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS date,
a.status,
a.check_in,
a.check_out
FROM public.attendance a
JOIN public.employees e ON a.employee_id = e.employee_id
ORDER BY a.attendance_date DESC
`);
res.json(result.rows);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});

router.put('/edit', protect, isAdmin, async (req, res) => {
try {
const { employee_id, attendance_date, status, check_in, check_out } = req.body;
console.log("Edit payload received:", { employee_id, attendance_date, status, check_in, check_out });

const result = await pool.query(
`UPDATE public.attendance
SET status = $1, check_in = $2, check_out = $3
WHERE employee_id = $4 AND attendance_date::date = $5::date
RETURNING *`,
[status, check_in || null, check_out || null, employee_id, attendance_date]
);
console.log("Rows updated:", result.rowCount);
if (!result.rows.length) {
return res.status(404).json({ success: false, message: `No record found for employee_id=${employee_id} on date=${attendance_date}` });
}
res.json({ success: true, data: result.rows[0] });
} catch (err) {
console.error("Edit attendance error:", err);
res.status(500).json({ success: false, error: err.message });
}
});
module.exports = router;