import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";
import EventBusyIcon from "@mui/icons-material/EventBusy";

export default function TotalLeaveRequestsWidget() {
  const totalLeaves = useAppSelector(
    (state) => state.dashboard.data?.overview.totalLeaves,
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
          Total Leave Requests
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {totalLeaves}
        </Typography>
      </Box>
      <EventBusyIcon
        sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }}
      />
    </Box>
  );
}
