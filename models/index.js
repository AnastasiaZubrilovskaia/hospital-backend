const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(config);

const db = {};

db.Patient = require('./Patient')(sequelize);
db.Doctor = require('./Doctor')(sequelize);
db.Specialty = require('./Specialty')(sequelize);
db.Appointment = require('./Appointment')(sequelize);
db.Review = require('./Review')(sequelize);

// Установка связей
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;