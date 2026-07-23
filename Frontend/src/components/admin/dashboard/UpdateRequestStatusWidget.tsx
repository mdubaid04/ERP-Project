import { useAppSelector } from "../../../app/hooks";
import { Box, Typography } from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  useActiveTooltipDataPoints,
  useIsTooltipActive,
} from "recharts";
import type { PieLabelRenderProps, PieSectorShapeProps } from "recharts";

const RADIAN = Math.PI / 180;
const COLORS: Record<string, string> = {
  APPROVED: "#0088FE",
  PENDING: "#00C49F",
  REJECTED: "#FFBB28",
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props: PieSectorShapeProps) => {
  const p = useActiveTooltipDataPoints();
  const isAnyPieActive = useIsTooltipActive();
  const isThisPieActive = isAnyPieActive && props.payload === p?.[0];
  let fillOpacity: number;
  if (isAnyPieActive && !isThisPieActive) {
    fillOpacity = 0.5;
  } else {
    fillOpacity = 1;
  }
  return (
    <Sector
      {...props}
      fill={COLORS[props.payload.name] || "#0088FE"}
      fillOpacity={fillOpacity}
      style={{ transition: "fill-opacity 0.3s ease" }}
    />
  );
};
export default function UpdateRequestsStatusWidget() {
  const updateRequestStatus = useAppSelector(
    (state) => state.dashboard.data?.overview.updateRequestStatus,
  );

  const chartData = Object.entries(updateRequestStatus ?? {})
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
        Update Requests
      </Typography>
      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondry">
          No Update Requests
        </Typography>
      ) : (
        <ResponsiveContainer width="100%" height="85%">
          <PieChart>
            <Pie
              data={chartData}
              cx="40%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              nameKey="name"
              dataKey="value"
              shape={MyCustomPie}
            ></Pie>
            <Tooltip />
            <Legend
              layout="vertical"
              position="insideRight"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
}
