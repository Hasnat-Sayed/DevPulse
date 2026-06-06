import type { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utility/sendResponse";
import { validateLogin, validateRegister } from "../../utility/validateFields";


const registerUser = async (req: Request, res: Response) => {
  try {
    const validationError = validateRegister(req.body);
    if (validationError) {
      sendResponse(res, { statusCode: 400, success: false, message: validationError });
      return;
    }
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
    const validationError = validateLogin(req.body);
    if (validationError) {
      sendResponse(res, { statusCode: 400, success: false, message: validationError });
      return;
    }
    const result = await authService.loginUserIntoDB(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
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

export const authController = {
  registerUser,
  loginUser,
};