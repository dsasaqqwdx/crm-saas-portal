const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get the token from the request header
    const token = req.header('x-auth-token');

    // 2. Check if no token is present
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // 3. Verify the token using your JWT_SECRET from .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        /** 4. Add the user data to the request object.
         * Based on your login logic, this includes:
         * - id (user_id)
         * - role (super_admin, company_admin, etc.)
         * - company_id (The specific tenant ID)
         */
        req.user = decoded;
        
        next(); // Move to the next function (the controller)
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};