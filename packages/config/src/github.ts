import { env } from "./env";

export const github = {
  token: env.GITHUB_TOKEN,
  webhookSecret: env.GITHUB_WEBHOOK_SECRET,
} as const;
