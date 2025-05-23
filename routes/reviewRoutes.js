const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware);

router.post('/', 
  validate([
    check('doctorId').isInt().withMessage('Doctor ID must be an integer'),
    check('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('comment').isLength({ min: 10 }).withMessage('Comment must be at least 10 characters long')
  ]),
  reviewController.createReview
);

router.get('/doctor/:doctorId', reviewController.getDoctorReviews);
router.get('/my-reviews', reviewController.getPatientReviews);

router.put('/:id', 
  validate([
    check('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    check('comment').optional().isLength({ min: 10 }).withMessage('Comment must be at least 10 characters long')
  ]),
  reviewController.updateReview
);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;