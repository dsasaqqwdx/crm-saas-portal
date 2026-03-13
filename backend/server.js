const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// Basic Health Check
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});