import { drizzle } from "drizzle-orm/mysql2";

import { env } from "~/env";
import * as schema from "./schema";
import { createConnection } from "mysql2";

export const db = drizzle(
  createConnection({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USERNAME,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_DATABASE,
  }),
  { schema, mode: "default" },
);
