import React from "react";
import { Button, Box, Typography, Container, IconButton } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CatalogsPage({ onBack, onBusinessRoles }) {
  return (
    <Container maxWidth="sm" style={{ marginTop: "80px" }}>
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
        <Typography variant="h4" color="secondary" gutterBottom>
          Справочники
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
          padding: 4,
          boxShadow: 3,
          borderRadius: 3,
          background: "#fafbfc",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<GroupIcon />}
          sx={{ minWidth: 220, fontSize: 18 }}
          onClick={onBusinessRoles}
        >
          Бизнес-роли
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<AppsIcon />}
          sx={{ minWidth: 220, fontSize: 18 }}
        >
          Системы
        </Button>
      </Box>
    </Container>
  );
}