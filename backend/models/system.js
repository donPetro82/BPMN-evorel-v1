const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const System = sequelize.define('System', {
  name: { type: DataTypes.STRING, allowNull: false },
  group: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true }, // null для корня
});

module.exports = System;