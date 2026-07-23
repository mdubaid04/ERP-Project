export interface EmployeeUser {
  empId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "EMPLOYEE" | "MANAGER";
  profilePic: string | null;
  phoneNo: string;
  dateOfBirth: string | null;
  gender: string;
  address: string;
  pinCode: string;
  city: string;
  state: string;
  joiningDate: string;
  isActive: boolean;
  departmentId: number | null;
  totalLeaves: number;
  remainingLeaves: number;
  refreshToken: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  empId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN";
}

export type User = EmployeeUser | AdminUser;

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  otpSend: boolean;
  user: User | null;
  resetPasswordOtpSend: boolean;
}

export interface LoginPayload {
  email: string;
  phoneNo?: undefined | string;
  password: string;
}

export interface verifyOTPPayload {
  otp: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: Record<string, never>;
}

export interface VerifyOTPResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: User;
}

export interface ForgetPasswordResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: Record<string, never>;
}

export interface ForgetPasswordPayload {
  email: string;
  phoneNo?: undefined | string;
}

export interface ResetPasswordPayload {
  password: string;
  otp: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: Record<string, never>;
}

export interface MyProfileResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: User;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: null;
  error: string[];
}
