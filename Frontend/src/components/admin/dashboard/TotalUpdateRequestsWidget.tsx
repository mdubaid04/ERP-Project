import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";
import SyncIcon from "@mui/icons-material/Sync";

export default function TotalUpdateRequestsWidget() {
  const totalUpdateRequests = useAppSelector(
    (state) => state.dashboard.data?.overview.totalUpdateRequests,
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <Typography variant="body2" color="text.secondry">
          Total Update Requests
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {totalUpdateRequests}
        </Typography>
      </Box>
      <SyncIcon sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }} />
    </Box>
  );
}
