import { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../../app/hooks";

const BAR_COLOR = "#1976D2";

export default function DeptWiseEmployeeBar() {
  const deptData = useAppSelector(
    (state) => state.dashboard.data?.overview.DepartmentWiseEmployees,
  );

  console.log("deptData", deptData);

  const chartData = (deptData ?? []).map((dept: any) => ({
    name: dept.name,
    employees: dept._count.employees,
  }));

  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // ek baar animate hone ke baad observe band
        }
      },
      { threshold: 0.3 }, // 30% widget dikhte hi trigger ho jaayega
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
        Department-wise Employees
      </Typography>

      {chartData.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No Department Data
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="employees"
                fill={BAR_COLOR}
                radius={[4, 4, 0, 0]}
                isAnimationActive={isVisible} // ← scroll-trigger yahan lagta hai
                animationDuration={800}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
}
