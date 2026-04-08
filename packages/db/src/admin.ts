import { createClient } from "@supabase/supabase-js";
import { supabase } from "@repo/config";
import type { Database } from "./types";

export function createAdminClient() {
  if (!supabase.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin client");
  }
  return createClient<Database>(supabase.url, supabase.serviceRoleKey);
}
