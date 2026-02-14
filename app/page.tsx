import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function Home() {

  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">

      <div className="bg-white p-10 rounded-2xl shadow-2xl text-center max-w-md">

        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Smart Bookmark Manager
        </h1>

        <p className="text-gray-500 mb-6">
          Save and manage bookmarks securely
        </p>

        <LoginButton />

      </div>

    </div>
  );
}
