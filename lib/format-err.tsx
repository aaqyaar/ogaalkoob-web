"use client";

export const formatError = (err: { [key: string]: string }) => {
  if (typeof err === "string") {
    return err;
  }

  if (Array.isArray(err)) {
    if (typeof err[0] === "string") {
      return err["message"] ? err["message"] : err[0];
    }

    if (typeof err[0] === "object") {
      return Object.values(err[0])[0] as unknown as string;
    }

    return Array.isArray(err[0]) ? err[0][0] : "Something went wrong";
  }

  if (typeof err === "object") {
    const indexOf = Object.keys(err).indexOf("message");

    return Object.keys(err).includes("message")
      ? Object.values(err)[indexOf]
      : (Object.values(err)[0] as unknown as string);
  }

  return "Something went wrong, please try again";
};
