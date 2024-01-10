import { Data } from "./model";
import { Repository, TextParcer } from "./ports";
import { TokenTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Logger } from "../../shared/logger";

export class Service {
  embeddings = new OpenAIEmbeddings();
  logger = new Logger();
  constructor(
    private readonly extractor: TextParcer,
    private readonly repo: Repository,
  ) {}

  async save_data(file_path: string, user_id: number): Promise<void> {
    let text = await this.extractor.extract_text(file_path);
    this.logger.info(text);
    const splitter = new TokenTextSplitter({
      encodingName: "gpt2",
      chunkSize: 10,
      chunkOverlap: 0,
    });

    const output = await splitter.createDocuments([text]);
    const pageContents = output.map((item) => item.pageContent);

    const documentRes = await this.embeddings.embedDocuments(pageContents);
    console.log(
      "El tamano de pages=" +
        pageContents.length +
        " le de em=" +
        documentRes.length,
    );

    const data = pageContents.map(
      (content, i) => new Data(user_id, content, documentRes[i]),
    );

    await Promise.all(data.map((chunk) => this.repo.save(chunk)));
  }
}
