window.effSupabase = null;
if (window.EFF_SUPABASE_URL && window.EFF_SUPABASE_PUBLISHABLE_KEY && window.supabase) {
  window.effSupabase = window.supabase.createClient(window.EFF_SUPABASE_URL, window.EFF_SUPABASE_PUBLISHABLE_KEY);
}
