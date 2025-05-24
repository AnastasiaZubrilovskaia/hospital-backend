const express = require('express');
const router = express.Router();
const scheduleController = require('../../controllers/admin/scheduleController');
const { authMiddleware, adminMiddleware } = require('../../middlewares/authMiddleware');
const validate = require('../../middlewares/validationMiddleware');
const { check } = require('express-validator');

router.use(authMiddleware, adminMiddleware);

router.post('/', 
  validate([
    check('doctor_id').isInt().withMessage('Doctor ID must be integer'),
    check('day_of_week').isIn([
      'monday', 'tuesday', 'wednesday', 
      'thursday', 'friday', 'saturday', 'sunday'
    ]),
    check('start_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
    check('end_time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  ]),
  scheduleController.createSchedule
);

router.get('/doctor/:doctor_id', scheduleController.getDoctorSchedule);
router.put('/:id', scheduleController.updateSchedule);
router.delete('/:id', scheduleController.deleteSchedule);
router.get('/', scheduleController.getAllSchedules);

module.exports = router;