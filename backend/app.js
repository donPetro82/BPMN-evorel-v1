const express = require('express');
const cors = require('cors');
const db = require('./db');

//const businessRolesRouter = require('./routes/businessRoles');
//app.use('/api/business-roles', businessRolesRouter);

const app = express();
app.use(cors());
app.use(express.json());

const processesRouter = require('./routes/processes');
const rolesRouter = require('./routes/roles');
const systemsRouter = require('./routes/systems');

// Новый маршрут для бизнес-ролей с хранением в отдельной таблице
const businessRolesRouter = require('./routes/businessRoles');
app.use('/api/business-roles', businessRolesRouter);

app.use('/api/processes', processesRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/systems', systemsRouter);

db.sync().then(() => {
  app.listen(5000, () => {
    console.log('Backend running on port 5000');
  });
});