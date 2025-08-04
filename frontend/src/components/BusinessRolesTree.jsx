import React, { useState, useEffect } from "react";
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
  Container,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";

// Собирает дерево из списка бизнес-ролей с parentId
function buildTree(flatRoles) {
  const map = {};
  flatRoles.forEach(role => { map[role.id] = { ...role, children: [] }; });
  const roots = [];
  flatRoles.forEach(role => {
    if (role.parentId === null) roots.push(map[role.id]);
    else if (map[role.parentId]) map[role.parentId].children.push(map[role.id]);
  });
  return roots;
}

export default function BusinessRolesTree({ onBack }) {
  const [flatRoles, setFlatRoles] = useState([]);
  const [tree, setTree] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isGroup, setIsGroup] = useState(true);

  // Загрузка бизнес-ролей из backend при старте и после изменений
  async function reloadRoles() {
    const res = await axios.get("/api/business-roles");
    setFlatRoles(res.data);
    setTree(buildTree(res.data));
  }

  useEffect(() => {
    reloadRoles();
  }, []);

  // CRUD операции через API
  async function handleAdd(parentId) {
    setDialogOpen(true);
    setDialogAction("add");
    setSelectedId(parentId);
    setInputValue("");
    setIsGroup(true);
  }

  async function handleEdit(id) {
    setDialogOpen(true);
    setDialogAction("edit");
    setSelectedId(id);
    const role = flatRoles.find(r => r.id === id);
    setInputValue(role ? role.name : "");
    setIsGroup(role ? role.group : true);
  }

  async function handleDelete(id) {
    setDialogOpen(true);
    setDialogAction("delete");
    setSelectedId(id);
  }

  async function handleDialogConfirm() {
    if (dialogAction === "add") {
      await axios.post("/api/business-roles", {
        name: inputValue,
        group: isGroup,
        parentId: selectedId,
      });
    }
    if (dialogAction === "edit") {
      const role = flatRoles.find(r => r.id === selectedId);
      await axios.put(`/api/business-roles/${selectedId}`, {
        name: inputValue,
        group: isGroup,
        parentId: role ? role.parentId : null,
      });
    }
    if (dialogAction === "delete") {
      await axios.delete(`/api/business-roles/${selectedId}`);
    }
    await reloadRoles();
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
    setIsGroup(true);
  }

  function handleDialogCancel() {
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
    setIsGroup(true);
  }

  // Визуализация дерева (старый UI сохранён полностью)
  function renderTree(nodes) {
    return nodes.map(node => (
      <TreeItem
        key={node.id}
        nodeId={String(node.id)}
        label={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: node.group ? "bold" : "normal",
                mr: 1,
                color: node.group ? "inherit" : "text.secondary",
              }}
            >
              {node.name}
            </Typography>
            {node.group && (
              <IconButton size="small" onClick={e => { e.stopPropagation(); handleAdd(node.id); }}>
                <AddIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton size="small" onClick={e => { e.stopPropagation(); handleEdit(node.id); }}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={e => { e.stopPropagation(); handleDelete(node.id); }}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        {node.group && node.children && node.children.length > 0 && renderTree(node.children)}
      </TreeItem>
    ));
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      {/* Кнопка "назад" слева от заголовка */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={onBack}
          sx={{
            mr: 1,
            p: 0.5,
            background: "transparent",
            color: "primary.main",
          }}
          aria-label="Назад"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" color="primary">
          Бизнес-роли (иерархия)
        </Typography>
      </Box>
      <Box sx={{ border: "1px solid #eee", borderRadius: 2, p: 2, background: "#fafbfc", minHeight: 48 }}>
        {tree.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 48 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleAdd(null)}
            >
              ДОБАВИТЬ КОРНЕВУЮ ГРУППУ
            </Button>
          </Box>
        ) : (
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflowY: "auto", minHeight: 240 }}
          >
            {renderTree(tree)}
          </TreeView>
        )}
      </Box>
      <Dialog open={dialogOpen} onClose={handleDialogCancel}>
        <DialogTitle>
          {dialogAction === "add" && (
            selectedId == null
              ? "Добавить корневую группу"
              : "Добавить новую группу или элемент"
          )}
          {dialogAction === "edit" && "Редактировать"}
          {dialogAction === "delete" && "Подтвердите удаление записи"}
        </DialogTitle>
        <DialogContent>
          {(dialogAction === "add" || dialogAction === "edit") && (
            <>
              <TextField
                label="Название"
                fullWidth
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                sx={{ mt: 2 }}
              />
              {(dialogAction === "add" && selectedId != null) || dialogAction === "edit" ? (
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={
                    <Checkbox
                      checked={isGroup}
                      onChange={e => setIsGroup(e.target.checked)}
                    />
                  }
                  label="Группа (может содержать дочерние элементы)"
                />
              ) : null}
            </>
          )}
          {dialogAction === "delete" && (
            <Typography sx={{ mt: 2 }}>
              Вы уверены, что хотите удалить запись?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCancel}>ОТМЕНА</Button>
          <Button
            onClick={handleDialogConfirm}
            color={dialogAction === "delete" ? "error" : "primary"}
            variant="contained"
            disabled={(dialogAction === "add" || dialogAction === "edit") && !inputValue.trim()}
          >
            {dialogAction === "delete" ? "ПОДТВЕРДИТЬ" : "СОХРАНИТЬ"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}