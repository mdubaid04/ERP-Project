import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod/v3";
import { ApiError } from "../utils/ApiError";
import { Result } from "pg";
import * as path from "node:path";
const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors[0]?.message;
      return new ApiError(400, message);
    }
    req.body = result.data;
    next();
  };
};
export { validate };

//*
//* in success
//* Result={
//*   success:true,
//*   data:{}
//* }
//* in error
//* Result={
//*   success:false,
//*   error:{
//*     errors:[{
//*       path:
//*       message:""
//*     },
//*      {
//*       path:
//*       message:""
//*     }
//*          ]
//*   }
//* }
