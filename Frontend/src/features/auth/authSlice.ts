import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginApi,
  verifyOtpApi,
  forgetPasswordApi,
  resetPasswordApi,
  myProfileApi,
} from "../../api/auth.api";

import type {
  verifyOTPPayload,
  VerifyOTPResponse,
  LoginResponse,
  LoginPayload,
  AuthState,
  ApiErrorResponse,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  MyProfileResponse,
} from "./authTypes";
import type { AxiosError } from "axios";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  isError: false,
  otpSend: false,
  user: null,
  resetPasswordOtpSend: false,
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

export const forgetPassword = createAsyncThunk<
  ForgetPasswordResponse,
  ForgetPasswordPayload
>("forgetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await forgetPasswordApi(payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(error.response?.data);
  }
});

export const resetPassword = createAsyncThunk<
  ResetPasswordResponse,
  ResetPasswordPayload
>("resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const response = await resetPasswordApi(payload);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    return rejectWithValue(error.response?.data);
  }
});

export const checkAuth = createAsyncThunk<MyProfileResponse, void>(
  "checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await myProfileApi();
      console.log("Inside checkAuth--", response.data);
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
        state.isLoading = false;
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
        state.isLoading = false;
        console.log("rejected", action.payload);
        state.isError = true;
      }));
    builder.addCase(forgetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgetPassword.fulfilled, (state) => {
      state.isLoading = false;
      state.resetPasswordOtpSend = true;
      state.isError = false;
    });
    builder.addCase(forgetPassword.rejected, (state, action) => {
      state.isLoading = false;
      console.log("rejected", action.payload);
      state.isError = true;
    });
    builder.addCase(resetPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.isLoading = false;
      state.resetPasswordOtpSend = false;
      state.isError = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.isLoading = false;
      console.log("rejected", action.payload);
      state.isError = true;
    });
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.data;
      state.isError = false;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.isLoading = false;
      console.log("rejected", action.payload);
      state.isError = true;
    });
  },
});

export default authSlice.reducer;
