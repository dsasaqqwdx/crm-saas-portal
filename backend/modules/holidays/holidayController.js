const pool = require('../../config/db');

exports.getHolidays = async (req, res) => {
    const company_id = req.user.company_id;

    try {
        const result = await pool.query(
            `SELECT * FROM public.holidays WHERE company_id = $1 ORDER BY holiday_date ASC`,
            [company_id]
        );
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database error while fetching holidays" });
    }
};


exports.addHoliday = async (req, res) => {
    const { holiday_date, description } = req.body;
    const company_id = req.user.company_id;

    try {
        const result = await pool.query(
            `INSERT INTO public.holidays (holiday_date, description, company_id) VALUES ($1, $2, $3) RETURNING *`,
            [holiday_date, description, company_id]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Database error while adding holiday" });
    }
};
