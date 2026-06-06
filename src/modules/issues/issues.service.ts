import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  IGetIssuesQuery,
  IIssue,
  IIssueWithReporter,
  IUpdateIssuePayload,
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

//get single issue
const getSingleIssueFromDB = async (
  id: string,
): Promise<IIssueWithReporter | null> => {
  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (result.rows.length === 0) return null;

  const issues = await attachReporters(result.rows);
  return issues[0] ?? null;
};

//update issue
const updateIssueIntoDB = async (
  id: string,
  payload: IUpdateIssuePayload,
): Promise<IIssue | null> => {
  const { title, description, status, type } = payload;

  const result = await pool.query(
    `UPDATE issues
     SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       type = COALESCE($3, type),
       status = COALESCE($4, status),
       updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title ?? null, description ?? null, type ?? null, status ?? null, id],
  );

  if (result.rows.length === 0) return null;
  return result.rows[0];
};

//delete issue
const deleteIssueFromDB = async (id: string) => {
  const result = await pool.query(`
    DELETE FROM issues WHERE id = $1`, [id]);
  return (result.rowCount);
};

export const issuesService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB
};
