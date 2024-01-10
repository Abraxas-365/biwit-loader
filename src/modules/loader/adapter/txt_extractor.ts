import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { TextParcer } from "../ports";
import { configService } from "../../../shared";

export class S3TextParser implements TextParcer {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client();
  }

  async extract_text(filePath: string): Promise<string> {
    const bucketName = configService.get("S3_BUCKET_NAME");
    const objectKey = filePath;

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
      });

      const response = await this.s3Client.send(command);

      if (!response.Body) {
        throw new Error("No data found in S3 response");
      }

      return new Promise((resolve, reject) => {
        const stream = response.Body as Readable;
        let data = "";

        stream.on("data", (chunk) => {
          data += chunk.toString();
        });

        stream.on("end", () => {
          resolve(data);
        });

        stream.on("error", (err) => {
          reject(err);
        });
      });
    } catch (err) {
      console.error("Error in S3 operation or stream handling", err);
      throw err;
    }
  }
}
