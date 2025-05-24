const { Appointment, Schedule, sequelize } = require('../models');
const { Op } = require('sequelize');

async function getAvailableSlots(req, res) {
  try {
    const { doctorId, dayOfWeek } = req.params;
    
    // 1. Находим активное расписание врача на указанный день
    const schedule = await Schedule.findOne({
      where: { 
        doctorId,
        dayOfWeek,
        isActive: true 
      }
    });

    if (!schedule) {
      return res.json([]);
    }

    // 2. Получаем все записи на этот день
    const appointments = await Appointment.findAll({
      where: {
        scheduleId: schedule.id,
        status: 'scheduled'
      },
      attributes: ['time']
    });

    // 3. Генерируем все возможные слоты
    const allSlots = [];
    let currentTime = new Date(`1970-01-01T${schedule.startTime}`);
    const endTime = new Date(`1970-01-01T${schedule.endTime}`);
    
    while (currentTime < endTime) {
      const timeString = currentTime.toTimeString().substring(0, 5);
      allSlots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + 30); // 30-минутные слоты
    }

    // 4. Фильтруем занятые слоты
    const bookedSlots = appointments.map(a => a.time);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function createAppointment(req, res) {
  try {
    const { scheduleId, time } = req.body;
    const patientId = req.user.id;

    const appointment = await Appointment.create({
      scheduleId,
      time,
      patientId,
      status: 'scheduled'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getPatientAppointments(req, res) {
  try {
    const patientId = req.user.id;
    const appointments = await Appointment.findAll({
      where: { patientId },
      include: [
        {
          model: Schedule,
          include: ['doctor']
        }
      ]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAppointmentDetails(req, res) {
  try {
    const { id } = req.params;
    const patientId = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, patientId },
      include: [
        {
          model: Schedule,
          include: ['doctor']
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const patientId = req.user.id;

    const appointment = await Appointment.findOne({
      where: { id, patientId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.status === 'canceled') {
      return res.status(400).json({ error: 'Appointment is already canceled' });
    }

    appointment.status = 'canceled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAvailableSlots,
  createAppointment,
  getPatientAppointments,
  getAppointmentDetails,
  cancelAppointment
};