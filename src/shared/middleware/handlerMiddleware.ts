import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { isHttpError } from "../errors/httpError";
import { Logger } from "../logger";

export function handlerMiddleware(
  handler: (
    event: APIGatewayProxyEvent,
    context: Context,
  ) => Promise<APIGatewayProxyResult>,
) {
  let logger = new Logger();
  return async function (
    event: APIGatewayProxyEvent,
    context: Context,
  ): Promise<APIGatewayProxyResult> {
    try {
      const response = await handler(event, context);
      logger.info(`Response statusCode: ${response.statusCode}`, event);
      return response;
    } catch (error) {
      if (isHttpError(error)) {
        logger.error(error.message, event);
        return {
          statusCode: error.statusCode,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: error.message,
          }),
        };
      } else {
        logger.error("Internal Server Error", event);
        return {
          statusCode: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Internal Server Error",
          }),
        };
      }
    }
  };
}
