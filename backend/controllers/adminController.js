const { Kost } = require('../models/kostModel');
const db = require('../config/db');

exports.getPendingKosts = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT k.*, u.name as owner_name, u.email as owner_email, i.image_url 
            FROM kost k 
            JOIN users u ON k.owner_id = u.id 
            LEFT JOIN (SELECT kost_id, MIN(image_url) as image_url FROM kost_images GROUP BY kost_id) i ON k.id = i.kost_id
            WHERE k.status = 'pending'
            ORDER BY k.created_at ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.approveKost = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('UPDATE kost SET status = "approved" WHERE id = ?', [id]);
        res.json({ message: 'Kost approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.rejectKost = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('UPDATE kost SET status = "rejected" WHERE id = ?', [id]);
        res.json({ message: 'Kost rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
