import { env } from "./env";

export const google = {
  workspaceAdmin: env.GOOGLE_WORKSPACE_ADMIN,
  oauthClientId: env.GOOGLE_OAUTH_CLIENT_ID,
  oauthClientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
} as const;
