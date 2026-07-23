import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

// Gradient color pairs - har status ke liye start aur end color
const GRADIENTS: Record<string, { from: string; to: string }> = {
  PRESENT: { from: "#66BB6A", to: "#2E7D32" },
  LATE: { from: "#FFA726", to: "#EF6C00" },
  ABSENT: { from: "#EF5350", to: "#C62828" },
  HALF_DAY: { from: "#42A5F5", to: "#1565C0" },
  ON_LEAVE: { from: "#AB47BC", to: "#6A1B9A" },
};

export default function AttendanceStatusWidget() {
  const attendanceData = useAppSelector(
    (state) => state.dashboard.data?.overview.attendanceStatus,
  );

  const chartData = Object.entries(attendanceData ?? {})
    .map(([key, value]) => ({
      name: key,
      value: value as number,
      fill: `url(#gradient-${key})`, // gradient id reference
    }))
    .filter((item) => item.value > 0);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Attendance
      </Typography>

      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No Attendance Data
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Gradient definitions - har status ka apna gradient */}
              <defs>
                {Object.entries(GRADIENTS).map(([key, { from, to }]) => (
                  <linearGradient
                    key={key}
                    id={`gradient-${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="40%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
              />
              <Tooltip />
              <Legend
                layout="vertical"
                position="insideRight"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}
