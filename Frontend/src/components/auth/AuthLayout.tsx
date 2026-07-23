import { Box, Paper, Typography } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

function AuthLayout() {
  const isUser = useAppSelector((state) => state.auth.user);
  if (isUser) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "#ffffff",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 4 },
          width: 450,
          minHeight: 400,
          borderRadius: "24px",
          bgColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#1a1a1a",
            fontWeight: 400,
            letterSpacing: "0.5px",
            textAlign: "center",
            mb: 1,
          }}
        >
          ERP Management
        </Typography>
        <Outlet />
      </Paper>
    </Box>
  );
}

export default AuthLayout;
