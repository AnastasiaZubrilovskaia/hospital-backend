const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Specialty = sequelize.define('Specialty', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'specialties',
    underscored: true
  });

  Specialty.associate = (models) => {
    Specialty.hasMany(models.Doctor, { foreignKey: 'specialtyId' });
  };

  return Specialty;
};