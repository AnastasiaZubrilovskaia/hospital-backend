const { Doctor, Specialty } = require('../models');

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [{
        model: Specialty,
        attributes: ['name']
      }]
    });
    console.log(JSON.stringify(doctors, null, 2));
    console.log(doctors.map(d => ({ id: d.id, spec: d.Specialty })));
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id, {
      include: [{
        model: Specialty,
        attributes: ['name', 'description']
      }]
    });

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDoctorsBySpecialty = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      where: { SpecialtyId: req.params.specialtyId },
      include: [{
        model: Specialty,
        attributes: ['name']
      }]
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpecialty
};
