const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Doctor = sequelize.define('Doctor', {
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
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialtyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'specialties',
        key: 'id'
      }
    }
  }, {
    tableName: 'doctors',
    underscored: true
  });

  Doctor.associate = (models) => {
    Doctor.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
    Doctor.hasMany(models.Review, { foreignKey: 'doctorId' });
    Doctor.hasMany(models.Appointment, { foreignKey: 'doctorId' });
  };

  return Doctor;
};