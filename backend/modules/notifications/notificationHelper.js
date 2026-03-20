const pool = require("../../config/db");

/**
 * Create a notification for a user
 * @param {number} user_id - recipient
 * @param {string} type - 'new_ticket' | 'admin_reply' | 'file_uploaded' | 'reaction_added' | 'message_deleted'
 * @param {string} message - notification text
 * @param {number|null} ticket_id - optional ticket reference
 */
const createNotification = async (user_id, type, message, ticket_id = null) => {
  try {
    await pool.query(
      `INSERT INTO notifications (user_id, ticket_id, type, message)
       VALUES ($1, $2, $3, $4)`,
      [user_id, ticket_id, type, message]
    );
  } catch (err) {
    console.error("❌ Failed to create notification:", err.message);
  }
};

/**
 * Get all company_admin user_ids for a given company
 */
const getCompanyAdmins = async (company_id) => {
  try {
    const result = await pool.query(
      `SELECT user_id FROM users WHERE company_id = $1 AND role = 'company_admin'`,
      [company_id]
    );
    return result.rows.map(r => r.user_id);
  } catch (err) {
    console.error("❌ Failed to get company admins:", err.message);
    return [];
  }
};

/**
 * Get all superadmin/software_owner user_ids
 */
const getSuperAdmins = async () => {
  try {
    const result = await pool.query(
      `SELECT user_id FROM users WHERE role IN ('super_admin', 'software_owner')`
    );
    return result.rows.map(r => r.user_id);
  } catch (err) {
    console.error("❌ Failed to get super admins:", err.message);
    return [];
  }
};

/**
 * Get ticket owner (employee who created it)
 */
const getTicketOwner = async (ticket_id) => {
  try {
    const result = await pool.query(
      `SELECT user_id, company_id FROM support_tickets WHERE ticket_id = $1`,
      [ticket_id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error("❌ Failed to get ticket owner:", err.message);
    return null;
  }
};

module.exports = { createNotification, getCompanyAdmins, getSuperAdmins, getTicketOwner };
