import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";

// #region Sample data
const COLORS: Record<string, string> = {
  APPROVED: "#0088FE",
  REJECTED: "#00C49F",
  PENDING: "#FFBB28",
};

// #endregion
export default function LeaveRequestStatusWidget({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const leaveData = useAppSelector(
    (state) => state.dashboard.data?.overview.leaveStatus,
  );
  const chartData = Object.entries(leaveData ?? {})
    .map(([key, value]) => ({
      name: key,
      value: value as number,
      fill: COLORS[key],
    }))
    .filter((item) => item.value > 0);
  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Leave Requests
      </Typography>
      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondry">
          No Leave Requests
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart responsive>
            <Pie
              data={chartData}
              innerRadius="80%"
              outerRadius="100%"
              // Corner radius is the rounded edge of each pie slice
              cornerRadius="50%"
              fill="#8884d8"
              // padding angle is the gap between each pie slice
              paddingAngle={5}
              dataKey="value"
              labelLine={false}
              isAnimationActive={isAnimationActive}
            />
            <Tooltip />
            <Legend
              iconType="circle"
              position="insideRight"
              layout="vertical"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
