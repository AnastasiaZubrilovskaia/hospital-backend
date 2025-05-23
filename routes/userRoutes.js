const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/profile', userController.getUserProfile);
router.get('/activity', userController.getUserActivity);

module.exports = router;