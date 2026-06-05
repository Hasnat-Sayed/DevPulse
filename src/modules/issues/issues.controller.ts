import type { Request, Response, NextFunction } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";

//create issue
const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reporterId = req.user?.id as number;
    const result = await issuesService.createIssueIntoDB(req.body, reporterId);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const issuesController = {
  createIssue,
};