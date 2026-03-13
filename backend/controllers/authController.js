// const pool = require('../config/db');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//     const { name, email, password, role, company_id } = req.body;
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);
        
//         const newUser = await pool.query(
//             'INSERT INTO users (name, email, password, role, company_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
//             [name, email, hashedPassword, role, company_id]
//         );
//         res.status(201).json(newUser.rows[0]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//         if (user.rows.length === 0) return res.status(400).json({ msg: 'Invalid Credentials' });

//         const isMatch = await bcrypt.compare(password, user.rows[0].password);
//         if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

//         const token = jwt.sign(
//             { id: user.rows[0].user_id, role: user.rows[0].role, company_id: user.rows[0].company_id },
//             process.env.JWT_SECRET, { expiresIn: '1d' }
//         );
//         res.json({ token, user: { name: user.rows[0].name, role: user.rows[0].role, company_id: user.rows[0].company_id } });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ================= REGISTER USER =================

exports.register = async (req, res) => {

 const { name, email, password, role, company_id } = req.body;

 try {

  // Check if email already exists
  const existingUser = await pool.query(
   'SELECT * FROM users WHERE email = $1',
   [email]
  );

  if (existingUser.rows.length > 0) {
   return res.status(400).json({
    msg: "User already exists"
   });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Insert new user
  const newUser = await pool.query(
   `INSERT INTO users 
   (name, email, password, role, company_id)
   VALUES ($1,$2,$3,$4,$5)
   RETURNING user_id, name, email, role, company_id`,
   [name, email, hashedPassword, role, company_id]
  );

  res.status(201).json({
   success: true,
   user: newUser.rows[0]
  });

 } catch (err) {

  console.error("REGISTER ERROR:", err);

  res.status(500).json({
   error: "Server error during registration"
  });

 }

};



// ================= LOGIN USER =================

exports.login = async (req, res) => {

 const { email, password } = req.body;

 try {

  // Find user by email
  const user = await pool.query(
   'SELECT * FROM users WHERE email = $1',
   [email]
  );

  if (user.rows.length === 0) {
   return res.status(400).json({
    msg: "Invalid credentials"
   });
  }

  const dbUser = user.rows[0];

  // Compare password
  const isMatch = await bcrypt.compare(password, dbUser.password);

  if (!isMatch) {
   return res.status(400).json({
    msg: "Invalid credentials"
   });
  }

  // Create JWT token
  const payload = {
   id: dbUser.user_id,
   role: dbUser.role,
   company_id: dbUser.company_id
  };

  const token = jwt.sign(
   payload,
   process.env.JWT_SECRET,
   { expiresIn: "1d" }
  );

  res.json({
   success: true,
   token,
   user: {
    id: dbUser.user_id,
    name: dbUser.name,
    role: dbUser.role,
    company_id: dbUser.company_id
   }
  });

 } catch (err) {

  console.error("LOGIN ERROR:", err);

  res.status(500).json({
   error: "Server error during login"
  });

 }

};