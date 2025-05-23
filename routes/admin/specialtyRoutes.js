const express = require('express');
const router = express.Router();
const specialtyController = require('../../controllers/admin/specialtyController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.post('/', 
  validate([
    check('name').notEmpty().withMessage('Name is required'),
    check('description').notEmpty().withMessage('Description is required')
  ]),
  specialtyController.createSpecialty
);

router.get('/', specialtyController.getAllSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);

router.put('/:id', 
  validate([
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    check('description').optional().notEmpty().withMessage('Description cannot be empty')
  ]),
  specialtyController.updateSpecialty
);

router.delete('/:id', specialtyController.deleteSpecialty);

module.exports = router;