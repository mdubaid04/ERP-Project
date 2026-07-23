import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

export default function TotalDepartmentWidget() {
  const totalDeaprtments = useAppSelector(
    (state) => state.dashboard.data?.overview.totalDepartments,
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
          Total Departments
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {totalDeaprtments}
        </Typography>
      </Box>
      <GroupIcon sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }} />
    </Box>
  );
}
