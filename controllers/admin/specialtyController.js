const { Specialty } = require('../../models');

const createSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    res.status(201).json(specialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.findAll({
      order: [['name', 'ASC']]
    });
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSpecialtyById = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }
    res.json(specialty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    await specialty.update(req.body);
    res.json(specialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByPk(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Specialty not found' });
    }

    await specialty.destroy();
    res.json({ message: 'Specialty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createSpecialty,
  getAllSpecialties,
  getSpecialtyById,
  updateSpecialty,
  deleteSpecialty
};