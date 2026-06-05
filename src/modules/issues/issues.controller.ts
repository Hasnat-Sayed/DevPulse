import type { Request, Response, NextFunction } from "express";
import { issuesService } from "./issues.service";
import sendResponse from "../../utility/sendResponse";
import type { IGetIssuesQuery } from "./issues.interface";

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

//get all issues
const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query as IGetIssuesQuery;

    const result = await issuesService.getAllIssuesFromDB({
      sort,
      type,
      status,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrived successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//get single issue
const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await issuesService.getSingleIssueFromDB(
      req.params.id as string,
    );

    if (!result) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrived successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    const existing = await issuesService.getSingleIssueFromDB(id as string);

    if (!existing) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
      return;
    }

    if (user.role === "contributor") {
      if (existing.reporter?.id !== user.id) {
        sendResponse(res, {
          statusCode: 403,
          success: false,
          message: "Forbidden! You can only update your own issues",
        });
        return;
      }

      if (existing.status !== "open") {
        sendResponse(res, {
          statusCode: 409,
          success: false,
          message: "Conflict! You can only update issues that are open",
        });
        return;
      }
    }

    const result = await issuesService.updateIssueIntoDB(
      id as string,
      req.body,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await issuesService.deleteIssueFromDB(
      req.params.id as string,
    );

    if (deleted === 0) {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
      return;
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const issuesController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue,
  deleteIssue,
};
