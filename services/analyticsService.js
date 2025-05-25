const { Appointment, Doctor, Patient, Review, Specialty, sequelize, Sequelize } = require('../models');
const moment = require('moment');

class AnalyticsService {
  async getGeneralStatistics() {
    try {
      const [
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalSpecialties,
        upcomingAppointments,
        recentReviews
      ] = await Promise.all([
        Patient.count(),
        Doctor.count(),
        Appointment.count(),
        Specialty.count(),
        Appointment.count({
          where: {
            appointment_date: { [Sequelize.Op.gte]: new Date() },
            status: 'scheduled'
          }
        }),
        Review.count({
          where: {
            status: 'pending'
          }
        })
      ]);

      return {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalSpecialties,
        upcomingAppointments,
        pendingReviews: recentReviews
      };
    } catch (error) {
      console.error('Error getting general statistics:', error);
      throw error;
    }
  }

  async getAppointmentsAnalytics(timePeriod = 'month') {
    try {
      let groupBy;
      let dateFormat;

      switch (timePeriod) {
        case 'day':
          groupBy = 'day';
          dateFormat = '%Y-%m-%d';
          break;
        case 'week':
          groupBy = 'week';
          dateFormat = '%Y-%W'; // Используем %W для номера недели в SQLite
          break;
        case 'year':
          groupBy = 'year';
          dateFormat = '%Y';
          break;
        default: // month
          groupBy = 'month';
          dateFormat = '%Y-%m';
      }

      const results = await Appointment.findAll({
        attributes: [
          [sequelize.fn('strftime', dateFormat, sequelize.col('appointment_date')), groupBy],
          [sequelize.fn('count', '*'), 'count'],
          [sequelize.fn('sum', sequelize.literal("CASE WHEN status = 'completed' THEN 1 ELSE 0 END")), 'completed'],
          [sequelize.fn('sum', sequelize.literal("CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END")), 'cancelled'] 
        ],
        group: [sequelize.fn('strftime', dateFormat, sequelize.col('appointment_date'))],
        order: [[sequelize.fn('strftime', dateFormat, sequelize.col('appointment_date')), 'ASC']],
        raw: true
      });

      return {
        timePeriod,
        data: results
      };
    } catch (error) {
      console.error('Error getting appointments analytics:', error);
      throw error;
    }
  }

  async getDoctorsPerformance() {
    try {
      const doctors = await Doctor.findAll({
        attributes: [
          'id',
          'firstName',
          'lastName',
          [sequelize.literal('(SELECT COUNT(*) FROM appointments WHERE appointments.doctor_id = Doctor.id)'), 'totalAppointments'],
          [sequelize.literal('(SELECT AVG(rating) FROM reviews WHERE reviews.doctor_id = Doctor.id AND status = "approved")'), 'avgRating'],
          [sequelize.literal('(SELECT COUNT(*) FROM reviews WHERE reviews.doctor_id = Doctor.id AND status = "approved")'), 'reviewsCount']
        ],
        include: [{
          model: Specialty,
          attributes: ['name']
        }],
        order: [[sequelize.literal('avgRating'), 'DESC']],
        limit: 10
      });

      return doctors;
    } catch (error) {
      console.error('Error getting doctors performance:', error);
      throw error;
    }
  }

  async getPopularSpecialties() {
    try {
      const specialties = await Specialty.findAll({
        attributes: [
          'id',
          'name',
          [sequelize.literal('(SELECT COUNT(*) FROM doctors WHERE doctors.specialty_id = Specialty.id)'), 'doctorsCount'],
          [sequelize.literal('(SELECT COUNT(*) FROM appointments WHERE appointments.doctor_id IN (SELECT id FROM doctors WHERE doctors.specialty_id = Specialty.id))'), 'appointmentsCount']
        ],
        order: [[sequelize.literal('appointmentsCount'), 'DESC']],
        limit: 5
      });

      return specialties;
    } catch (error) {
      console.error('Error getting popular specialties:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();
