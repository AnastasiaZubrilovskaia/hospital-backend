require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./models');


// Импорт роутов
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const specialtiesRouter = require('./routes/specialties');

// Импорт админских роутов
const adminDoctorRoutes = require('./routes/admin/doctorRoutes');
const adminAppointmentRoutes = require('./routes/admin/appointmentRoutes');
const adminReviewRoutes = require('./routes/admin/reviewRoutes');
const adminSpecialtyRoutes = require('./routes/admin/specialtyRoutes');
const adminUserRoutes = require('./routes/admin/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключение к базе данных
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error:', err));

// Основные роуты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/specialties', specialtiesRouter);

// Админские роуты
app.use('/api/admin/doctors', adminDoctorRoutes);
app.use('/api/admin/appointments', adminAppointmentRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/admin/specialties', adminSpecialtyRoutes);
app.use('/api/admin/users', adminUserRoutes);

// Маршруты аутентификации
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email, password }); // для отладки
    // ваша логика авторизации
    res.json({ token: 'your-token' });
  } catch (error) {
    console.error('Login error:', error); // для отладки
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const userData = req.body;
    console.log('Registration attempt:', userData); // для отладки
    // ваша логика регистрации
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error); // для отладки
    res.status(500).json({ message: error.message });
  }
});

// Обработка ошибок
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});