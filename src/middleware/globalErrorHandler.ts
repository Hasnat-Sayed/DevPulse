import type { Request, Response, NextFunction } from "express";

const globalErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

export default globalErrorHandler;