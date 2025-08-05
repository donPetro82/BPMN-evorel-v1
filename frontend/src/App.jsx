import React, { useState } from "react";
import MainPage from "./components/MainPage";
import CatalogsPage from "./components/CatalogsPage";
import BusinessRolesTree from "./components/BusinessRolesTree";
import SystemsTree from "./components/SystemsTree";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();

export default function App() {
  const [page, setPage] = useState("main");
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {page === "main" && (
        <MainPage onCatalogs={() => setPage("catalogs")} />
      )}
      {page === "catalogs" && (
        <CatalogsPage
          onBack={() => setPage("main")}
          onBusinessRoles={() => setPage("roles")}
          onSystems={() => setPage("systems")}
        />
      )}
      {page === "roles" && (
        <BusinessRolesTree
          onBack={() => setPage("catalogs")}
        />
      )}
      {page === "systems" && (
        <SystemsTree
          onBack={() => setPage("catalogs")}
        />
      )}
    </ThemeProvider>
  );
}