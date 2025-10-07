import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../../components/Header";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/AuthContext";
import { MenuItem } from "react-pro-sidebar";
import { Logout, Person } from "@mui/icons-material";
import { use } from "react";
import { display } from "@mui/system";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const { user } = useAuth();

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    // Split full name safely
    const fullName =
      user.firstName + " " + user.middleName + " " + user.lastName;
    setFullName(fullName);
  }, []); // run once on mount

  const navigate = useNavigate();
  const { logout } = useAuth(); // <- token-free logout from context

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleProfile = () => {
    handleCloseMenu();
    navigate("/profile");
  };

  const handleLogout = () => {
    handleCloseMenu();
    // clear auth state
    logout(); // this should remove localStorage user & setUser(null)
    navigate("/login", { replace: true });
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2} alignItems="start">
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}
      <Header title="" />

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton onClick={handleOpenMenu}>
          <SettingsOutlinedIcon />
        </IconButton>
        {/* <IconButton>
          <PersonOutlinedIcon />
        </IconButton> */}

        {/* Dropdown Menu */}
        <Menu
          id="settings-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            elevation: 6,
            sx: {
              mt: 1.5,
              minWidth: 220,
              borderRadius: 3,
              overflow: "hidden",
              "& .MuiMenuItem-root": {
                gap: 1.5,
                py: 1.2,
                px: 2.2,
                "& svg": { fontSize: 20, color: "text.secondary" },
                "&:hover": {
                  backgroundColor: (t) =>
                    t.palette.mode === "dark"
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.04)",
                },
              },
            },
          }}
        >
          {/* Optional user section */}
          <Box
            sx={{
              px: 2.2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
            }}
          >
            <Avatar sx={{ width: 36, height: 36 }}>
              {fullName?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography fontWeight="bold" fontSize=".95rem">
                {fullName || "No Name"}
              </Typography>
              <Typography
                fontWeight="bold"
                variant="caption"
                color="text.secondary"
                fontSize=".85rem"
              >
                {user?.phoneNumber || "No Phone"}
              </Typography>
            </Box>
          </Box>

          <Box
            p="15px 10px"
            sx={{ display: "flex", cursor: "pointer" }}
            onClick={handleProfile}
          >
            <Person />
            <Typography ml="10px" fontSize=".95rem">
              Profile
            </Typography>
          </Box>

          <Divider sx={{ my: 0.5 }} />

          <Box
            p="15px 10px"
            sx={{ display: "flex", cursor: "pointer" }}
            onClick={handleLogout}
          >
            <Logout color="error" />
            <Typography ml="10px" color="error.main" fontSize=".95rem">
              Logout
            </Typography>
          </Box>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
