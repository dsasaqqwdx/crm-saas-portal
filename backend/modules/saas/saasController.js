
const pool = require('../../config/db');

exports.createCompany = async (req, res) => {
    const { company_name, pricing_plan } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO companies (company_name, pricing_plan) VALUES ($1, $2) RETURNING *',
            [company_name, pricing_plan]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while creating company" });
    }
};

exports.getCompanies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching companies" });
    }
};

exports.getGlobalSummary = async (req, res) => {
    try {
        const companyCount = await pool.query('SELECT COUNT(*) FROM companies');
        const userCount = await pool.query('SELECT COUNT(*) FROM users');
        const activeLicenses = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['admin']);

        res.status(200).json({
            success: true,
            data: {
                totalCompanies: parseInt(companyCount.rows[0].count),
                totalUsers: parseInt(userCount.rows[0].count),
                activeLicenses: parseInt(activeLicenses.rows[0].count),
                systemAlerts: 0
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching global summary" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.user_id, u.name, u.email, u.role, u.company_id, u.created_at, c.company_name
            FROM users u
            LEFT JOIN companies c ON u.company_id = c.company_id
            ORDER BY u.created_at DESC
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching users" });
    }
};

exports.deleteCompany = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM companies WHERE company_id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }

        res.status(200).json({ success: true, message: "Company deleted successfully" });
    } catch (err) {
        console.error(err.message);
        if (err.code === '23503') {
            return res.status(400).json({ 
                success: false, 
                message: "Cannot delete: Users are still linked to this company." 
            });
        }
        res.status(500).json({ error: "Server error while deleting company" });
    }
};