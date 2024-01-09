export class Data {
  id: number;
  user_id: number;
  chunk: string;
  embedding: number[];

  constructor(user_id: number, chunk: string, embedding: number[]) {
    this.user_id = user_id;
    this.chunk = chunk;
    this.embedding = embedding;
  }
}
