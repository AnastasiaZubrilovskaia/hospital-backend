const express = require('express');
const router = express.Router();
const appointmentController = require('../../controllers/admin/appointmentController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.get('/', appointmentController.getAllAppointments);
router.get('/date/:date', appointmentController.getAppointmentsByDate);
router.get('/:id', appointmentController.getAppointmentById);

router.put('/:id', 
  validate([
    check('date').optional().isDate().withMessage('Invalid date format'),
    check('time').optional().matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format'),
    check('status').optional().isIn(['scheduled', 'completed', 'canceled']).withMessage('Invalid status'),
    check('notes').optional().isString().withMessage('Notes must be a string')
  ]),
  appointmentController.updateAppointment
);

router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;