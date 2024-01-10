import { S3Event } from "aws-lambda";
import {
  PdfTextParser,
  PostgresRepository,
  S3TextParser,
  Service,
} from "./modules/loader";
import { Logger } from "./shared";

exports.handler = async (event: S3Event) => {
  const logger = new Logger();
  try {
    const repository = new PostgresRepository();

    for (const record of event.Records) {
      const bucketName = record.s3.bucket.name;
      const objectKey = decodeURIComponent(
        record.s3.object.key.replace(/\+/g, " "),
      );
      const filePath = `s3://${bucketName}/${objectKey}`;
      const userId = getUserIdFromFileName(objectKey);

      if (objectKey.endsWith(".pdf")) {
        const pdfParser = new PdfTextParser();
        const service = new Service(pdfParser, repository);
        await service.save_data(filePath, userId);
      } else if (objectKey.endsWith(".txt")) {
        const textParser = new S3TextParser();
        const service = new Service(textParser, repository);
        await service.save_data(objectKey, userId);
      } else {
        logger.warn(`Unsupported file type: ${filePath}`);
        continue;
      }
    }
  } catch (error) {
    logger.error(`Error processing S3 event: ${error}`);
    throw error;
  }
};

function getUserIdFromFileName(fileName: string): number {
  return 1;
}
