import { Box, Paper, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: { xs: 3, sm: 4 },
          width: "50%",
          maxWidth: "400",
          borderRadius: "2",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, textAlign: "center", mb: 3 }}
        >
          ERP Management
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default AuthLayout;
