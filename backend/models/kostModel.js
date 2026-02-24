const db = require('../config/db');

class Kost {
    static async create(data) {
        const { owner_id, name, description, price, address, maps_link, owner_phone } = data;
        const [result] = await db.execute(
            'INSERT INTO kost (owner_id, name, description, price, address, maps_link, owner_phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [owner_id, name, description, price, address, maps_link, owner_phone]
        );
        return result.insertId;
    }

    static async addImage(kostId, imageUrl) {
        await db.execute('INSERT INTO kost_images (kost_id, image_url) VALUES (?, ?)', [kostId, imageUrl]);
    }

    static async findAll(filters = {}) {
        let query = 'SELECT k.*, i.image_url FROM kost k LEFT JOIN (SELECT kost_id, MIN(image_url) as image_url FROM kost_images GROUP BY kost_id) i ON k.id = i.kost_id WHERE 1=1';
        const params = [];

        if (filters.status) {
            query += ' AND k.status = ?';
            params.push(filters.status);
        }

        if (filters.search) {
            query += ' AND (k.name LIKE ? OR k.address LIKE ?)';
            params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        // Pagination could be added here

        query += ' ORDER BY k.created_at DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.execute('SELECT * FROM kost WHERE id = ?', [id]);
        if (rows.length === 0) return null;

        const kost = rows[0];

        const [images] = await db.execute('SELECT image_url FROM kost_images WHERE kost_id = ?', [id]);
        kost.images = images.map(img => img.image_url);

        return kost;
    }

    static async updateRoomAvailability(id, isAvailable) {
        await db.execute('UPDATE kost SET room_available = ?, last_room_update = NOW() WHERE id = ?', [isAvailable, id]);
    }

    static async getImages(kostId) {
        const [rows] = await db.execute('SELECT * FROM kost_images WHERE kost_id = ?', [kostId]);
        return rows;
    }
}

class Logbook {
    static async log(activityType, description) {
        await db.execute('INSERT INTO logbook (activity_type, description) VALUES (?, ?)', [activityType, description]);
    }
}

module.exports = { Kost, Logbook };
