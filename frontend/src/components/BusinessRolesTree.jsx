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

export default function BusinessRolesTree({ onBack }) {
  const [tree, setTree] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isGroup, setIsGroup] = useState(true);

  // Найти узел и его родителя по id
  function findNodeAndParent(nodes, id, parent = null) {
    for (const node of nodes) {
      if (node.id === id) return { node, parent, siblings: nodes };
      if (node.group && node.children) {
        const res = findNodeAndParent(node.children, id, node);
        if (res) return res;
      }
    }
    return null;
  }

  // Открыть диалог добавления
  function handleAdd(id) {
    setDialogOpen(true);
    setDialogAction("add");
    setSelectedId(id);
    setInputValue("");
    setIsGroup(true);
  }

  // Открыть диалог редактирования
  function handleEdit(id) {
    setDialogOpen(true);
    setDialogAction("edit");
    setSelectedId(id);
    const { node } = findNodeAndParent(tree, id);
    setInputValue(node.name);
    setIsGroup(node.group);
  }

  // Открыть диалог удаления
  function handleDelete(id) {
    setDialogOpen(true);
    setDialogAction("delete");
    setSelectedId(id);
  }

  // Подтвердить изменение
  function handleDialogConfirm() {
    const newId = Date.now().toString();
    if (dialogAction === "add") {
      // Если добавляем корневой элемент — всегда группа!
      if (selectedId == null) {
        setTree([...tree, {
          id: newId,
          name: inputValue,
          group: true,
          children: []
        }]);
      } else {
        const { node } = findNodeAndParent(tree, selectedId);
        if (!node.group) return;
        if (!node.children) node.children = [];
        node.children.push({
          id: newId,
          name: inputValue,
          group: isGroup,
          ...(isGroup ? { children: [] } : {})
        });
        setTree([...tree]);
      }
    }
    if (dialogAction === "edit") {
      const { node } = findNodeAndParent(tree, selectedId);
      node.name = inputValue;
      node.group = isGroup;
      if (isGroup && !node.children) node.children = [];
      if (!isGroup) node.children = undefined;
      setTree([...tree]);
    }
    if (dialogAction === "delete") {
      if (selectedId == null) return;
      const { siblings } = findNodeAndParent(tree, selectedId);
      const idx = siblings.findIndex(n => n.id === selectedId);
      if (idx !== -1) siblings.splice(idx, 1);
      setTree([...tree]);
    }
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
    setIsGroup(true);
  }

  // Отмена диалога
  function handleDialogCancel() {
    setDialogOpen(false);
    setSelectedId(null);
    setInputValue("");
    setIsGroup(true);
  }

  // Рекурсивная визуализация дерева
  function renderTree(nodes) {
    return nodes.map(node => (
      <TreeItem
        key={node.id}
        nodeId={node.id}
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