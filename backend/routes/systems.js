const express = require('express');
const router = express.Router();
const System = require('../models/system');

// Получить все системы
router.get('/', async (req, res) => {
  const systems = await System.findAll();
  res.json(systems);
});

// Создать новую систему
router.post('/', async (req, res) => {
  const { name, group, parentId } = req.body;
  const system = await System.create({ name, group, parentId });
  res.json(system);
});

// Обновить систему
router.put('/:id', async (req, res) => {
  const { name, group, parentId } = req.body;
  const system = await System.findByPk(req.params.id);
  if (!system) return res.status(404).json({ error: 'Not found' });
  system.name = name;
  system.group = group;
  system.parentId = parentId;
  await system.save();
  res.json(system);
});

// Рекурсивное удаление систем и потомков
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  async function deleteWithChildren(systemId) {
    const children = await System.findAll({ where: { parentId: systemId } });
    for (const child of children) await deleteWithChildren(child.id);
    await System.destroy({ where: { id: systemId } });
  }
  await deleteWithChildren(id);
  res.json({ success: true });
});

module.exports = router;