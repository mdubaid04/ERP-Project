import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        py: 2,
        px: 3,
        mt: "auto",
        backgroundColor: (theme) => theme.palette.grey[900],
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography> © 2026 ERP System. All rights reserved.</Typography>
    </Box>
  );
}

export default Footer;
