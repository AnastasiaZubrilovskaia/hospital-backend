const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id'
      }
    },
    scheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'schedules',
        key: 'id'
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isTime(value) {
          if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
            throw new Error('Invalid time format (HH:MM)');
          }
        }
      }
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'canceled'),
      defaultValue: 'scheduled'
    }
  }, {
    tableName: 'appointments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Patient, { foreignKey: 'patientId' });
    Appointment.belongsTo(models.Schedule, { foreignKey: 'scheduleId' });
  };

  return Appointment;
};