"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";

type ActionState = { error?: string };

export async function signup(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { data: authData, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    logger.error("signup_failed", { error: error.message });
    return { error: error.message };
  }

  if (authData.user) {
    const admin = createAdminClient();
    const { error: profileError } = await admin.from("profiles").insert({
      id: authData.user.id,
      email,
      full_name: name,
      role: "customer",
    });
    if (profileError) logger.error("profile_insert_failed", { error: profileError.message });
  }

  logger.info("signup_success", { email });
  redirect("/");
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logger.error("login_failed", { error: error.message });
    return { error: "Invalid email or password" };
  }

  logger.info("login_success", { email });
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
