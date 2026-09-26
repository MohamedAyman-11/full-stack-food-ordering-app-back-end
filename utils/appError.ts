interface ConstructorTypes {
  statusCode: number;
  message: string;
  code?: string | undefined;
}
export class AppError extends Error {
  statusCode: number;
  code: string | undefined;
  status: string;
  isOperational: boolean;
  constructor({ statusCode, message, code = undefined }: ConstructorTypes) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
