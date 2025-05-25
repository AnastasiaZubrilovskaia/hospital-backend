const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);

router.put('/:id', 
  validate([
    check('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    check('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    check('email').optional().isEmail().withMessage('Valid email is required'),
    check('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    check('birthDate').optional().isDate().withMessage('Valid birth date is required'),
    check('role').optional().isIn(['patient', 'admin']).withMessage('Invalid role')
  ]),
  userController.updateUser
);

router.post(
  '/',
  validate([
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('birthDate').isDate().withMessage('Valid birth date is required'),
  ]),
  userController.createAdmin
);


router.delete('/:id', userController.deleteUser);

module.exports = router;