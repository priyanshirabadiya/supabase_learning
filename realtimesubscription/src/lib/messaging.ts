"use server";

import { supabase } from "@/lib/supabaseClient";

export async function sendMessage(text: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("user is :",user);
  
  if (!user) throw new Error("Not logged in");

  const { error } = await supabase.from("messages").insert({
    sender_id: user.id,
    text,
  });

  if (error) throw error;
}
