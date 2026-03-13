const pool = require('../config/db');

// Logic to add an employee linked to a specific company
exports.addEmployee = async (req, res) => {
    const { name, email, phone, department_id, designation_id, joining_date } = req.body;
    
    // We pull company_id from the JWT token (req.user) for security
    const company_id = req.user.company_id; 

    try {
        const result = await pool.query(
            'INSERT INTO employees (name, email, phone, department_id, designation_id, company_id, joining_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, email, phone, department_id, designation_id, company_id, joining_date]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database error while adding employee" });
    }
};

// Logic to mark attendance
exports.markAttendance = async (req, res) => {
    const { employee_id, status } = req.body;
    const today = new Date().toISOString().split('T')[0];

    try {
        const result = await pool.query(
            'INSERT INTO attendance (employee_id, attendance_date, status) VALUES ($1, $2, $3) RETURNING *',
            [employee_id, today, status]
        );
        res.status(201).json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database error while marking attendance" });
    }
};