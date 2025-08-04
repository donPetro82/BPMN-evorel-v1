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
import { SimpleTreeView, TreeItem } from "@mui/x-tree-view";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";

console.log("Компонент BusinessRolesTree Монтируется!");

// Безопасное построение дерева из списка бизнес-ролей
function buildSafeTree(flatRoles) {
  const map = {};
  flatRoles.forEach(role => {
    map[role.id] = { ...role, children: [] };
  });

  const roots = [];
  const visited = new Set();

  flatRoles.forEach(role => {
    if (
      role.parentId === null ||
      role.parentId === role.id ||
      !map[role.parentId]
    ) {
      roots.push(map[role.id]);
      return;
    }
    if (visited.has(role.id)) return;

    let parent = map[role.parentId];
    let isCycle = false;
    while (parent) {
      if (parent.id === role.id) {
        isCycle = true;
        break;
      }
      parent = parent.parentId ? map[parent.parentId] : null;
    }
    if (!isCycle) {
      map[role.parentId].children.push(map[role.id]);
      visited.add(role.id);
    }
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

  async function reloadRoles() {
    const res = await axios.get("/api/business-roles");
    setFlatRoles(res.data);
    setTree(buildSafeTree(res.data));
  }

  useEffect(() => {
    reloadRoles();
  }, []);

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

  // Визуализация дерева
  function renderTree(nodes, parentPath = "") {
    return nodes.map(node => {
      const currentPath = parentPath ? `${parentPath}-${node.id}` : `${node.id}`;
      return (
        <TreeItem
          key={currentPath}
          itemId={currentPath} // ВАЖНО! Было nodeId={...}
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
          {node.group && node.children && node.children.length > 0 && renderTree(node.children, currentPath)}
        </TreeItem>
      );
    });
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
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
          <SimpleTreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{ flexGrow: 1, overflowY: "auto", minHeight: 240 }}
          >
            {renderTree(tree)}
          </SimpleTreeView>
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