const sequelize = require('../config/database');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

// Определение связей между моделями
Doctor.belongsTo(Specialty);
Specialty.hasMany(Doctor);

Appointment.belongsTo(Patient);
Patient.hasMany(Appointment);

Appointment.belongsTo(Doctor);
Doctor.hasMany(Appointment);

Review.belongsTo(Patient);
Patient.hasMany(Review);

Review.belongsTo(Doctor);
Doctor.hasMany(Review);

const initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Создание тестовых данных
    await createTestData();
    console.log('Test data created');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

const createTestData = async () => {
  // Создание специальностей
  const specialties = await Specialty.bulkCreate([
    { name: 'Терапевт', description: 'Общая медицина' },
    { name: 'Кардиолог', description: 'Лечение сердечно-сосудистых заболеваний' },
    { name: 'Невролог', description: 'Лечение заболеваний нервной системы' }
  ]);

  // Создание врачей
  const doctors = await Doctor.bulkCreate([
    { 
      firstName: 'Иван', 
      lastName: 'Петров', 
      email: 'ivan.petrov@example.com', 
      phone: '+79101234567', 
      experience: 10, 
      education: 'МГМУ им. Сеченова', 
      SpecialtyId: specialties[0].id 
    },
    { 
      firstName: 'Мария', 
      lastName: 'Сидорова', 
      email: 'maria.sidorova@example.com', 
      phone: '+79107654321', 
      experience: 15, 
      education: 'РНИМУ им. Пирогова', 
      SpecialtyId: specialties[1].id 
    }
  ]);

  // Создание пациентов
  const patients = await Patient.bulkCreate([
    { 
      firstName: 'Алексей', 
      lastName: 'Иванов', 
      email: 'alexey.ivanov@example.com', 
      password: 'password123', 
      phone: '+79105554433', 
      birthDate: '1985-05-15' 
    },
    { 
      firstName: 'Елена', 
      lastName: 'Смирнова', 
      email: 'elena.smirnova@example.com', 
      password: 'password123', 
      phone: '+79108887766', 
      birthDate: '1990-08-20',
      role: 'admin'
    }
  ]);

  // Создание записей на прием
  const appointments = await Appointment.bulkCreate([
    { 
      date: '2023-06-15', 
      time: '10:00', 
      status: 'scheduled', 
      PatientId: patients[0].id, 
      DoctorId: doctors[0].id 
    },
    { 
      date: '2023-06-16', 
      time: '14:30', 
      status: 'scheduled', 
      PatientId: patients[0].id, 
      DoctorId: doctors[1].id 
    }
  ]);

  // Создание отзывов
  const reviews = await Review.bulkCreate([
    { 
      rating: 5, 
      comment: 'Отличный врач, очень внимательный!', 
      status: 'approved', 
      PatientId: patients[0].id, 
      DoctorId: doctors[0].id 
    },
    { 
      rating: 4, 
      comment: 'Хороший специалист, но пришлось ждать приема', 
      status: 'pending', 
      PatientId: patients[0].id, 
      DoctorId: doctors[1].id 
    }
  ]);
};

initDb();