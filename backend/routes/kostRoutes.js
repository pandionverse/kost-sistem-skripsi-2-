const express = require('express');
const router = express.Router();
const kostController = require('../controllers/kostController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public Routes
router.get('/', kostController.getAllKost);
router.get('/:id', kostController.getKostById);
router.post('/log', kostController.logAction);

// Owner Routes
router.get('/owner/my-kosts', authMiddleware, roleMiddleware(['owner', 'admin']), kostController.getMyKost);
router.post('/', authMiddleware, roleMiddleware(['owner', 'admin']), upload.array('images', 5), kostController.createKost);
router.put('/:id/availability', authMiddleware, roleMiddleware(['owner', 'admin']), kostController.updateAvailability);
router.post('/:id/upload', authMiddleware, roleMiddleware(['owner', 'admin']), upload.single('image'), kostController.uploadImage);

module.exports = router;
