const { Appointment, Doctor, Patient } = require('../models');

const createAppointment = async (req, res) => {
  try {
    const { date, time, doctorId, notes } = req.body;
    const patientId = req.patient.id;

    // Проверка доступности времени у врача
    const existingAppointment = await Appointment.findOne({
      where: {
        date,
        time,
        doctorId,
        status: 'scheduled'
      }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create({
      date,
      time,
      notes,
      status: 'scheduled',
      PatientId: patientId,
      DoctorId: doctorId
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { PatientId: req.patient.id },
      include: [
        { model: Doctor, include: ['Specialty'] }
      ],
      order: [['date', 'DESC'], ['time', 'DESC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAppointmentDetails = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        PatientId: req.patient.id
      },
      include: [
        { model: Doctor, include: ['Specialty'] }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      where: {
        id: req.params.id,
        PatientId: req.patient.id,
        status: 'scheduled'
      }
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or already canceled/completed' });
    }

    await appointment.update({ status: 'canceled' });
    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    
    // Здесь должна быть логика получения доступных слотов
    // Это пример - в реальном приложении нужно учитывать график работы врача
    const bookedSlots = await Appointment.findAll({
      where: {
        doctorId,
        date,
        status: 'scheduled'
      },
      attributes: ['time']
    });

    const bookedTimes = bookedSlots.map(slot => slot.time);
    
    // Генерация стандартных временных слотов (каждый час с 9:00 до 18:00)
    const allSlots = [];
    for (let hour = 9; hour < 18; hour++) {
      allSlots.push(`${hour}:00:00`);
    }

    const availableSlots = allSlots.filter(time => !bookedTimes.includes(time));
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAppointment,
  getPatientAppointments,
  getAppointmentDetails,
  cancelAppointment,
  getAvailableSlots
};