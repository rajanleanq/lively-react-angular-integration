import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { adminTabs } from "../constants";
import { page_endpoints } from "../constants/endpoint";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  width: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, width }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const getRoutePath = (tabId: string) => {
    switch (tabId) {
      case "dashboard":
        return page_endpoints?.admin?.dashboard;
      case "items":
        return page_endpoints?.admin?.items;
      case "summary":
        return page_endpoints?.admin?.summary;
      default:
        return page_endpoints?.admin?.dashboard;
    }
  };

  const isActive = (tabId: string) => {
    const routePath = getRoutePath(tabId);
    return location.pathname === routePath;
  };

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          const routePath = getRoutePath(tab.id);
          const active = isActive(tab.id);

          return (
            <ListItem key={tab.id} disablePadding>
              <ListItemButton
                selected={active}
                aria-current={active ? "page" : undefined}
                onClick={() => handleNavigation(routePath)}
                sx={{
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon aria-hidden="true" />
                </ListItemIcon>
                <ListItemText primary={tab.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: width }, flexShrink: { md: 0 } }}>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        PaperProps={{
          role: "navigation",
          "aria-label": "Admin navigation drawer",
        }}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        PaperProps={{
          role: "navigation",
          "aria-label": "Admin navigation drawer",
        }}
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: width,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default React.memo(Sidebar);
