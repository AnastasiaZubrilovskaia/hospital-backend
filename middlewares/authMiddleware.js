const jwt = require('jsonwebtoken');
const { Patient } = require('../models');
const jwtConfig = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    const patient = await Patient.findByPk(decoded.id);

    if (!patient) {
      return res.status(401).json({ message: 'Patient not found' });
    }

    req.patient = patient;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    if (req.patient.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
    next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authMiddleware, adminMiddleware };