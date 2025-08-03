const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Role;