import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";


const registerUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUserIntoDB(req.body);
    // console.log(result);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
   sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const authController = {
  registerUser,
  loginUser,
};