import type {
  LoginPayload,
  LoginResponse,
  VerifyOTPResponse,
  verifyOTPPayload,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
} from "../features/auth/authTypes";

import api from "./axiosInstance";

export const loginApi = (Payload: LoginPayload) =>
  api.post<LoginResponse>("/auth/login", Payload);

export const verifyOtpApi = (Payload: verifyOTPPayload) =>
  api.post<VerifyOTPResponse>("/auth/verifyOTP", Payload);

export const forgetPasswordApi = (Payload: ForgetPasswordPayload) =>
  api.post<ForgetPasswordResponse>("/auth/forget-password", Payload);

export const resetPasswordApi = (Payload: ResetPasswordPayload) =>
  api.post<ResetPasswordResponse>("/auth/reset-password", Payload);

export const myProfileApi = () => api.get("/employee/");
