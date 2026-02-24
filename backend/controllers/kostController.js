const { Kost, Logbook } = require('../models/kostModel');
const db = require('../config/db');

exports.createKost = async (req, res) => {
    try {
        const { name, description, price, address, maps_link, owner_phone } = req.body;
        const owner_id = req.user.id;

        const kostId = await Kost.create({
            owner_id, name, description, price, address, maps_link, owner_phone
        });

        // Handle initial images if any (though usually uploaded separately or mostly in update)
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await Kost.addImage(kostId, `/uploads/${file.filename}`);
            }
        }

        await Logbook.log('CREATE_KOST', `Owner ${owner_id} created kost ${kostId}`);
        res.status(201).json({ message: 'Kost created successfully', kostId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllKost = async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            status: 'approved' // Only show approved kosts to public
        };
        const kosts = await Kost.findAll(filters);
        res.json(kosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyKost = async (req, res) => {
    try {
        const owner_id = req.user.id;
        const [rows] = await db.execute('SELECT * FROM kost WHERE owner_id = ? ORDER BY created_at DESC', [owner_id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getKostById = async (req, res) => {
    try {
        const kost = await Kost.findById(req.params.id);
        if (!kost) return res.status(404).json({ message: 'Kost not found' });

        // Log view activity
        await Logbook.log('VIEW_KOST', `Kost ${req.params.id} viewed`);

        res.json(kost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { room_available } = req.body;

        // Verify ownership
        const kost = await Kost.findById(id);
        if (!kost) return res.status(404).json({ message: 'Kost not found' });
        if (kost.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Kost.updateRoomAvailability(id, room_available);
        await Logbook.log('UPDATE_AVAILABILITY', `Kost ${id} availability updated to ${room_available}`);

        res.json({ message: 'Availability updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.logAction = async (req, res) => {
    try {
        const { activity_type, description } = req.body;
        await Logbook.log(activity_type, description);
        res.json({ message: 'Logged' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const { id } = req.params;
        // Verify ownership...
        const kost = await Kost.findById(id);
        if (!kost) return res.status(404).json({ message: 'Kost not found' });
        if (kost.owner_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (req.file) {
            const imageUrl = `/uploads/${req.file.filename}`;
            await Kost.addImage(id, imageUrl);
            res.json({ message: 'Image uploaded', imageUrl });
        } else {
            res.status(400).json({ message: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
