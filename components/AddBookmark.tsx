"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBookmark() {

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const addBookmark = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6">

      <h2 className="text-lg font-semibold mb-4">
        Add New Bookmark
      </h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Bookmark title"
        className="w-full border rounded-lg p-3 mb-3"
      />

      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="w-full border rounded-lg p-3 mb-3"
      />

      <button
        onClick={addBookmark}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
      >
        Add Bookmark
      </button>

    </div>
  );
}
