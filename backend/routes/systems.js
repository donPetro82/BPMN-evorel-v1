const express = require('express');
const router = express.Router();
const System = require('../models/system');

router.get('/', async (req, res) => {
  const systems = await System.findAll();
  res.json(systems);
});

router.post('/', async (req, res) => {
  const system = await System.create(req.body);
  res.json(system);
});

module.exports = router;