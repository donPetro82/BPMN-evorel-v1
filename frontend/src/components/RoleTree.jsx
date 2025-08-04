import React, { useEffect, useState } from 'react';

// Функция запроса дерева бизнес-ролей
async function fetchRoleTree() {
  const res = await fetch('http://localhost:3001/api/roles/tree');
  return await res.json();
}

// Функция создания новой бизнес-ролии
async function createRole({ name, parentId, isGroup }) {
  const res = await fetch('http://localhost:3001/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, parentId, isGroup })
  });
  return await res.json();
}

// Рекурсивный компонент для отображения дерева
function RoleNode({ node }) {
  return (
    <li>
      <strong>{node.name}</strong> {node.isGroup ? '(группа)' : '(роль)'}
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map(child => (
            <RoleNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function RoleTree() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', parentId: null, isGroup: false });

  useEffect(() => {
    fetchRoleTree().then(setRoles);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await createRole(newRole);
    setNewRole({ name: '', parentId: null, isGroup: false });
    fetchRoleTree().then(setRoles);
  };

  return (
    <div>
      <h2>Бизнес-Роли (Иерархия)</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Название роли"
          value={newRole.name}
          onChange={e => setNewRole({ ...newRole, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="ID родителя (или пусто)"
          value={newRole.parentId === null ? '' : newRole.parentId}
          onChange={e => setNewRole({ ...newRole, parentId: e.target.value ? Number(e.target.value) : null })}
        />
        <label style={{ marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={newRole.isGroup}
            onChange={e => setNewRole({ ...newRole, isGroup: e.target.checked })}
          />
          Группа
        </label>
        <button type="submit" style={{ marginLeft: 10 }}>Добавить</button>
      </form>
      <ul>
        {roles.map(node => (
          <RoleNode key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
}