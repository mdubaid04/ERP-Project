import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, verifyOtpApi } from "../../api/auth.api";

import type {
  verifyOTPPayload,
  VerifyOTPResponse,
  LoginResponse,
  LoginPayload,
  AuthState,
  ApiErrorResponse,
} from "./authTypes";
import type { AxiosError } from "axios";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  otpSend: false,
  user: null,
};

export const logIn = createAsyncThunk<LoginResponse, LoginPayload>(
  "login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi(credentials);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(error.response?.data);
    }
  },
);

export const verifyOtp = createAsyncThunk<VerifyOTPResponse, verifyOTPPayload>(
  "verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await verifyOtpApi(payload);
      return response.data;
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      return rejectWithValue(error.response?.data);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    (builder.addCase(logIn.pending, (state) => {
      state.isLoading = true;
    }),
      builder.addCase(logIn.fulfilled, (state) => {
        ((state.isLoading = false),
          (state.otpSend = true),
          (state.isError = true));
      }),
      builder.addCase(logIn.rejected, (state, action) => {
        console.log("logIn Failed", action.payload);
        state.isError = true;
      }),
      builder.addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
      }),
      builder.addCase(verifyOtp.fulfilled, (state, action) => {
        ((state.isLoading = false), (state.isAuthenticated = true));
        ((state.user = action.payload.data), (state.isError = false));
      }),
      builder.addCase(verifyOtp.rejected, (state, action) => {
        console.log("rejected", action.payload);
        state.isError = true;
      }));
  },
});

export default authSlice.reducer;
