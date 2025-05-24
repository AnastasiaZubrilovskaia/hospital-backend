const express = require('express');
const router = express.Router();
const { Doctor } = require('../models');
const { Sequelize } = require('sequelize');

router.get('/', async (req, res) => {
  try {
    const specialties = await Doctor.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('specialty')), 'name'],
      ],
      raw: true,
    });
    res.json(specialties.map(s => ({ name: s.name })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;