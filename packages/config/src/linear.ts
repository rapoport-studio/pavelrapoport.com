import { env } from "./env";

export const linear = {
  apiKey: env.LINEAR_API_KEY,
  webhookSecret: env.LINEAR_WEBHOOK_SECRET,
} as const;
