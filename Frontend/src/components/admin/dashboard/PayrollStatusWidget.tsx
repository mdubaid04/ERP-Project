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
export default function PayrollStatusWidget({
  isAnimationActive = true,
}: {
  isAnimationActive?: boolean;
}) {
  const payrollData = useAppSelector(
    (state) => state.dashboard.data?.overview.payrollStatus,
  );
  const chartData = Object.entries(payrollData ?? {})
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
        Payroll Requests
      </Typography>
      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondry">
          No Payroll Requests
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart responsive>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={chartData}
              cx="50%"
              cy="100%"
              outerRadius="120%"
              fill="#8884d8"
              label
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
