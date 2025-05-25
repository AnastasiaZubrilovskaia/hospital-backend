const { Appointment, Patient, Doctor, sequelize } = require('../../models');

// Получить все записи
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: Patient, attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Doctor, include: ['Specialty'] }
      ],
      order: [['appointment_date', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить запись по ID
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: Patient, attributes: ['id', 'firstName', 'lastName', 'email'] },
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

// Обновить запись
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удалить запись
const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получить записи по дате
const getAppointmentsByDate = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: sequelize.where(
        sequelize.fn('DATE', sequelize.col('appointment_date')),
        req.params.date
      ),
      include: [
        { model: Patient, attributes: ['id', 'firstName', 'lastName'] },
        { model: Doctor, include: ['Specialty'] }
      ],
      order: [['appointment_date', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDate
};
