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
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'patient'
    }
  }, {
    tableName: 'patients',
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
    Patient.hasMany(models.Appointment, { foreignKey: 'patientId' });
    Patient.hasMany(models.Review, { foreignKey: 'patientId' });
  };

  return Patient;
};