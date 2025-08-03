import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function renderTree(nodes, onAdd, onEdit, onDelete, onToggle) {
  return (
    <Box sx={{ ml: nodes.level * 2, display: "flex", alignItems: "center" }} key={nodes.id}>
      <IconButton size="small" onClick={() => onToggle(nodes.id)}>
        {nodes.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
      </IconButton>
      <Typography variant="body1" sx={{ fontWeight: nodes.group ? "bold" : "normal", mr: 1 }}>
        {nodes.name}
      </Typography>
      <IconButton size="small" onClick={() => onAdd(nodes.id)}>
        <AddIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onEdit(nodes.id)}>
        <EditIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={() => onDelete(nodes.id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
      {nodes.open && nodes.children && nodes.children.map(child =>
        renderTree(child, onAdd, onEdit, onDelete, onToggle)
      )}
    </Box>
  );
}

function getInitialTree() {
  return [
    {
      id: 1,
      name: "Дирекция",
      group: true,
      open: true,
      level: 0,
      children: [
        {
          id: 2,
          name: "Группа руководителей",
          group: true,
          open: true,
          level: 1,
          children: [
            {
              id: 3,
              name: "Генеральный директор",
              group: false,
              open: false,
              level: 2,
              children: []
            }
          ]
        }
      ]
    }
  ];
}

export default function BusinessRolesTree() {
  const [tree, setTree] = useState(getInitialTree());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // Helpers to find node by id and update tree
  function findNodeAndParent(nodes, id, parent = null) {
    for (const node of nodes) {
      if (node.id === id) return { node, parent, siblings: nodes };
      if (node.children) {
        const res = findNodeAndParent(node.children, id, node);
        if (res) return res;
      }
    }
    return null;
  }

  function handleAdd(id) {
    setDialogOpen(true);
    setDialogAction("add");
    setSelectedId(id);
    setInputValue("");
  }
  function handleEdit(id) {
    setDialogOpen(true);
    setDialogAction("edit");
    setSelectedId(id);
    const { node } = findNodeAndParent(tree, id);
    setInputValue(node.name);
  }
  function handleDelete(id) {
    setDialogOpen(true);
    setDialogAction("delete");
    setSelectedId(id);
  }
  function handleToggle(id) {
    setTree(tree =>
      tree.map(node => toggleNode(node, id))
    );
  }
  function toggleNode(node, id) {
    if (node.id === id) return { ...node, open: !node.open };
    if (node.children)
      return { ...node, children: node.children.map(child => toggleNode(child, id)) };
    return node;
  }
  function handleDialogConfirm() {
    if (dialogAction === "add") {
      const { node } = findNodeAndParent(tree, selectedId);
      const newId = Date.now();
      const newChild = {
        id: newId,
        name: inputValue,
        group: true,
        open: false,
        level: (node.level || 0) + 1,
        children: []
      };
      node.children.push(newChild);
      setTree([...tree]);
    }
    if (dialogAction === "edit") {
      const { node } = findNodeAndParent(tree, selectedId);
      node.name = inputValue;
      setTree([...tree]);
    }
    if (dialogAction === "delete") {
      const { parent, siblings } = findNodeAndParent(tree, selectedId);
      const idx = siblings.findIndex(n => n.id === selectedId);
      if (idx !== -1) siblings.splice(idx, 1);
      setTree([...tree]);
    }
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
  }
  function handleDialogCancel() {
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h5" color="primary" sx={{ mb: 2 }}>
        Бизнес-роли (иерархия)
      </Typography>
      <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, background: "#fafbfc" }}>
        {tree.map(node =>
          renderTree(node, handleAdd, handleEdit, handleDelete, handleToggle)
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>
          {dialogAction === "add" && "Добавить новую группу"}
          {dialogAction === "edit" && "Редактировать"}
          {dialogAction === "delete" && "Подтвердите удаление записи"}
        </DialogTitle>
        <DialogContent>
          {(dialogAction === "add" || dialogAction === "edit") && (
            <TextField
              label="Название"
              fullWidth
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
          {dialogAction === "delete" && (
            <Typography sx={{ mt: 2 }}>
              Вы уверены, что хотите удалить запись?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>Отмена</Button>
          <Button
            onClick={handleDialogConfirm}
            color={dialogAction === "delete" ? "error" : "primary"}
            variant="contained"
          >
            {dialogAction === "delete" ? "Подтвердить" : "Сохранить"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}