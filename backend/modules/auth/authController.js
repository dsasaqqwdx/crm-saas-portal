
const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password, role, company_id } = req.body;
    try {
        const emailLower = email.toLowerCase().trim();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            `INSERT INTO users (name, email, password, role, company_id)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, emailLower, hashedPassword, role, company_id]
        );

        if (role === 'employee') {
            const emp = await pool.query(
                "INSERT INTO employees (name, email, company_id) VALUES ($1, $2, $3) RETURNING employee_id",
                [name, emailLower, company_id]
            );
           
            await pool.query(
                "INSERT INTO leave_balances (employee_id, leave_type, total_leaves, remaining_leaves) VALUES ($1, 'Annual', 20, 20)",
                [emp.rows[0].employee_id]
            );
        }
        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email.trim()]);
        if (userResult.rows.length === 0) {
            console.log(`Login failed: User not found for ${email}`);
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const user = userResult.rows[0];
        console.log(`Login attempt for: ${user.email} (Role: ${user.role})`);
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Password mismatch for ${user.email}`);
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        console.log(`Login successful: ${user.email}`);

        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: user.role, company_id: user.company_id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );
        res.json({ success: true, token, user: { id: user.user_id, name: user.name, role: user.role, company_id: user.company_id } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};