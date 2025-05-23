require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'hd5$faI82kdGe35',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'grggIndh4Gnsidhl62dsF8$',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};