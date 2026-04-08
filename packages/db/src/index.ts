// @repo/db — database types
// Generated manually; run `supabase gen types` to regenerate from live schema.

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  locale: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
};

export type CanvasSession = {
  id: string;
  lead_name: string | null;
  lead_email: string | null;
  lead_company: string | null;
  language: string;
  source: string;
  domain_graph: {
    entities: unknown[];
    relationships: unknown[];
    notes: unknown[];
  };
  messages: unknown[];
  summary: string | null;
  fit_score: number | null;
  fit_reason: string | null;
  status: "active" | "completed" | "reviewed" | "accepted" | "declined";
  tokens_used: number;
  cost_usd: number;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  user_id: string | null;
  canvas_session_id: string | null;
  name: string;
  email: string | null;
  company: string | null;
  source: string;
  status: "lead" | "active" | "completed" | "returning" | "declined";
  fit_score: number | null;
  budget_range: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
