import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

// Minimal auth hook around Supabase's magic-link (passwordless) email sign-in.
// Returns null user when Supabase isn't configured — callers should treat
// that as "local-only mode" rather than an error.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email) => {
    if (!isSupabaseConfigured) return { error: new Error("Supabase not configured") };
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  };

  return { user, loading, signInWithEmail, signOut };
}
