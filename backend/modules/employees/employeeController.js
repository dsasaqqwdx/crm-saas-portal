const pool = require('../../config/db');

exports.getEmployees = async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const query = `
            SELECT e.*, d.department_name, des.designation_name 
            FROM public.employees e
            LEFT JOIN public.departments d ON e.department_id = d.department_id
            LEFT JOIN public.designations des ON e.designation_id = des.designation_id
            WHERE e.company_id = $1
            ORDER BY e.name ASC
        `;

        const result = await pool.query(query, [companyId]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.addEmployee = async (req, res) => {
    const { name, email, phone, department_id, designation_id } = req.body;
    const companyId = req.user.company_id;

    try {
        const query = `
            INSERT INTO public.employees (name, email, phone, department_id, designation_id, company_id, joining_date)
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE)
            RETURNING *
        `;
        const result = await pool.query(query, [name, email, phone, department_id, designation_id, companyId]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getEmployeeProfile = async (req, res) => {
    try {
        const query = `SELECT * FROM public.employees WHERE LOWER(email) = LOWER($1)`;
        const result = await pool.query(query, [req.user.email]);
        res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};