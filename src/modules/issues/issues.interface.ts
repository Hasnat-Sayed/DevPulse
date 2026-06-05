export interface ICreateIssuePayload {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: string;
  updated_at: string;
}

export interface IIssueWithReporter extends Omit<IIssue, "reporter_id"> {
  reporter: {
    id: number;
    name: string;
    role: string;
  }| null;
}

export interface IGetIssuesQuery {
  sort?: string | undefined;
  type?: string | undefined;
  status?: string | undefined;
}

export interface IUpdateIssuePayload {
  title?: string;
  description?: string;
  type?: "bug" | "feature_request";
  status? : "open" | "in_progress" | "resolved"; 
}