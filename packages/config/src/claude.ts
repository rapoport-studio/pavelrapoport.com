import { env } from "./env";

export const claude = {
  apiKey: env.CLAUDE_API_KEY,
} as const;
