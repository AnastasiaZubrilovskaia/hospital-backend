const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.post('/register', 
  validate([
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('birthDate').isDate().withMessage('Valid birth date is required')
  ]),
  authController.register
);

router.post('/login', 
  validate([
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required')
  ]),
  authController.login
);

router.get('/profile', authController.getProfile);
router.put('/profile', 
  validate([
    check('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    check('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    check('email').optional().isEmail().withMessage('Valid email is required'),
    check('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    check('birthDate').optional().isDate().withMessage('Valid birth date is required')
  ]),
  authController.updateProfile
);

module.exports = router;