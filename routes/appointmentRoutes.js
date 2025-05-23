const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware);

router.post('/', 
  validate([
    check('date').isDate().withMessage('Invalid date format'),
    check('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Invalid time format'),
    check('doctorId').isInt().withMessage('Doctor ID must be an integer'),
    check('notes').optional().isString().withMessage('Notes must be a string')
  ]),
  appointmentController.createAppointment
);

router.get('/', appointmentController.getPatientAppointments);
router.get('/:id', appointmentController.getAppointmentDetails);
router.get('/slots/:doctorId/:date', appointmentController.getAvailableSlots);

router.put('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;