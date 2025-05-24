const express = require('express');
const router = express.Router();
const { Doctor } = require('../models');
const { Sequelize } = require('sequelize');
const { Specialty } = require('../models');

router.get('/', async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      attributes: ['id', 'name', 'description'] 
    });
    res.json(specialties);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;