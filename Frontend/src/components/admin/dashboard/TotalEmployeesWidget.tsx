import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

export default function TotalEmployeesWidget() {
  const totalEmployess = useAppSelector(
    (state) => state.dashboard.data?.overview.totalEmployees,
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
          Total Employees
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {totalEmployess}
        </Typography>
      </Box>
      <PeopleIcon sx={{ fontSize: 40, color: "primary.main", opacity: 0.7 }} />
    </Box>
  );
}
