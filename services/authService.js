const jwt = require('jsonwebtoken');
const { Patient } = require('../models');
const jwtConfig = require('../config/jwt');
const bcrypt = require('bcryptjs');

const registerPatient = async (patientData) => {
  try {
    const existingPatient = await Patient.findOne({ where: { email: patientData.email } });
    if (existingPatient) {
      throw new Error('Patient with this email already exists');
    }

    const patient = await Patient.create(patientData);
    return patient;
  } catch (error) {
    throw error;
  }
};

const loginPatient = async (email, password) => {
  try {
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await patient.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: patient.id, role: patient.role },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { patient, token };
  } catch (error) {
    throw error;
  }
};

const getPatientProfile = async (patientId) => {
  try {
    const patient = await Patient.findByPk(patientId, {
      attributes: { exclude: ['password'] }
    });
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  } catch (error) {
    throw error;
  }
};

const updatePatientProfile = async (patientId, updateData) => {
  try {
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await patient.update(updateData);
    return patient;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile
};