import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  IGetIssuesQuery,
  IIssue,
  IIssueWithReporter,
} from "./issues.interface";

//create issues
const createIssueIntoDB = async (
  payload: ICreateIssuePayload,
  reporterId: number,
) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

//attach reporter to issues
const attachReporters = async (
  issues: IIssue[],
): Promise<IIssueWithReporter[]> => {
  if (issues.length === 0) return [];

  const reporterIds = issues.map((i) => i.reporter_id);
  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds],
  );

  const reporterMap: Record<
    number,
    { id: number; name: string; role: string }
  > = {};
  reporterResult.rows.forEach((r) => {
    reporterMap[r.id] = r;
  });

  return issues.map(({ reporter_id, ...issue }) => ({
    ...issue,
    reporter: reporterMap[reporter_id] ?? null,
  }));
};

//get all issue
const getAllIssuesFromDB = async (
  query: IGetIssuesQuery,
): Promise<IIssueWithReporter[]> => {
  const { sort = "newest", type, status } = query;
   if (type && !["bug", "feature_request"].includes(type)) {
    throw new Error("Invalid type. Must be bug or feature_request");
  }

  if (status && !["open", "in_progress", "resolved"].includes(status)) {
    throw new Error("Invalid status. Must be open, in_progress or resolved");
  }

  if (sort && !["newest", "oldest"].includes(sort)) {
    throw new Error("Invalid sort. Must be newest or oldest");
  }
  
  const conditions: string[] = [];
  const values: string[] = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }

  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orderClause =
    sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";

  const result = await pool.query(
    `SELECT * FROM issues ${whereClause} ${orderClause}`,
    values,
  );

  return attachReporters(result.rows);
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
};
