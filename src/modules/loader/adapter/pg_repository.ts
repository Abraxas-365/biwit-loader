import { Pool } from "pg";
import { Repository } from "../ports";
import { configService } from "../../../shared";
import { Data } from "../model";

export class PostgresRepository implements Repository {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      user: configService.get("DB_USER"),
      host: configService.get("DB_HOST"),
      database: configService.get("DB_NAME"),
      password: configService.get("DB_PASSWORD"),
      port: parseInt(configService.get("DB_PORT")),
    });
  }

  async save(data: Data): Promise<number> {
    const client = await this.pool.connect();

    try {
      const insertQuery =
        "INSERT INTO data (user_id, chunk, embedding) VALUES ($1, $2, $3) RETURNING id";
      const values = [data.user_id, data.chunk, data.embedding];
      const res = await client.query(insertQuery, values);
      return res.rows[0].id;
    } catch (error) {
      throw new Error(`Error saving data: ${error.message}`);
    } finally {
      client.release();
    }
  }
}
