const express = require('express');
const router = express.Router();
const Process = require('../models/process');

router.get('/', async (req, res) => {
  const processes = await Process.findAll();
  res.json(processes);
});

router.post('/', async (req, res) => {
  const process = await Process.create(req.body);
  res.json(process);
});

router.put('/:id', async (req, res) => {
  await Process.update(req.body, { where: { id: req.params.id } });
  res.sendStatus(200);
});

module.exports = router;