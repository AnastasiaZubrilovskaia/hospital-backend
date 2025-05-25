const authService = require('../services/authService');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const patient = await authService.registerPatient(req.body);
    const { token } = await authService.loginPatient(patient.email, req.body.password);
    res.status(201).json({
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        role: patient.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const { patient, token } = await authService.loginPatient(email, password);
    
    res.json({
      patient: {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        role: patient.role
      },
      token
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const patient = await authService.getPatientProfile(req.patient.id);
    // console.log('Patient profile:', patient?.toJSON ? patient.toJSON() : patient);
    res.json(patient);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const patient = await authService.updatePatientProfile(req.patient.id, req.body);
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};