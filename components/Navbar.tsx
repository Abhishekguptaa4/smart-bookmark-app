"use client";

import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b">

      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Left side */}
        <h1 className="text-xl font-semibold text-indigo-600">
          Smart Bookmark Manager
        </h1>

        {/* Right side */}
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}
