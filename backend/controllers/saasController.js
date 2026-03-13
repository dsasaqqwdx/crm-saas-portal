const pool = require('../config/db');

// Create a new Company/Tenant
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
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};