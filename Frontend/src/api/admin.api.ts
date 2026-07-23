import api from "./axiosInstance";
import type { DashboardResponse } from "../features/admin/dashboardTypes";

export const adminDashboardApi = () =>
  api.get<DashboardResponse>("/admin/dashboard");
