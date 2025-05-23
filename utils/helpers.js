const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');

class Helpers {
  static formatDate(date, format = 'DD.MM.YYYY') {
    return moment(date).format(format);
  }

  static generateJWT(payload) {
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
  }

  static generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async paginate(model, query, page = 1, limit = 10, include = []) {
    const offset = (page - 1) * limit;
    
    const { count, rows } = await model.findAndCountAll({
      where: query,
      limit,
      offset,
      include,
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    return {
      data: rows,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  static validatePhoneNumber(phone) {
    const regex = /^\+?\d{10,15}$/;
    return regex.test(phone);
  }

  static calculateAge(birthDate) {
    return moment().diff(moment(birthDate), 'years');
  }

  static generateTimeSlots(startTime = '09:00', endTime = '18:00', interval = 30) {
    const slots = [];
    let currentTime = moment(startTime, 'HH:mm');
    const endTimeMoment = moment(endTime, 'HH:mm');

    while (currentTime <= endTimeMoment) {
      slots.push(currentTime.format('HH:mm'));
      currentTime.add(interval, 'minutes');
    }

    return slots;
  }
}

module.exports = Helpers;