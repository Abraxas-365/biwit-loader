import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { TextParcer } from "../ports";
import { configService } from "../../../shared";

export class S3TextParser implements TextParcer {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: configService.get("S3_REGION"),
    });
  }

  async extract_text(filePath: string): Promise<string> {
    const bucketName = configService.get("S3_BUCKET_NAME");
    const objectKey = filePath;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const { Body } = await this.s3Client.send(command);

    return new Promise((resolve, reject) => {
      let data = "";

      (Body as Readable)
        .on("data", (chunk) => {
          data += chunk;
        })
        .on("end", () => {
          resolve(data);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  }
}
