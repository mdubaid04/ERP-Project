import type {
  LoginPayload,
  LoginResponse,
  VerifyOTPResponse,
  verifyOTPPayload,
} from "../features/auth/authTypes";

import api from "./axiosInstance";

export const loginApi = (Credentials: LoginPayload) =>
  api.post<LoginResponse>("/auth/login", Credentials);

export const verifyOtpApi = (Credentials: verifyOTPPayload) =>
  api.post<VerifyOTPResponse>("/auth/verifyOTP", Credentials);
