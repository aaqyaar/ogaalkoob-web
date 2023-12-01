export interface ApiProblem {
  kind:
    | "bad-data"
    | "bad-user-input"
    | "timeout"
    | "unauthorized"
    | "forbidden"
    | "not-found"
    | "client-error"
    | "server-error"
    | "unexpected-status";
  temporary: boolean;
  message?: string;
}
export interface LoginResult {}

export interface PaginationResult<T> {
  data: T[];
  hasNextPage: boolean;
}
