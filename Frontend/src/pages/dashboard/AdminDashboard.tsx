import { Grid, Paper } from "@mui/material";
import TotalEmployeesWidget from "../../components/admin/dashboard/TotalEmployeesWidget";
import { useAppDispatch } from "../../app/hooks";
import { useEffect } from "react";
import { getDashboard } from "../../features/admin/dashboarSlice";
import TotalDepartmentWidget from "../../components/admin/dashboard/TotalDepartmentWidget";
import TotalUpdateRequestsWidget from "../../components/admin/dashboard/TotalUpdateRequestsWidget";
import TotalLeaveRequestsWidget from "../../components/admin/dashboard/TotalLeaveRequestsWidget";
import UpdateRequestStatusWidget from "../../components/admin/dashboard/UpdateRequestStatusWidget";
import LeaveRequestStatusWidget from "../../components/admin/dashboard/LeaveRequestStatusWidget";
import TaskStatusWidget from "../../components/admin/dashboard/TaskStatusWidget";
import AttendanceStatusWidget from "../../components/admin/dashboard/AttendanceStatusWidget";
import PayrollStatusWidget from "../../components/admin/dashboard/PayrollStatusWidget";
import DepartmentWiseEmployeesWidget from "../../components/admin/dashboard/DepartmentWiseEmployeesWidget";
function AdminDashboard() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getDashboard());
  });
  return (
    <Grid container spacing={3}>
      {/* Row 1 */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 2, height: 120 }}>
          <TotalEmployeesWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 2, height: 120 }}>
          <TotalDepartmentWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 2, height: 120 }}>
          <TotalUpdateRequestsWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Paper sx={{ p: 2, height: 120 }}>
          <TotalLeaveRequestsWidget />
        </Paper>
      </Grid>

      {/* Row 2 */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2, height: 250 }}>
          <UpdateRequestStatusWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2, height: 250 }}>
          <LeaveRequestStatusWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper sx={{ p: 2, height: 250 }}>
          <TaskStatusWidget />
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2, height: 250 }}>
          <AttendanceStatusWidget />
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 2, height: 250 }}>
          <PayrollStatusWidget />
        </Paper>
      </Grid>

      {/* Row 3 */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 2, height: 350, mb: 2 }}>
          <DepartmentWiseEmployeesWidget />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;
