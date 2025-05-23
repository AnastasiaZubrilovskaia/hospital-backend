const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  const Patient = sequelize.define('Patient', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100]
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\+?[\d\s-]{10,15}$/
      }
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('patient', 'admin'),
      defaultValue: 'patient'
    }
  }, {
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (patient) => {
        if (patient.password) {
          patient.password = await bcrypt.hash(patient.password, 10);
        }
      },
      beforeUpdate: async (patient) => {
        if (patient.changed('password')) {
          patient.password = await bcrypt.hash(patient.password, 10);
        }
      }
    }
  });

  Patient.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  Patient.associate = (models) => {
    Patient.hasMany(models.Appointment, { foreignKey: 'patient_id' });
    Patient.hasMany(models.Review, { foreignKey: 'patient_id' });
  };

  return Patient;
};