import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ApiErrorResponse,
  DashboardResponse,
  DashboardState,
} from "./dashboardTypes";
import type { AxiosError } from "axios";
import { adminDashboardApi } from "../../api/admin.api";

const initialState: DashboardState = {
  isLoading: false,
  isError: false,
  data: null,
};

export const getDashboard = createAsyncThunk<DashboardResponse, void>(
  "getDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminDashboardApi();
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(error.response?.data);
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDashboard.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDashboard.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload.data;
      state.isError = false;
    });
    builder.addCase(getDashboard.rejected, (state, action) => {
      state.isLoading = false;
      console.log("rejected", action.payload);
      state.isError = true;
    });
  },
});
export default dashboardSlice.reducer;
