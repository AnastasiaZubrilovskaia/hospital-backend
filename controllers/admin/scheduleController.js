const { Schedule, Doctor } = require('../../models');

module.exports = {
  async createSchedule(req, res) {
    try {
      const { doctor_id, day_of_week, start_time, end_time } = req.body;
      
      const doctor = await Doctor.findByPk(doctor_id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const schedule = await Schedule.create({
        doctor_id,
        day_of_week,
        start_time,
        end_time
      });

      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getDoctorSchedule(req, res) {
    try {
      const schedules = await Schedule.findAll({
        where: { doctor_id: req.params.doctor_id },
        include: ['doctor'],
        order: [
          ['day_of_week', 'ASC'],
          ['start_time', 'ASC']
        ]
      });
      
      // Добавляем доступные слоты к каждому расписанию
      const schedulesWithSlots = await Promise.all(
        schedules.map(async schedule => {
          const slots = await schedule.getAvailableSlots();
          return { ...schedule.toJSON(), slots };
        })
      );

      res.json(schedulesWithSlots);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateSchedule(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }

      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Получение всего расписания
  async getAllSchedules(req, res) {
    try {
      const schedules = await Schedule.findAll({
        include: [
          {
            model: Doctor,
            attributes: ['id', 'first_name', 'last_name']
          }
        ],
        order: [
          ['day_of_week', 'ASC'],
          ['start_time', 'ASC']
        ]
      });
      
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Удаление расписания
  async deleteSchedule(req, res) {
    const schedule = await Schedule.findByPk(req.params.id);
    
    // Отменяем все связанные записи
    await Appointment.update(
      { status: 'canceled' },
      { where: { scheduleId: schedule.id } }
    );
    
    await schedule.destroy();
    res.json({ success: true });
  }
};