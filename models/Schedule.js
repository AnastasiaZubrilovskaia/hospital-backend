const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'doctors',
        key: 'id'
      }
    },
    dayOfWeek: {
      type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
      allowNull: false
    },
    startTime: {
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
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        isTime(value) {
          if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(value)) {
            throw new Error('Invalid time format (HH:MM)');
          }
        },
        isAfterStartTime(value) {
          if (this.startTime && value <= this.startTime) {
            throw new Error('End time must be after start time');
          }
        }
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'schedules',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Doctor, {
      foreignKey: 'doctorId',
      as: 'doctor'
    });
    
    Schedule.hasMany(models.Appointment, {
      foreignKey: 'scheduleId',
      as: 'appointments'
    });
  };

  // Метод для получения активных временных слотов
  Schedule.prototype.getAvailableSlots = async function() {
    const slots = [];
    let current = new Date(`1970-01-01T${this.startTime}`);
    const end = new Date(`1970-01-01T${this.endTime}`);
    
    while (current < end) {
      const timeString = current.toTimeString().substring(0, 5);
      slots.push(timeString);
      current.setMinutes(current.getMinutes() + 30); // 30-минутные слоты
    }
    
    return slots;
  };

  Schedule.prototype.countAppointments = async function() {
    return await sequelize.models.Appointment.count({
      where: {
        scheduleId: this.id,
        status: 'scheduled'
      }
    });
  };

  return Schedule;
};