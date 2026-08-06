import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "prisma/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: path.join(__dirname, ".env.local") });

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
