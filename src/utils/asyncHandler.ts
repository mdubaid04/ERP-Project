import type { Request, Response, NextFunction } from "express";
const asyncHanldler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) => {
      //yahan type nhi likha kiuki call kr rhe fn
      next(error);
    });
  };
};

export { asyncHanldler };
