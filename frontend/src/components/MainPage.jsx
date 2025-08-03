import React from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";

export default function MainPage({ onCatalogs }) {
  return (
    <Container maxWidth="sm" style={{ marginTop: "80px" }}>
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
        <Typography variant="h4" color="primary" gutterBottom>
          Добро пожаловать!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<BusinessCenterIcon />}
          sx={{ minWidth: 220, fontSize: 18 }}
        >
          Бизнес-процессы
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="large"
          startIcon={<MenuBookIcon />}
          sx={{ minWidth: 220, fontSize: 18 }}
          onClick={onCatalogs}
        >
          Справочники
        </Button>
      </Box>
    </Container>
  );
}