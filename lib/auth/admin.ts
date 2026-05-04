import type { User } from "@supabase/supabase-js";
import { createUserServerClient } from "@/lib/supabase/server";

export async function getAdminUser(): Promise<User | null> {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!adminEmail) return null;

  const supabase = await createUserServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;
  if (user.email.toLowerCase() !== adminEmail) return null;
  return user;
}
