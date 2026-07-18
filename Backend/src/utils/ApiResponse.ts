class ApiResponse<T> {
  statusCode: number;
  message: string;
  status: boolean;
  data: T;
  constructor(statusCode: number, message: string = "Success", data: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.status = statusCode < 400;
  }
}
export { ApiResponse };
