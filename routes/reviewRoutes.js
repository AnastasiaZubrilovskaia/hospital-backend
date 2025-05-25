const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { check, param } = require('express-validator');

function noCache(req, res, next) {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  res.set('Surrogate-Control', 'no-store');
  next();
}


router.get(
  '/doctor/:doctorId',
  noCache,  
  validate([
    param('doctorId').isInt().withMessage('doctorId должен быть целым числом')
  ]),
  reviewController.getDoctorReviews
);


router.get('/my-reviews', authMiddleware, noCache, reviewController.getPatientReviews);


router.post(
  '/doctor/:doctorId',
  authMiddleware,
  (req, res, next) => {
    console.log('Incoming POST /doctor/:doctorId body:', req.body);
    next();
  },
  validate([
    param('doctorId').isInt().withMessage('doctorId должен быть целым числом'),
    check('rating')
      .toInt()
      .isInt({ min: 1, max: 5 })
      .withMessage('Рейтинг должен быть от 1 до 5'),
    check('comment').isLength({ min: 10 }).withMessage('Комментарий должен быть не короче 10 символов')
  ]),
  
  reviewController.createReview
);


router.put(
  '/:id',
  authMiddleware,
  validate([
    param('id').isInt().withMessage('id должен быть целым числом'),
    check('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Рейтинг должен быть от 1 до 5'),
    check('comment').optional().isLength({ min: 10 }).withMessage('Комментарий должен быть не короче 10 символов')
  ]),
  reviewController.updateReview
);

router.delete(
  '/:id',
  authMiddleware,
  validate([
    param('id').isInt().withMessage('id должен быть целым числом')
  ]),
  reviewController.deleteReview
);

module.exports = router;
