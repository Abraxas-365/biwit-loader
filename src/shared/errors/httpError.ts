export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}

export function isHttpError(object: any): object is HttpError {
  return (
    object &&
    typeof object.message === "string" &&
    typeof object.statusCode === "number" &&
    object.name === "HttpError"
  );
}
