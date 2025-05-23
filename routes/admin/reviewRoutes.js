const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/admin/reviewController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);

router.put('/:id/status', 
  validate([
    check('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status value')
  ]),
  reviewController.updateReviewStatus
);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;