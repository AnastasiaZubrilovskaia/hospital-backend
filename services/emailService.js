const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendAppointmentConfirmation(patientEmail, appointmentDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: 'Подтверждение записи на прием',
        html: `
          <h2>Ваша запись на прием подтверждена</h2>
          <p><strong>Врач:</strong> ${appointmentDetails.doctorName}</p>
          <p><strong>Дата:</strong> ${appointmentDetails.date}</p>
          <p><strong>Время:</strong> ${appointmentDetails.time}</p>
          <p><strong>Место:</strong> ${appointmentDetails.location || 'Главный корпус, кабинет 305'}</p>
          <p>Пожалуйста, приходите за 10 минут до назначенного времени.</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      return false;
    }
  }

  async sendAppointmentReminder(patientEmail, appointmentDetails) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: 'Напоминание о записи на прием',
        html: `
          <h2>Напоминаем о вашей записи на завтра</h2>
          <p><strong>Врач:</strong> ${appointmentDetails.doctorName}</p>
          <p><strong>Дата:</strong> ${appointmentDetails.date}</p>
          <p><strong>Время:</strong> ${appointmentDetails.time}</p>
          <p>Пожалуйста, не забудьте взять с собой необходимые документы.</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending reminder email:', error);
      return false;
    }
  }

  async sendPasswordResetLink(patientEmail, resetToken) {
    try {
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: patientEmail,
        subject: 'Сброс пароля',
        html: `
          <h2>Запрос на сброс пароля</h2>
          <p>Для сброса пароля перейдите по ссылке:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Ссылка действительна в течение 1 часа.</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }
}

module.exports = new EmailService();