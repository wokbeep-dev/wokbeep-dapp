"use client";

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";

export function useSupabase() {
  const [supabase] = useState(() => createPagesBrowserClient());
  return supabase;
}
