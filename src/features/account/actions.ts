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
  const phone = formData.get("phone") as string;
  const locale = formData.get("locale") as string || "en";
  const confirmPassword = formData.get("confirmPassword") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

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
      phone,
      role: "customer",
    });
    if (profileError) logger.error("profile_insert_failed", { error: profileError.message });
  }

  logger.info("signup_success", { email });
  redirect(`/${locale}/login`);
}

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const locale = formData.get("locale") as string || "en";

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    logger.error("login_failed", { error: error.message });
    return { error: "Invalid email or password" };
  }

  logger.info("login_success", { email });

  const admin = createAdminClient();
  const { data: profile } = await admin.from("profiles").select("role").eq("id", data.user.id).single();

  if (profile?.role === "admin" || profile?.role === "staff") {
    redirect(`/${locale}/admin`);
  }

  redirect(`/${locale}/account`);
}

export async function logout(formData?: FormData) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const locale = formData?.get("locale") as string || "en";
  redirect(`/${locale}`);
}
