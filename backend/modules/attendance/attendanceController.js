
const pool = require('../../config/db');
async function resolveEmployee(userId, role) {
  const empQuery = `
    SELECT employee_id
    FROM public.employees
    WHERE LOWER(email) = (
      SELECT LOWER(email) FROM public.users WHERE user_id = $1
    )
  `;
  const empResult = await pool.query(empQuery, [userId]);

  if (empResult.rows.length > 0) return empResult.rows[0].employee_id;
  if (role === 'company_admin' || role === 'super_admin') {
    const userQuery = await pool.query(
      'SELECT name, email, company_id FROM public.users WHERE user_id = $1',
      [userId]
    );
    const admin = userQuery.rows[0];
    const created = await pool.query(
      `INSERT INTO public.employees (name, email, company_id, joining_date)
       VALUES ($1, $2, $3, CURRENT_DATE) RETURNING employee_id`,
      [admin.name, admin.email, admin.company_id]
    );
    return created.rows[0].employee_id;
  }

  return null;
}
exports.markAttendance = async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userId = req.user.id;
    let { status } = req.body;
    status = status
      ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      : 'Present';

    const employeeId = await resolveEmployee(userId, req.user.role);
    if (!employeeId) {
      return res.status(404).json({ success: false, msg: 'Employee profile not found' });
    }

    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    let attendanceRow = await client.query(
      `SELECT * FROM public.attendance
       WHERE employee_id = $1 AND attendance_date = CURRENT_DATE`,
      [employeeId]
    );

    let attendanceId;
    if (attendanceRow.rows.length === 0) {
      const inserted = await client.query(
        `INSERT INTO public.attendance
           (employee_id, attendance_date, status, check_in)
         VALUES ($1, CURRENT_DATE, $2, $3)
         RETURNING *`,
        [employeeId, status, time]
      );
      attendanceId = inserted.rows[0].attendance_id;
    } else {
      attendanceId = attendanceRow.rows[0].attendance_id;
    }
    const openSession = await client.query(
      `SELECT * FROM public.attendance_sessions
       WHERE attendance_id = $1 AND check_out IS NULL
       ORDER BY session_id DESC LIMIT 1`,
      [attendanceId]
    );

    let action;
    let sessionRow;

    if (openSession.rows.length === 0) {
      const ins = await client.query(
        `INSERT INTO public.attendance_sessions
           (attendance_id, employee_id, session_date, check_in)
         VALUES ($1, $2, CURRENT_DATE, $3)
         RETURNING *`,
        [attendanceId, employeeId, time]
      );
      sessionRow = ins.rows[0];
      action = 'checked_in';
      const totalSessions = await client.query(
        `SELECT COUNT(*) FROM public.attendance_sessions WHERE attendance_id = $1`,
        [attendanceId]
      );
      if (parseInt(totalSessions.rows[0].count) === 1) {
        await client.query(
          `UPDATE public.attendance SET check_in = $1, status = $2 WHERE attendance_id = $3`,
          [time, status, attendanceId]
        );
      }
    } else {
      const upd = await client.query(
        `UPDATE public.attendance_sessions
         SET check_out = $1
         WHERE session_id = $2
         RETURNING *`,
        [time, openSession.rows[0].session_id]
      );
      sessionRow = upd.rows[0];
      action = 'checked_out';
      await client.query(
        `UPDATE public.attendance SET check_out = $1 WHERE attendance_id = $2`,
        [time, attendanceId]
      );
    }

    await client.query('COMMIT');

    res.json({ success: true, action, session: sessionRow });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Attendance Error:', err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    client.release();
  }
};
exports.getToday = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
         a.attendance_id,
         a.status,
         a.check_in,
         a.check_out,
         json_agg(
           json_build_object(
             'session_id', s.session_id,
             'check_in',   s.check_in,
             'check_out',  s.check_out,
             'duration_mins', s.duration_mins
           ) ORDER BY s.session_id
         ) FILTER (WHERE s.session_id IS NOT NULL) AS sessions
       FROM public.attendance a
       JOIN public.employees e ON a.employee_id = e.employee_id
       JOIN public.users u ON LOWER(u.email) = LOWER(e.email)
       LEFT JOIN public.attendance_sessions s ON s.attendance_id = a.attendance_id
       WHERE u.user_id = $1
         AND a.attendance_date = CURRENT_DATE
       GROUP BY a.attendance_id`,
      [userId]
    );

    if (result.rows.length === 0) return res.json({ marked: false, sessions: [] });

    const row = result.rows[0];
    const sessions = row.sessions || [];
    const hasOpenSession = sessions.some((s) => s.check_in && !s.check_out);

    res.json({
      marked: true,
      status: row.status,
      check_in: row.check_in,
      check_out: row.check_out,
      sessions,
      hasOpenSession,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllAttendance = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.attendance_id,
        e.employee_id,
        e.name,
        e.email,
        TO_CHAR(a.attendance_date, 'YYYY-MM-DD') AS date,
        a.status,
        a.check_in,
        a.check_out,
        COALESCE(
          json_agg(
            json_build_object(
              'session_id',    s.session_id,
              'check_in',      s.check_in,
              'check_out',     s.check_out,
              'duration_mins', s.duration_mins
            ) ORDER BY s.session_id
          ) FILTER (WHERE s.session_id IS NOT NULL),
          '[]'
        ) AS sessions
      FROM public.attendance a
      JOIN public.employees e ON a.employee_id = e.employee_id
      LEFT JOIN public.attendance_sessions s ON s.attendance_id = a.attendance_id
      GROUP BY a.attendance_id, e.employee_id, e.name, e.email
      ORDER BY a.attendance_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Get Attendance Error:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.editSession = async (req, res) => {
  try {
    const { session_id, check_in, check_out } = req.body;

    const result = await pool.query(
      `UPDATE public.attendance_sessions
       SET check_in = $1, check_out = $2
       WHERE session_id = $3
       RETURNING *`,
      [check_in || null, check_out || null, session_id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }
    const attendanceId = result.rows[0].attendance_id;
    await pool.query(
      `UPDATE public.attendance a
       SET
         check_in  = (SELECT MIN(check_in)  FROM public.attendance_sessions WHERE attendance_id = $1),
         check_out = (SELECT MAX(check_out) FROM public.attendance_sessions WHERE attendance_id = $1)
       WHERE a.attendance_id = $1`,
      [attendanceId]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Edit session error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
exports.editAttendance = async (req, res) => {
  try {
    const { employee_id, attendance_date, status } = req.body;

    const result = await pool.query(
      `UPDATE public.attendance
       SET status = $1
       WHERE employee_id = $2 AND attendance_date::date = $3::date
       RETURNING *`,
      [status, employee_id, attendance_date]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: `No record found for employee_id=${employee_id} on date=${attendance_date}`,
      });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Edit attendance error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};