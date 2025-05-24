const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware);

router.post('/', 
  validate([
    check('scheduleId').isInt(),
    check('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  ]),
  appointmentController.createAppointment
);

router.get('/', appointmentController.getPatientAppointments);
router.get('/:id', appointmentController.getAppointmentDetails);
router.get(
  '/slots/:doctorId/:date',
  validate([
    check('doctorId').isInt(),
    check('date').isDate()
  ]),
  appointmentController.getAvailableSlots
);
router.put('/:id/cancel', appointmentController.cancelAppointment);

module.exports = router;