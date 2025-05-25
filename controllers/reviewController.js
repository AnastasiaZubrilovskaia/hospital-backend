const { Review, Doctor, Appointment, Patient } = require('../models');


const createReview = async (req, res, next) => {
  const doctorId = parseInt(req.params.doctorId, 10);
  const rating = parseInt(req.body.rating, 10);
  const comment = req.body.comment;
  const patientId = req.patient.id;

  if (isNaN(doctorId)) {
    return res.status(400).json({ message: 'Некорректный ID врача' });
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Оценка должна быть числом от 1 до 5' });
  }

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Комментарий обязателен' });
  }

  if (comment.length < 10) {
    return res.status(400).json({ message: 'Комментарий должен быть не короче 10 символов' });
  }

  try {
    const existingReview = await Review.findOne({ where: { patientId, doctorId } });
    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.status = 'pending';
      await existingReview.save();
      return res.status(200).json(existingReview);
    }
    const review = await Review.create({
      rating,
      comment,
      status: 'pending',
      patientId,
      doctorId
    });

    return res.status(201).json(review);
  } catch (error) {
    return res.status(500).json({ message: 'Ошибка сервера' });
  }
};



// Получение отзывов о конкретном враче
const getDoctorReviews = async (req, res) => {
  try {
    const doctorId = parseInt(req.params.doctorId, 10);
    if (isNaN(doctorId)) {
      return res.status(400).json({ message: 'Некорректный ID врача' });
    }

    const reviews = await Review.findAll({
      where: {
        doctorId,
        status: 'approved'
      },
      include: [
        { model: Patient, attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Получение всех отзывов пациента
const getPatientReviews = async (req, res) => {
  try {
    const patientId = req.patient.id;

    const reviews = await Review.findAll({
      where: { patientId },
      include: [
        { model: Doctor, attributes: ['firstName', 'lastName'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Обновление отзыва (если он еще не одобрен)
const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        patientId: req.patient.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    if (review.status !== 'pending') {
      return res.status(403).json({ message: 'Можно редактировать только отзывы в статусе "на модерации"' });
    }

    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Удаление отзыва
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        patientId: req.patient.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    await review.destroy();
    res.json({ message: 'Отзыв успешно удален' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview
};
