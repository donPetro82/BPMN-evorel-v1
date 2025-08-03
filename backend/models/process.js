const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Process = sequelize.define('Process', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  ownerRoleId: { type: DataTypes.INTEGER },
  successDescription: { type: DataTypes.TEXT },
  isBase: { type: DataTypes.BOOLEAN, defaultValue: false },
  isLocked: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Process;