import React, { useState } from "react";
import MainPage from "./components/MainPage";
import CatalogsPage from "./components/CatalogsPage";
import BusinessRolesTree from "./components/BusinessRolesTree";
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
        />
      )}
      {page === "roles" && (
        <BusinessRolesTree
          onBack={() => setPage("catalogs")}
        />
      )}
    </ThemeProvider>
  );
}