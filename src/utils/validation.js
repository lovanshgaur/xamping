/**
 * Flatten a Zod error into a list of `{ path, message }` for display.
 * @param {import("zod").ZodError} error
 */
export function flattenZodError(error) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}
