export interface DashboardState {
  isLoading: boolean;
  isError: boolean;
  data: DashboardData | null;
}

export interface DashboardResponse {
  statusCode: number;
  message: string;
  status: boolean;
  data: DashboardData;
}

interface DapartmentWiseEmployees {
  name: string;
  _count: {
    employees: number;
  };
}

interface LeaveStatusCount {
  PENDING: number;
  REJECTED: number;
  APPROVED: number;
}

interface UpdateRequestStatusCount {
  PENDING: number;
  REJECTED: number;
  APPROVED: number;
}

interface AttendanceStatusCount {
  PRESENT: number;
  ABSENT: number;
  HALF_DAY: number;
  LATE: number;
  ON_LEAVE: number;
}

interface PayrollStatusCount {
  PENDING: number;
  PAID: number;
  FAILED: number;
  HOLD: number;
}

interface TaskStatusCount {
  PENDING: number;
  IN_PROGRESS: number;
  COMPLETED: number;
}

interface DasboardOverview {
  totalEmployees: number;
  DepartmentWiseEmployees: DapartmentWiseEmployees[];
  totalDepartments: number;
  totalLeaves: number;
  leaveStatus: LeaveStatusCount;
  totalUpdateRequests: number;
  updateRequestStatus: UpdateRequestStatusCount;
  attendanceStatus: AttendanceStatusCount;
  payrollStatus: PayrollStatusCount;
  taskStatus: TaskStatusCount;
}

export interface DashboardData {
  overview: DasboardOverview;
}
export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  data: null;
  error: string[];
}
