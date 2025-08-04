const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Получить все роли
app.get('/api/roles', (req, res) => {
  db.all('SELECT * FROM business_roles', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Добавить роль
app.post('/api/roles', (req, res) => {
  const { name, parent_id, is_group } = req.body;
  db.run(
    'INSERT INTO business_roles (name, parent_id, is_group) VALUES (?, ?, ?)',
    [name, parent_id || null, is_group ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Редактировать роль
app.put('/api/roles/:id', (req, res) => {
  const { name, parent_id, is_group } = req.body;
  db.run(
    'UPDATE business_roles SET name = ?, parent_id = ?, is_group = ? WHERE id = ?',
    [name, parent_id || null, is_group ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changed: this.changes });
    }
  );
});

// Удалить роль
app.delete('/api/roles/:id', (req, res) => {
  db.run('DELETE FROM business_roles WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});