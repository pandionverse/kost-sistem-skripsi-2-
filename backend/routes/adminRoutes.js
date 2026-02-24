const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/kost/pending', authMiddleware, roleMiddleware(['admin']), adminController.getPendingKosts);
router.put('/kost/:id/approve', authMiddleware, roleMiddleware(['admin']), adminController.approveKost);
router.put('/kost/:id/reject', authMiddleware, roleMiddleware(['admin']), adminController.rejectKost);

module.exports = router;
