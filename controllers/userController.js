const { Patient, Appointment, Review } = require('../models');

const getUserProfile = async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.patient.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Appointment,
          as: 'Appointments',
          limit: 5,
          order: [['date', 'DESC']],
          include: [{ model: Doctor }]
        },
        {
          model: Review,
          as: 'Reviews',
          limit: 5,
          order: [['createdAt', 'DESC']],
          include: [{ model: Doctor }]
        }
      ]
    });

    if (!patient) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { PatientId: req.patient.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const reviews = await Review.findAll({
      where: { PatientId: req.patient.id },
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    res.json({ appointments, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  getUserActivity
};