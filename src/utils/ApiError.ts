class ApiError extends Error {
  statusCode: number;
  message: string;
  data: null;
  error: string[];

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    data: null,
    error: string[] = []
  ) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    Error.captureStackTrace(this, this.constructor); // string|undefined  ---- this.constructor error kahan se aa rha vo htane ke liye use ho rha kewal kis file me error aa rha or kis line pr bs ye dikhayega
  }
}
export { ApiError };
