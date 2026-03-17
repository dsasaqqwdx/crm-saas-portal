const pool = require('../../config/db');

exports.markAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    let { status } = req.body;

    status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    const empQuery = `
      SELECT employee_id 
      FROM public.employees 
      WHERE LOWER(email) = (
        SELECT LOWER(email) 
        FROM public.users 
        WHERE user_id = $1
      )
    `;
    const empResult = await pool.query(empQuery, [userId]);

    if (empResult.rows.length === 0) {
      if (req.user.role === 'company_admin' || req.user.role === 'super_admin') {
        const userQuery = await pool.query(
          'SELECT name, email, company_id FROM public.users WHERE user_id = $1',
          [userId]
        );

        const admin = userQuery.rows[0];

        const createEmp = await pool.query(
          `INSERT INTO public.employees (name, email, company_id, joining_date)
           VALUES ($1, $2, $3, CURRENT_DATE)
           RETURNING employee_id`,
          [admin.name, admin.email, admin.company_id]
        );

        empResult.rows = createEmp.rows;
      } else {
        return res.status(404).json({
          success: false,
          msg: "Employee profile not found"
        });
      }
    }

    const employeeId = empResult.rows[0].employee_id;

    const now = new Date();
    const time = now.toTimeString().split(" ")[0];

    const existing = await pool.query(
      `SELECT * FROM public.attendance 
       WHERE employee_id = $1 AND attendance_date = CURRENT_DATE`,
      [employeeId]
    );

    let result;

    if (existing.rows.length === 0) {
      result = await pool.query(
        `INSERT INTO public.attendance 
         (employee_id, attendance_date, status, check_in)
         VALUES ($1, CURRENT_DATE, $2, $3)
         RETURNING *`,
        [employeeId, status, time]
      );
    } else if (!existing.rows[0].check_out) {
      result = await pool.query(
        `UPDATE public.attendance
         SET check_out = $1
         WHERE employee_id = $2 AND attendance_date = CURRENT_DATE
         RETURNING *`,
        [time, employeeId]
      );
    } else {
      return res.status(400).json({
        success: false,
        msg: "Already checked out today"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};
exports.getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.attendance_id,
        a.attendance_date,
        a.status,
        a.check_in,
        a.check_out,
        e.name,
        e.email
      FROM public.attendance a
      JOIN public.employees e ON a.employee_id = e.employee_id
      ORDER BY a.attendance_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get Attendance Error:", err);
    res.status(500).json({ error: err.message });
  }
};