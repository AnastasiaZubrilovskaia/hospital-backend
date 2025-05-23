const { Review, Doctor, Appointment } = require('../models');

const createReview = async (req, res) => {
  try {
    const { doctorId, rating, comment } = req.body;
    const patientId = req.patient.id;

    // Проверка, что пациент действительно был у этого врача
    const hasAppointment = await Appointment.findOne({
      where: {
        PatientId: patientId,
        DoctorId: doctorId,
        status: 'completed'
      }
    });

    if (!hasAppointment) {
      return res.status(403).json({ message: 'You can only review doctors you have visited' });
    }

    // Проверка, что отзыв еще не оставлен
    const existingReview = await Review.findOne({
      where: {
        PatientId: patientId,
        DoctorId: doctorId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this doctor' });
    }

    const review = await Review.create({
      rating,
      comment,
      status: 'pending',
      PatientId: patientId,
      DoctorId: doctorId
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { 
        DoctorId: req.params.doctorId,
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

const getPatientReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { PatientId: req.patient.id },
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

const updateReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        PatientId: req.patient.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.status !== 'pending') {
      return res.status(403).json({ message: 'Only pending reviews can be updated' });
    }

    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: {
        id: req.params.id,
        PatientId: req.patient.id
      }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.destroy();
    res.json({ message: 'Review deleted successfully' });
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