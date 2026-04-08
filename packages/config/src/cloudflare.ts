import { env } from "./env";

export const cloudflare = {
  accountId: env.CLOUDFLARE_ACCOUNT_ID,
  apiToken: env.CLOUDFLARE_API_TOKEN,
  zoneId: env.CLOUDFLARE_ZONE_ID,
} as const;
