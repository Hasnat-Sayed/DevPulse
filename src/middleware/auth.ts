import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { ROLES } from "../types";
import sendResponse from "../utility/sendResponse";


const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized Access!",
        });
        return;
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt_secret as string
      ) as JwtPayload;

      if (roles.length && !roles.includes(decoded.role)) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! You do not have permission.",
        });
        return;
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;