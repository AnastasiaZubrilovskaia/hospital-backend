const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { Doctor } = require('../models');

router.get('/', async (req, res) => {
  const { specialty } = req.query;
  const where = {};
  if (specialty) {
    where.specialty = specialty;
  }
  const doctors = await Doctor.findAll({ where });
  res.json(doctors);
});

router.get('/:id', doctorController.getDoctorById);
router.get('/specialty/:specialtyId', doctorController.getDoctorsBySpecialty);

module.exports = router;