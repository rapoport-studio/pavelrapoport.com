import { createClient } from "@supabase/supabase-js";
import { supabase } from "@repo/config";
import type { Database } from "./types";

export const db = createClient<Database>(supabase.url, supabase.anonKey);
