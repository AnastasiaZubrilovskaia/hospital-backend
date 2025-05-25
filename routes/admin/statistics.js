const express = require('express');
const router = express.Router();
const AnalyticsService = require('../../services/analyticsService');

router.get('/general', async (req, res) => {
  try {
    const data = await AnalyticsService.getGeneralStatistics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/appointments', async (req, res) => {
  try {
    const data = await AnalyticsService.getAppointmentsAnalytics(req.query.period);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/doctors', async (req, res) => {
  try {
    const data = await AnalyticsService.getDoctorsPerformance();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/specialties', async (req, res) => {
  try {
    const data = await AnalyticsService.getPopularSpecialties();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
