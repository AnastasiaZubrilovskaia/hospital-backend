const express = require('express');
const router = express.Router();
const doctorController = require('../../controllers/admin/doctorController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.post('/', 
  validate([
    check('firstName').notEmpty().withMessage('First name is required'),
    check('lastName').notEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Valid email is required'),
    check('phone').notEmpty().withMessage('Phone number is required'),
    check('experience').isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    check('education').notEmpty().withMessage('Education is required'),
    check('SpecialtyId').isInt().withMessage('Specialty ID must be a number')
  ]),
  doctorController.createDoctor
);

router.put('/:id', 
  validate([
    check('firstName').optional().notEmpty().withMessage('First name cannot be empty'),
    check('lastName').optional().notEmpty().withMessage('Last name cannot be empty'),
    check('email').optional().isEmail().withMessage('Valid email is required'),
    check('phone').optional().notEmpty().withMessage('Phone number cannot be empty'),
    check('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
    check('education').optional().notEmpty().withMessage('Education cannot be empty'),
    check('SpecialtyId').optional().isInt().withMessage('Specialty ID must be a number')
  ]),
  doctorController.updateDoctor
);

router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;