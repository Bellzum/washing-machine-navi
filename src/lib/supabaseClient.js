import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// The app must work fully (minus cloud sync) even if Supabase hasn't been
// configured yet — e.g. right after cloning the repo, before the user has
// created a Supabase project. When either env var is missing we simply
// don't create a client, and every feature falls back to localStorage.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null;
