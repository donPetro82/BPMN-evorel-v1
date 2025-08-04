const express = require('express');
const router = express.Router();
const BusinessRole = require('../models/businessRole');

// Получить все бизнес-роли
router.get('/', async (req, res) => {
  const roles = await BusinessRole.findAll();
  res.json(roles);
});

// Создать новую бизнес-роль
router.post('/', async (req, res) => {
  const { name, group, parentId } = req.body;
  const role = await BusinessRole.create({ name, group, parentId });
  res.json(role);
});

// Обновить бизнес-роль
router.put('/:id', async (req, res) => {
  const { name, group, parentId } = req.body;
  const role = await BusinessRole.findByPk(req.params.id);
  if (!role) return res.status(404).json({ error: 'Not found' });
  role.name = name;
  role.group = group;
  role.parentId = parentId;
  await role.save();
  res.json(role);
});

// Рекурсивное удаление бизнес-ролей и потомков
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  async function deleteWithChildren(roleId) {
    const children = await BusinessRole.findAll({ where: { parentId: roleId } });
    for (const child of children) await deleteWithChildren(child.id);
    await BusinessRole.destroy({ where: { id: roleId } });
  }
  await deleteWithChildren(id);
  res.json({ success: true });
});

module.exports = router;