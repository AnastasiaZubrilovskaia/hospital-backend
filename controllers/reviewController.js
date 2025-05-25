const { Review, Doctor, Appointment, Patient } = require('../models');

// Создание нового отзыва
const createReview = async (req, res, next) => {
  const doctorId = parseInt(req.params.doctorId, 10);
  const rating = parseInt(req.body.rating, 10);
  const comment = req.body.comment;
  const patientId = req.patient.id;

  console.log('➡️ createReview() запущен');
  console.log('doctorId:', doctorId, typeof doctorId);
  console.log('rating:', rating, typeof rating);
  console.log('comment:', comment);
  console.log('patientId:', patientId);

  if (isNaN(doctorId)) {
    console.log('❌ Некорректный doctorId');
    return res.status(400).json({ message: 'Некорректный ID врача' });
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    console.log('❌ Некорректный рейтинг');
    return res.status(400).json({ message: 'Оценка должна быть числом от 1 до 5' });
  }

  if (!comment || comment.trim() === '') {
    console.log('❌ Комментарий пустой');
    return res.status(400).json({ message: 'Комментарий обязателен' });
  }

  if (comment.length < 10) {
    console.log('❌ Комментарий слишком короткий');
    return res.status(400).json({ message: 'Комментарий должен быть не короче 10 символов' });
  }

  try {
    const existingReview = await Review.findOne({ where: { patientId, doctorId } });
    if (existingReview) {
      console.log('Обновляем существующий отзыв');
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

    console.log('✅ Отзыв создан:', review);
    return res.status(201).json(review);
  } catch (error) {
    console.error('💥 Ошибка в createReview:', error);
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
        // status: 'approved'
        status: ['approved', 'pending']
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
