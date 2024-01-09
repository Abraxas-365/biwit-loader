import { Data } from "./model";

export interface TextParcer {
  extract_text(path: string): Promise<string>;
}

export interface Repository {
  save(data: Data): Promise<number>;
}
