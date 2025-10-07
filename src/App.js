import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./pages/global/Topbar";
import Sidebar from "./pages/global/Sidebar";
import Dashboard from "./pages/dashboard";
import Users from "./pages/users";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import AddUser from "./pages/users/adduser";
import Login from "./pages/login";
import MainLayout from "./pages/layouts/MainLayout";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          {/* Public routes (nor sidebar/topbar) */}
          <Route path="/login" element={<Login />} />

          {/* Protected / Dashboard routes (with sidebar + topbar) */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <MainLayout isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
              </PrivateRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
