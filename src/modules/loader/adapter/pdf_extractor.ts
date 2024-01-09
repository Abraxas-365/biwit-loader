import {
  TextractClient,
  StartDocumentTextDetectionCommand,
  GetDocumentTextDetectionCommand,
} from "@aws-sdk/client-textract";
import { TextParcer } from "../ports";
import { configService } from "../../../shared";

export class PdfTextParser implements TextParcer {
  private textractClient: TextractClient;

  constructor(textractClient: TextractClient) {
    this.textractClient = textractClient;
  }

  async extract_text(filePath: string): Promise<string> {
    const bucketName = configService.get("S3_BUCKET_NAME");
    const objectKey = filePath;

    const startCommand = new StartDocumentTextDetectionCommand({
      DocumentLocation: {
        S3Object: {
          Bucket: bucketName,
          Name: objectKey,
        },
      },
    });
    const startResponse = await this.textractClient.send(startCommand);
    const jobId = startResponse.JobId;

    let status: string = "IN_PROGRESS";
    let text = "";

    while (status === "IN_PROGRESS") {
      const getCommand = new GetDocumentTextDetectionCommand({ JobId: jobId });
      const getResponse = await this.textractClient.send(getCommand);
      status = getResponse.JobStatus ?? "FAILED";

      if (status === "SUCCEEDED" && getResponse.Blocks) {
        for (const block of getResponse.Blocks) {
          if (block.BlockType === "LINE") {
            text += block.Text + "\n";
          }
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return text;
  }
}
