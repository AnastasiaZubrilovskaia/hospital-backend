const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { Doctor } = require('../models');

router.get('/', async (req, res) => {
  try {
    const { specialty } = req.query;

    const where = {};
    if (specialty) {
      const { Specialty } = require('../models');
      const found = await Specialty.findOne({ where: { name: specialty } });
      if (found) {
        where.specialtyId = found.id;
      } else {
        return res.json([]); // нет врачей с такой специальностью
      }
    }

    const doctors = await Doctor.findAll({
      where,
      include: [{
        model: require('../models').Specialty,
        attributes: ['name']
      }]
    });

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', doctorController.getDoctorById);
router.get('/specialty/:specialtyId', doctorController.getDoctorsBySpecialty);

module.exports = router;