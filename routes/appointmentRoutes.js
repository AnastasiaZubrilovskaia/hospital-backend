const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware);

// Получить доступные слоты по доктору и дате
router.get('/available/:doctorId/:date', appointmentController.getAvailableSlots);

// Создать новую запись
router.post(
  '/',
  validate([
    check('doctorId').isInt().withMessage('doctorId должен быть числом'),
    check('appointment_date')
      .isISO8601()
      .withMessage('Некорректный формат даты и времени, ожидается ISO8601'),
  ]),
  appointmentController.createAppointment
);

// Получить все записи пациента
router.get('/', appointmentController.getPatientAppointments);

// Получить конкретную запись
router.get('/:id', appointmentController.getAppointmentDetails);

// Отменить запись
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
