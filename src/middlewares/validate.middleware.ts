import type { Request, Response, NextFunction } from "express";
import type { AnyZodObject, ZodSchema } from "zod/v3";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";
const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message;
      return next(new ApiError(400, message));
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
