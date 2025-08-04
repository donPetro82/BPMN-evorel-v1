const express = require('express');
const router = express.Router();
const Role = require('../models/role');

router.get('/', async (req, res) => {
  const roles = await Role.findAll();
  res.json(roles);
});

router.post('/', async (req, res) => {
  const { name, parentId, isGroup } = req.body;
  const role = await Role.create({ name, parentId, isGroup });
  res.json(role);
});

module.exports = router;