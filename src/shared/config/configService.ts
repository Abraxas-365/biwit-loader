import "dotenv/config";
import { HttpError } from "../errors/httpError";

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    if (!process.env.S3_REGION || !process.env.S3_BUCKET_NAME) {
      throw new HttpError(
        "Missing 'S3_REGION' or 'S3_BUCKET_NAME' env variables",
        500,
      );
    }

    if (
      !process.env.DB_USER ||
      !process.env.DB_HOST ||
      !process.env.DB_NAME ||
      !process.env.DB_PASSWORD ||
      !process.env.DB_PORT
    ) {
      throw new HttpError(
        "Missing 'DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD' or 'DB_PORT' env variables",
        500,
      );
    }

    this.envConfig = {
      S3_REGION: process.env.S3_REGION,
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
      DB_USER: process.env.DB_USER,
      DB_HOST: process.env.DB_HOST,
      DB_NAME: process.env.DB_NAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_PORT: process.env.DB_PORT,
    };
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

const configService = new ConfigService();
export { configService };
