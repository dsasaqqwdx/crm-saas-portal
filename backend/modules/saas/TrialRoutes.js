const express   = require("express");
const router    = express.Router();
const pool      = require("../../config/db");
const auth      = require("../../middleware/authMiddleware");
const roleCheck = require("../../middleware/roleCheck");

const isSuperAdmin  = roleCheck(["super_admin", "software_owner"]);
const isCompanyUser = roleCheck(["company_admin", "employee", "super_admin", "software_owner"]);
router.get("/users", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.user_id,
         u.name,
         u.email,
         u.role,
         u.is_active,
         u.company_id,
         c.company_name,
         c.is_trial,
         COALESCE(u.trial_end, u.created_at + INTERVAL '15 days')   AS user_trial_end,
         CASE
           WHEN c.is_trial = false AND c.is_active THEN NULL
           ELSE GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
             COALESCE(u.trial_end, u.created_at + INTERVAL '15 days') - NOW()
           )) / 86400))::int
         END AS trial_days_left
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.company_id
       WHERE u.role NOT IN ('super_admin', 'software_owner')
       ORDER BY c.company_name ASC NULLS LAST, u.name ASC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/users/:user_id/suspend", auth, isSuperAdmin, async (req, res) => {
  try {
    const { user_id } = req.params;

    
    const check = await pool.query(
      "SELECT role FROM users WHERE user_id = $1",
      [user_id]
    );
    if (!check.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    if (["super_admin", "software_owner"].includes(check.rows[0].role))
      return res.status(403).json({ success: false, message: "Cannot suspend a superadmin account" });

    const result = await pool.query(
      `UPDATE users
       SET is_active = false
       WHERE user_id = $1
       RETURNING user_id, name, email, role, is_active`,
      [user_id]
    );

    return res.json({
      success: true,
      data:    result.rows[0],
      message: `${result.rows[0].name} has been suspended. They will see a suspension screen on next login.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/users/:user_id/reactivate", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE users
       SET is_active = true
       WHERE user_id = $1
       RETURNING user_id, name, email, role, is_active`,
      [req.params.user_id]
    );
    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      data:    result.rows[0],
      message: `${result.rows[0].name} has been reactivated and can log in again.`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/users/:user_id/extend", auth, isSuperAdmin, async (req, res) => {
  try {
    const { user_id } = req.params;
    const { days }    = req.body;

    if (!days || isNaN(days) || parseInt(days) <= 0)
      return res.status(400).json({ success: false, message: "Provide a valid number of days" });

    const result = await pool.query(
      `UPDATE users u
       SET trial_end = (
         SELECT GREATEST(
                  COALESCE(u2.trial_end, u2.created_at + INTERVAL '15 days'),
                  NOW()
                ) + ($1 || ' days')::INTERVAL
         FROM users u2
         WHERE u2.user_id = $2
       ),
       is_active = true
       WHERE user_id = $2
       RETURNING user_id, name, email, trial_end, is_active`,
      [parseInt(days), user_id]
    );

    if (!result.rows.length)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      data:    result.rows[0],
      message: `Trial extended by ${days} days for ${result.rows[0].name}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/trials", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         c.company_id,
         c.company_name,
         c.pricing_plan AS plan,
         c.trial_start,
         c.trial_end,
         c.is_trial,
         c.is_active,
         GREATEST(0, CEIL(EXTRACT(EPOCH FROM (c.trial_end - NOW())) / 86400))::int AS days_left,
         u.name  AS admin_name,
         u.email AS admin_email,
         (SELECT COUNT(*) FROM trial_extension_requests r
          WHERE r.company_id = c.company_id AND r.status = 'pending') AS pending_requests
       FROM companies c
       LEFT JOIN users u
         ON u.company_id = c.company_id AND u.role = 'company_admin'
       ORDER BY c.trial_end ASC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/trials/requests", auth, isSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.*,
         c.company_name,
         u.name  AS requester_name,
         u.email AS requester_email,
         u.role  AS requester_role,
         GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
           COALESCE(u.trial_end, u.created_at + INTERVAL '15 days') - NOW()
         )) / 86400))::int AS days_left
       FROM trial_extension_requests r
       JOIN companies c ON r.company_id = c.company_id
       JOIN users     u ON r.requested_by = u.user_id
       ORDER BY r.created_at DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/trials/requests/:request_id/resolve", auth, isSuperAdmin, async (req, res) => {
  try {
    const { request_id }         = req.params;
    const { status, admin_note } = req.body;

    if (!["approved", "denied"].includes(status))
      return res.status(400).json({ success: false, message: "Status must be approved or denied" });

    const reqRow = await pool.query(
      "SELECT * FROM trial_extension_requests WHERE request_id = $1",
      [request_id]
    );
    if (!reqRow.rows.length)
      return res.status(404).json({ success: false, message: "Request not found" });

    const extReq = reqRow.rows[0];

    if (status === "approved") {
      await pool.query(
        `UPDATE users
         SET trial_end = (
           SELECT GREATEST(
                    COALESCE(u2.trial_end, u2.created_at + INTERVAL '15 days'),
                    NOW()
                  ) + ($1 || ' days')::INTERVAL
           FROM users u2
           WHERE u2.user_id = $2
         ),
         is_active = true
         WHERE user_id = $2`,
        [extReq.days_requested, extReq.requested_by]
      );
    }

    await pool.query(
      `UPDATE trial_extension_requests
       SET status = $1, admin_note = $2, updated_at = NOW()
       WHERE request_id = $3`,
      [status, admin_note || null, request_id]
    );

    return res.json({
      success: true,
      message: status === "approved"
        ? `Trial extended by ${extReq.days_requested} days for the requesting user`
        : "Request denied",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.put("/trials/:company_id/extend", auth, isSuperAdmin, async (req, res) => {
  try {
    const { company_id } = req.params;
    const { days }       = req.body;

    if (!days || isNaN(days) || parseInt(days) <= 0)
      return res.status(400).json({ success: false, message: "Provide a valid number of days" });

    const comp = await pool.query(
      `UPDATE companies
       SET trial_end = GREATEST(trial_end, NOW()) + ($1 || ' days')::INTERVAL,
           is_active = true, is_trial = true
       WHERE company_id = $2
       RETURNING *`,
      [parseInt(days), company_id]
    );
    if (!comp.rows.length)
      return res.status(404).json({ success: false, message: "Company not found" });

    
    await pool.query(
      `UPDATE users
       SET trial_end = GREATEST(
                         COALESCE(trial_end, created_at + INTERVAL '15 days'),
                         NOW()
                       ) + ($1 || ' days')::INTERVAL,
           is_active = true
       WHERE company_id = $2`,
      [parseInt(days), company_id]
    );

    return res.json({
      success: true,
      data:    comp.rows[0],
      message: `Trial extended by ${days} days for all users in ${comp.rows[0].company_name}`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.put("/trials/:company_id/suspend", auth, isSuperAdmin, async (req, res) => {
  try {
    const comp = await pool.query(
      "UPDATE companies SET is_active = false WHERE company_id = $1 RETURNING *",
      [req.params.company_id]
    );
    if (!comp.rows.length)
      return res.status(404).json({ success: false, message: "Company not found" });

    await pool.query(
      "UPDATE users SET is_active = false WHERE company_id = $1",
      [req.params.company_id]
    );

    return res.json({
      success: true,
      message: `All users in ${comp.rows[0].company_name} have been suspended`,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/my-trial", auth, isCompanyUser, async (req, res) => {
  try {
    const companyId = req.user.company_id;
    const userId    = req.user.id;

    if (!companyId) return res.json({ success: true, data: null });

    const result = await pool.query(
      `SELECT
         c.company_id,
         c.company_name,
         c.trial_start,
         c.is_trial,
         c.is_active,
         c.pricing_plan AS plan,
         COALESCE(u.trial_end, u.created_at + INTERVAL '15 days')   AS trial_end,
         GREATEST(0, CEIL(EXTRACT(EPOCH FROM (
           COALESCE(u.trial_end, u.created_at + INTERVAL '15 days') - NOW()
         )) / 86400))::int                                           AS days_left
       FROM companies c
       JOIN users u ON u.user_id = $1
       WHERE c.company_id = $2`,
      [userId, companyId]
    );

    return res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/my-trial/request-extension", auth, isCompanyUser, async (req, res) => {
  try {
    const companyId               = req.user.company_id;
    const userId                  = req.user.id;
    const { message, days_requested } = req.body;

    if (!companyId)
      return res.status(400).json({ success: false, message: "No company associated with this account" });

    const existing = await pool.query(
      `SELECT request_id FROM trial_extension_requests
       WHERE company_id = $1 AND requested_by = $2 AND status = 'pending'`,
      [companyId, userId]
    );
    if (existing.rows.length)
      return res.status(400).json({
        success: false,
        message: "You already have a pending extension request. Please wait for the administrator to respond.",
      });

    const result = await pool.query(
      `INSERT INTO trial_extension_requests
         (company_id, requested_by, message, days_requested, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING *`,
      [companyId, userId, message || null, days_requested || 30]
    );

    return res.status(201).json({
      success: true,
      data:    result.rows[0],
      message: "Extension request sent to the administrator successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/my-trial/requests", auth, isCompanyUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS requester_name, u.role AS requester_role
       FROM trial_extension_requests r
       JOIN users u ON r.requested_by = u.user_id
       WHERE r.company_id = $1 AND r.requested_by = $2
       ORDER BY r.created_at DESC
       LIMIT 5`,
      [req.user.company_id, req.user.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;