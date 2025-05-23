require('dotenv').config();

module.exports = {
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
};