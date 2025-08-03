const { Sequelize } = require('sequelize');

// SQLite для локального запуска. Для облака смените параметры на PostgreSQL.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

module.exports = sequelize;