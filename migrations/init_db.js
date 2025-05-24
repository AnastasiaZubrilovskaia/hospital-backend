const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

// Импорт моделей
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Specialty = require('../models/Specialty');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Schedule = require('../models/Schedule');

// Инициализация моделей
const PatientModel = Patient(sequelize);
const DoctorModel = Doctor(sequelize);
const SpecialtyModel = Specialty(sequelize);
const AppointmentModel = Appointment(sequelize);
const ReviewModel = Review(sequelize);
const ScheduleModel = Schedule(sequelize);

// Определение связей между моделями
DoctorModel.belongsTo(SpecialtyModel, { foreignKey: 'specialtyId' });
SpecialtyModel.hasMany(DoctorModel, { foreignKey: 'specialtyId' });

AppointmentModel.belongsTo(PatientModel, { foreignKey: 'patientId' });
PatientModel.hasMany(AppointmentModel, { foreignKey: 'patientId' });

AppointmentModel.belongsTo(ScheduleModel, { foreignKey: 'scheduleId' });
ScheduleModel.hasMany(AppointmentModel, { foreignKey: 'scheduleId' });

ScheduleModel.belongsTo(DoctorModel, { foreignKey: 'doctorId' });
DoctorModel.hasMany(ScheduleModel, { foreignKey: 'doctorId' });

ReviewModel.belongsTo(PatientModel, { foreignKey: 'patientId' });
PatientModel.hasMany(ReviewModel, { foreignKey: 'patientId' });

ReviewModel.belongsTo(DoctorModel, { foreignKey: 'doctorId' });
DoctorModel.hasMany(ReviewModel, { foreignKey: 'doctorId' });

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
  const specialties = await SpecialtyModel.bulkCreate([
    { 
      name: 'Терапевт', 
      description: 'Врач-терапевт занимается диагностикой, лечением и профилактикой заболеваний внутренних органов. Проводит первичный осмотр пациентов, назначает необходимые анализы и исследования, разрабатывает схемы лечения и профилактики заболеваний.' 
    },
    { 
      name: 'Кардиолог', 
      description: 'Врач-кардиолог специализируется на диагностике, лечении и профилактике заболеваний сердечно-сосудистой системы. Проводит комплексное обследование сердца и сосудов, назначает и контролирует лечение, дает рекомендации по профилактике сердечных заболеваний.' 
    },
    { 
      name: 'Невролог', 
      description: 'Врач-невролог занимается диагностикой и лечением заболеваний центральной и периферической нервной системы. Проводит неврологическое обследование, назначает и контролирует лечение неврологических заболеваний, разрабатывает программы реабилитации.' 
    }
  ]);

  // Создание врачей
  const doctors = await DoctorModel.bulkCreate([
    { 
      firstName: 'Иван', 
      lastName: 'Петров', 
      email: 'ivan.petrov@example.com', 
      phone: '+79101234567', 
      experience: 10, 
      education: 'МГМУ им. Сеченова, лечебный факультет, 2013', 
      specialtyId: specialties[0].id,
      photo: null
    },
    { 
      firstName: 'Мария', 
      lastName: 'Сидорова', 
      email: 'maria.sidorova@example.com', 
      phone: '+79107654321', 
      experience: 15, 
      education: 'РНИМУ им. Пирогова, лечебный факультет, 2008', 
      specialtyId: specialties[1].id,
      photo: null
    }
  ]);

  // Создание пациентов
  const patients = await PatientModel.bulkCreate([
    { 
      firstName: 'Алексей', 
      lastName: 'Иванов', 
      email: 'alexey.ivanov@example.com', 
      password: 'password123', 
      phone: '+79105554433', 
      birthDate: '1985-05-15',
      role: 'patient'
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

  // Создание расписаний
  const schedules = await ScheduleModel.bulkCreate([
    {
      doctorId: doctors[0].id,
      dayOfWeek: 'monday',
      startTime: '09:00',
      endTime: '18:00',
      isActive: true
    },
    {
      doctorId: doctors[1].id,
      dayOfWeek: 'tuesday',
      startTime: '10:00',
      endTime: '19:00',
      isActive: true
    }
  ]);

  // Создание записей на прием
  const appointments = await AppointmentModel.bulkCreate([
    { 
      time: '10:00', 
      status: 'scheduled', 
      patientId: patients[0].id, 
      scheduleId: schedules[0].id 
    },
    { 
      time: '14:30', 
      status: 'scheduled', 
      patientId: patients[0].id, 
      scheduleId: schedules[1].id 
    }
  ]);

  // Создание отзывов
  const reviews = await ReviewModel.bulkCreate([
    { 
      rating: 5, 
      comment: 'Отличный врач, очень внимательный! Профессионал своего дела. Внимательно выслушал все жалобы, провел тщательный осмотр и назначил эффективное лечение. Рекомендую!', 
      status: 'pending', 
      patientId: patients[0].id, 
      doctorId: doctors[0].id 
    },
    { 
      rating: 4, 
      comment: 'Хороший специалист, но пришлось ждать приема дольше запланированного времени. В остальном все отлично: внимательный осмотр, подробные объяснения, грамотные назначения.', 
      status: 'pending', 
      patientId: patients[0].id, 
      doctorId: doctors[1].id 
    }
  ]);
};

initDb();