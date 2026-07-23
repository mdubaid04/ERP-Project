import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppBar1 from "../ui/AppBar";
import SideBar from "../ui/SideBar";
import { useState } from "react";
import Footer from "../ui/Footer";

export function DashboardLayout() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      <AppBar1 handleHamburger={() => setOpen((prev) => !prev)} />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <SideBar value={open} setOpen={() => setOpen((prev) => !prev)} />
        <Box component="main" sx={{ flexGrow: 1, px: { xs: 2, md: 4 }, pt: 3 }}>
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
