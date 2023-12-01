import { ApiProblem } from "./api.types";

export const getGeneralApiProblem = (
  statusCode: number,
  message: string
): ApiProblem => {
  if (statusCode === 401) {
    return { kind: "unauthorized", temporary: false, message };
  } else if (statusCode === 403) {
    return { kind: "forbidden", temporary: false, message };
  } else if (statusCode === 404) {
    return { kind: "not-found", temporary: false, message };
  } else if (statusCode >= 400 && statusCode < 500) {
    return { kind: "client-error", temporary: false, message };
  } else if (statusCode >= 500 && statusCode < 600) {
    return { kind: "server-error", temporary: true, message };
  } else {
    return { kind: "unexpected-status", temporary: true, message };
  }
};
