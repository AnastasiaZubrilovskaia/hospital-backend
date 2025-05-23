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

router.delete('/:id', userController.deleteUser);

module.exports = router;