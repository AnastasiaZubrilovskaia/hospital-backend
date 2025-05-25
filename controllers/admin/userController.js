const { Patient } = require('../../models');

const getAllUsers = async (req, res) => {
  try {
    const users = await Patient.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await Patient.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await Patient.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Не позволяем админу менять свой собственный статус
    if (req.patient.id === user.id && req.body.role && req.body.role !== user.role) {
      return res.status(403).json({ message: 'You cannot change your own role' });
    }

    await user.update(req.body);
    const updatedUser = await Patient.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await Patient.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Не позволяем админу удалять самого себя
    if (req.patient.id === user.id) {
      return res.status(403).json({ message: 'You cannot delete yourself' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, birthDate } = req.body;

    // Проверка на существование email
    const existingUser = await Patient.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const admin = await Patient.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      birthDate,
      role: 'admin'
    });

    // Удалим пароль из ответа
    const { password: _, ...adminWithoutPassword } = admin.get({ plain: true });

    res.status(201).json(adminWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createAdmin
};