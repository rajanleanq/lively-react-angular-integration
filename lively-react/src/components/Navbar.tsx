import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Restaurant,
  Logout,
  Menu as MenuIcon,
  AccountCircle,
} from "@mui/icons-material";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutUser } from "../store/slices/authSlice";

interface NavbarProps {
  onSidebarToggle: () => void;
}

function Navbar({ onSidebarToggle }: NavbarProps) {
  const dispatch = useAppDispatch();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"));
  const { currentUser } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setAnchorEl(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="fixed"
        aria-label="main navigation"
        elevation={2}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: "100%",
        }}
      >
        <Toolbar>
          {currentUser?.isAdmin && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onSidebarToggle}
              sx={{ mr: 2, display: { md: isMobile ? "block" : "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Restaurant sx={{ mr: 2 }} aria-label="logo" aria-hidden="true" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lunch Management System
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
            >
              {currentUser?.name}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="profile-menu"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }} aria-label="user image">
                {currentUser?.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled>
          <AccountCircle sx={{ mr: 2 }} />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {currentUser?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {currentUser?.isAdmin ? "Administrator" : "User"}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default React.memo(Navbar);
