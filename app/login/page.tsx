"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Login() {

  const login = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">

      <div className="bg-white p-10 rounded-2xl shadow-xl text-center">

        <h2 className="text-2xl font-bold mb-6">
          Welcome Back
        </h2>

        <button
          onClick={login}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Continue with Google
        </button>

      </div>

    </div>
  );
}
