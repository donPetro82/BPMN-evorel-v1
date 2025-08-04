const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Role = sequelize.define('Role', {
  name: { type: DataTypes.STRING, allowNull: false },
  parentId: { type: DataTypes.INTEGER, allowNull: true },
  isGroup: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'roles',
});

module.exports = Role;