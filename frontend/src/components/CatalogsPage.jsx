import React from "react";
import { Button, Box, Typography, Container } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AppsIcon from "@mui/icons-material/Apps";

export default function CatalogsPage({ onBusinessRoles }) {
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
        <Typography variant="h4" color="secondary" gutterBottom>
          Справочники
        </Typography>
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