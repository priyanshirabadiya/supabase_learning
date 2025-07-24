"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function OAuthLoginButtons() {
  const router = useRouter();

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `/home`, // where to redirect after login
      },
    });
    if (error) {
      console.error("OAuth login error:", error.message);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* <button
        onClick={() => handleOAuthLogin('google')}
        className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
      >
        Continue with Google
      </button> */}
      {/* <button
        onClick={() => handleOAuthLogin('github')}
        className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900"
      >
        Continue with GitHub
      </button> */}
      // Sign in with GitHub button
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Continue with GitHub
      </button>
    </div>
  );
}
