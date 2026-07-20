import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    console.log("errorHandler", err);
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      data: err.data,
      error: err.error,
    });
  }

  return res.status(500).json({
    statusCode: 500,
    message: "Something went wrong",
    data: null,
    error: [],
  });
};

export { errorHandler };
