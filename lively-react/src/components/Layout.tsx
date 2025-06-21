import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";
import { useAppSelector } from "../hooks";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = 240;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <header role="banner">
        <Navbar onSidebarToggle={handleSidebarToggle} />
      </header>

      {currentUser?.isAdmin && (
        <aside aria-label="Admin sidebar navigation">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            width={SIDEBAR_WIDTH}
          />
        </aside>
      )}

      <Box
        role="main"
        component="main"
        id="main-content"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 4,
          transition: "margin-left 0.3s ease",
        }}
        tabIndex={-1}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
