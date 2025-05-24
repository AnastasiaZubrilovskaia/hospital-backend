const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

const db = {};

db.Patient = require('./Patient')(sequelize);
db.Doctor = require('./Doctor')(sequelize);
db.Specialty = require('./Specialty')(sequelize);
db.Appointment = require('./Appointment')(sequelize);
db.Review = require('./Review')(sequelize);
db.Schedule = require('./Schedule')(sequelize)

// Установка связей
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Синхронизация моделей с базой данных
sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Error synchronizing database:', err);
  });

module.exports = db;