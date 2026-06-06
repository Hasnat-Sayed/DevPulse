//auth validators 
export const validateRegister = (body: {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}): string | null => {
  const { name, email, password, role } = body;

  if (!name || !email || !password)
    return "Name, email and password are required";
  if (!email.includes("@")) return "Invalid email format";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (role && !["contributor", "maintainer"].includes(role))
    return "Role must be contributor or maintainer";

  return null;
};

export const validateLogin = (body: {
  email?: string;
  password?: string;
}): string | null => {
  const { email, password } = body;

  if (!email || !password) return "Email and password are required";

  return null;
};

//issue validators 
export const validateCreateIssue = (body: {
  title?: string;
  description?: string;
  type?: string;
}): string | null => {
  const { title, description, type } = body;

  if (!title || !description || !type)
    return "Title, description and type are required";
  if (title.length > 150) return "Title must be 150 characters or less";
  if (description.length < 20)
    return "Description must be at least 20 characters";
  if (!["bug", "feature_request"].includes(type))
    return "Type must be bug or feature_request";

  return null;
};

export const validateGetIssues = (query: {
  sort?: string | undefined;
  type?: string | undefined;
  status?: string | undefined;
}): string | null => {
  const { sort, type, status } = query;

  if (type && !["bug", "feature_request"].includes(type)) return "Invalid type. Must be bug or feature_request";
  if (status && !["open", "in_progress", "resolved"].includes(status)) return "Invalid status. Must be open, in_progress or resolved";
  if (sort && !["newest", "oldest"].includes(sort)) return "Invalid sort. Must be newest or oldest";

  return null;
};

export const validateUpdateIssue = (body: {
  title?: string;
  description?: string;
  type?: string;
}): string | null => {
  const { title, description, type } = body;

  if (title && title.length > 150)
    return "Title must be 150 characters or less";
  if (description && description.length < 20)
    return "Description must be at least 20 characters";
  if (type && !["bug", "feature_request"].includes(type))
    return "Type must be bug or feature_request";

  return null;
};
