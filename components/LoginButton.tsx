"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginButton() {

  const login = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,

        queryParams: {
            prompt: "select_account",
          // Add any custom query parameters here if needed
        },
      },
    });

  };

  return (
    <button
      onClick={login}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
    >
      Continue with Google
    </button>
  );
}
