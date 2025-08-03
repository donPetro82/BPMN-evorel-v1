const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const System = sequelize.define('System', {
  name: { type: DataTypes.STRING, allowNull: false }
});

module.exports = System;