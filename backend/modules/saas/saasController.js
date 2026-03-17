const pool = require('../../config/db');

// @desc    Create a new Company/Tenant
// @access  Superadmin, Software Owner
exports.createCompany = async (req, res) => {
    const { company_name, pricing_plan } = req.body;
    
    // Safety Check: Only software_owner or super_admin should create companies
    if (req.user.role !== 'software_owner' && req.user.role !== 'super_admin') {
        return res.status(403).json({ msg: 'Not authorized to create companies' });
    }

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
// @desc    Get all companies
// @access  Superadmin, Software Owner
exports.getCompanies = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM companies ORDER BY created_at DESC');
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching companies" });
    }
};
// @desc    Get Global Summary Stats for Superadmin
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
