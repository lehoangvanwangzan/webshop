import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.resolve(__dirname, "prisma/schema.prisma"),
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
