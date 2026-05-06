import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.resolve(__dirname, "prisma/schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
