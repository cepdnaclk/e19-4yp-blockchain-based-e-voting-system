import { Response } from "express";

interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: any;
}

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  options: {
    message?: string;
    data?: T;
  }
) => {
  const { message = "Success", data } = options;
  const response: ApiResponse<T> = {
    message,
    ...(data !== undefined ? { data } : null),
  };
  res.status(statusCode).json(response);
};

export const sendError = <T>(
  res: Response,
  statusCode: number,
  options: {
    message?: string;
    error?: any;
    data?: T;
  }
) => {
  const {
    message = "An error occurred. Please try again later",
    error,
    data,
  } = options;
  const response: ApiResponse<T> = {
    message,
    ...(error !== undefined ? { error } : null),
    ...(data !== undefined ? { data } : null),
  };
  res.status(statusCode).json(response);
};
