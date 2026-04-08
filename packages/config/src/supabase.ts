import { env } from "./env";

export const supabase = {
  url: env.SUPABASE_URL,
  anonKey: env.SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  dbPassword: env.SUPABASE_DB_PASSWORD,
} as const;
