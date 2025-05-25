const { Appointment, Doctor, Patient, Specialty} = require('../models'); // подкорректируй путь и импорт моделей под свою структуру
const { Op } = require('sequelize');

const WORK_START = '09:00';
const WORK_END = '17:00';
const SLOT_DURATION_MINUTES = 30;

function generateTimeSlots(start, end) {
  const slots = [];
  let current = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (current < endTime) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + SLOT_DURATION_MINUTES);
  }

  return slots;
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

// Получить доступные слоты у доктора на конкретную дату
async function getAvailableSlots(req, res) {
  try {
    const { doctorId, date } = req.params;

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: 'Некорректная дата' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Доктор не найден' });
    }

    // Начало и конец даты для фильтра
    const [year, month, day] = date.split('-').map(Number);
    const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);  // локальное время 00:00
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999); // локальное время 23:59:59.999

    // Получаем все записи доктора на эту дату (status = scheduled)
    const appointments = await Appointment.findAll({
      where: {
        doctorId,
        appointment_date: {
          [Op.between]: [dayStart, dayEnd]
        },
        status: 'scheduled'
      },
      attributes: ['appointment_date']
    });

    // Забронированные слоты (только время)
    const bookedSlots = appointments.map(a => formatTime(new Date(a.appointment_date)));

    const allSlots = generateTimeSlots(WORK_START, WORK_END);
    const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({ error: error.message });
  }
}

// Создать новую запись
async function createAppointment(req, res) {
  try {
    const { doctorId, appointment_date } = req.body;
    const patientId = req.patient.id;

    if (!doctorId || !appointment_date) {
      return res.status(400).json({ error: 'doctorId и appointment_date обязательны' });
    }

    const appointmentDateObj = new Date(appointment_date);
    if (isNaN(appointmentDateObj.getTime())) {
      return res.status(400).json({ error: 'Некорректный формат даты и времени' });
    }

    const doctor = await Doctor.findByPk(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Доктор не найден' });
    }

    // Проверяем, что время попадает в рабочий график
    const timeStr = formatTime(appointmentDateObj);
    const allSlots = generateTimeSlots(WORK_START, WORK_END);

    if (!allSlots.includes(timeStr)) {
      return res.status(400).json({ error: 'Время вне рабочего графика' });
    }

    // Проверяем, что слот не занят
    const dayStart = new Date(appointmentDateObj);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(appointmentDateObj);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Appointment.findOne({
      where: {
        doctorId,
        appointment_date: appointmentDateObj,
        status: 'scheduled'
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Этот слот уже занят' });
    }

    const appointment = await Appointment.create({
      doctorId,
      patientId,
      appointment_date: appointmentDateObj,
      status: 'scheduled'
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получить все записи пациента
async function getPatientAppointments(req, res) {
  try {
    const patientId = req.patient.id;

    const appointments = await Appointment.findAll({
      where: { patientId },
      include: [
        {
          model: Doctor,
          include: [
            {
              model: Specialty
            }
          ]
        }
      ]
    });
    

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Получить детали конкретной записи пациента
async function getAppointmentDetails(req, res) {
  try {
    const { id } = req.params;
    const patientId = req.patient.id;

    const appointment = await Appointment.findOne({
      where: { id, patientId },
      include: [
        {
          model: Doctor,
          include: [Specialty]  // чтобы подтянулась специальность и сюда тоже
        }
      ]
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Отмена записи
async function cancelAppointment(req, res) {
  try {
    const { id } = req.params;
    const patientId = req.patient.id;

    const appointment = await Appointment.findOne({
      where: { id, patientId }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Запись не найдена' });
    }

    if (appointment.status === 'cancelled') {
      return res.status(400).json({ error: 'Запись уже отменена' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAvailableSlots,
  createAppointment,
  getPatientAppointments,
  getAppointmentDetails,
  cancelAppointment
};
