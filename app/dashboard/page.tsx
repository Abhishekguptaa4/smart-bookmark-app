import { createSupabaseServerClient } from "@/lib/supabaseServer";
import AddBookmark from "@/components/AddBookmark";
import BookmarkList from "@/components/BookmarkList";
import Navbar from "@/components/Navbar";
import { redirect } from "next/navigation";

export default async function Dashboard() {

  const supabase = await createSupabaseServerClient();

  // PERMANENT FIX: use getUser instead of getSession
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // handle error safely
  if (error || !user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-8">

        <AddBookmark />

        <BookmarkList />

      </main>

    </div>
  );
}
