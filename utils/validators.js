const { check } = require('express-validator');
const { Patient } = require('../models');

const patientRegistrationValidator = [
  check('firstName')
    .notEmpty().withMessage('Имя обязательно')
    .isLength({ max: 50 }).withMessage('Имя не должно превышать 50 символов'),
  
  check('lastName')
    .notEmpty().withMessage('Фамилия обязательна')
    .isLength({ max: 50 }).withMessage('Фамилия не должна превышать 50 символов'),
  
  check('email')
    .isEmail().withMessage('Некорректный email')
    .custom(async (email) => {
      const patient = await Patient.findOne({ where: { email } });
      if (patient) {
        throw new Error('Email уже используется');
      }
    }),
  
  check('password')
    .isLength({ min: 6 }).withMessage('Пароль должен быть не менее 6 символов')
    .matches(/\d/).withMessage('Пароль должен содержать хотя бы одну цифру'),
  
  check('phone')
    .notEmpty().withMessage('Телефон обязателен')
    .matches(/^\+?\d{10,15}$/).withMessage('Некорректный номер телефона'),
  
  check('birthDate')
    .isDate().withMessage('Некорректная дата рождения')
    .custom((value) => {
      const birthDate = new Date(value);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 18);
      
      if (birthDate < minDate || birthDate > maxDate) {
        throw new Error('Возраст должен быть от 18 до 120 лет');
      }
      return true;
    })
];

const appointmentValidator = [
  check('doctorId')
    .isInt().withMessage('ID врача должен быть числом')
    .custom(async (value) => {
      const doctor = await Doctor.findByPk(value);
      if (!doctor) {
        throw new Error('Врач не найден');
      }
    }),
  
  check('date')
    .isDate().withMessage('Некорректная дата')
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (appointmentDate < today) {
        throw new Error('Дата не может быть в прошлом');
      }
      return true;
    }),
  
  check('time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Некорректное время (формат HH:MM)')
];

const reviewValidator = [
  check('doctorId')
    .isInt().withMessage('ID врача должен быть числом'),
  
  check('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Рейтинг должен быть от 1 до 5'),
  
  check('comment')
    .isLength({ min: 10, max: 500 }).withMessage('Комментарий должен быть от 10 до 500 символов')
];

const passwordResetValidator = [
  check('email')
    .isEmail().withMessage('Некорректный email')
    .custom(async (email) => {
      const patient = await Patient.findOne({ where: { email } });
      if (!patient) {
        throw new Error('Пользователь с таким email не найден');
      }
    })
];

module.exports = {
  patientRegistrationValidator,
  appointmentValidator,
  reviewValidator,
  passwordResetValidator
};