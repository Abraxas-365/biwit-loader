import "dotenv/config";
import { HttpError } from "../errors/httpError";

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    if (
      !process.env.SOURCE_API_URL ||
      !process.env.AUTH_TOKEN_API_URL ||
      !process.env.SOURCE_DELIVERY_API_BRANCH
    ) {
      throw new HttpError(
        "Missing 'SOURCE_API_URL' or 'SOURCE_DELIVERY_API_BRANCH' or 'AUTH_TOKEN_API_URL' env variables",
        500,
      );
    }

    if (!process.env.AUTH_CLIENTID || !process.env.AUTH_CLIENTSECRET) {
      throw new HttpError(
        "Missing 'AUTH_CLIENTID' or 'AUTH_CLIENTSECRET' env variables",
        500,
      );
    }

    if (!process.env.DYNAMO_PICKUP_SOURCE) {
      throw new HttpError("Missing 'DYNAMO_PICKUP_SOURCE' env variables", 500);
    }

    this.envConfig = {
      SOURCE_API_URL: process.env.SOURCE_API_URL,
      AUTH_TOKEN_API_URL: process.env.AUTH_TOKEN_API_URL,
      AUTH_CLIENT_ID: process.env.AUTH_CLIENTID,
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENTSECRET,
      SOURCE_DELIVERY_API_BRANCH: process.env.SOURCE_DELIVERY_API_BRANCH,
    };
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

const configService = new ConfigService();
export { configService };
