export async function getSession() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (e) {
    console.error("getSession error:", e);
    return null;
  }
}

export async function getProfile() {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  } catch (e) {
    console.error("getProfile error:", e);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") return null;
  return profile;
}