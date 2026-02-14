"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BookmarkList() {

  const [bookmarks, setBookmarks] = useState<any[]>([]);

  const [editing, setEditing] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);


  // FETCH BOOKMARKS
  const fetchBookmarks = async (userId: string) => {

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setBookmarks(data);
    }
  };


  // OPEN EDIT MODAL
  const openEdit = (bookmark: any) => {

    setEditing(bookmark);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };


  // SAVE EDIT
  const saveEdit = async () => {

    if (!editing) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .update({
        title: editTitle,
        url: editUrl,
        updated_at: new Date(),
      })
      .eq("id", editing.id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error.message);
      return;
    }

    if (data) {

      setBookmarks(prev =>
        prev.map(b => b.id === data.id ? data : b)
      );

      setEditing(null);
    }
  };


  // DELETE BOOKMARK
  const confirmDelete = async () => {

    if (!deleteId) return;

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", deleteId);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    setBookmarks(prev =>
      prev.filter(b => b.id !== deleteId)
    );

    setDeleteId(null);
  };


  // REALTIME SUBSCRIPTION
  useEffect(() => {

    let channel: any;

    const init = async () => {

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      fetchBookmarks(user.id);

      channel = supabase
        .channel("realtime-bookmarks")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "bookmarks",
            filter: `user_id=eq.${user.id}`,
          },
          (payload: any) => {

            if (payload.eventType === "INSERT") {

              setBookmarks(prev => [payload.new, ...prev]);

            }

            if (payload.eventType === "UPDATE") {

              setBookmarks(prev =>
                prev.map(b =>
                  b.id === payload.new.id ? payload.new : b
                )
              );

            }

            if (payload.eventType === "DELETE") {

              setBookmarks(prev =>
                prev.filter(b => b.id !== payload.old.id)
              );

            }

          }
        )
        .subscribe();

    };

    init();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };

  }, []);


  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-4">


      {/* EMPTY STATE */}
      {bookmarks.length === 0 && (

        <div className="bg-white border rounded-xl p-8 text-center text-gray-500 shadow-sm">

          <div className="text-lg font-medium mb-1">
            No bookmarks yet
          </div>

          <div className="text-sm text-gray-400">
            Add your first bookmark to get started
          </div>

        </div>

      )}



      {/* BOOKMARK LIST */}
      {bookmarks.map(bookmark => {

        const url = bookmark.url.startsWith("http")
          ? bookmark.url
          : `https://${bookmark.url}`;

        const domain = new URL(url).hostname;

        const favicon =
          `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        return (

          <div
            key={bookmark.id}
            className="
            group
            bg-white
            border
            rounded-xl
            p-5
            flex
            justify-between
            items-center
            shadow-sm
            hover:shadow-lg
            hover:border-indigo-300
            transition-all
            duration-200
            "
          >


            {/* LEFT SIDE */}
            <div className="flex items-center gap-4">


              {/* FAVICON */}
              <img
                src={favicon}
                alt="favicon"
                className="w-10 h-10 rounded-md border"
              />


              {/* TITLE + DOMAIN */}
              <div>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    text-gray-900
                    font-semibold
                    text-lg
                    hover:text-indigo-600
                    transition
                  "
                >
                  {bookmark.title}
                </a>

                <div className="text-sm text-gray-500">
                  {domain}
                </div>

              </div>

            </div>



            {/* RIGHT SIDE */}
            <div className="flex items-center gap-2">


              <button
                onClick={() => openEdit(bookmark)}
                className="
                px-3 py-1.5
                text-sm
                font-medium
                text-indigo-600
                hover:bg-indigo-50
                rounded-lg
                transition
                "
              >
                Edit
              </button>


              <button
                onClick={() => setDeleteId(bookmark.id)}
                className="
                px-3 py-1.5
                text-sm
                font-medium
                text-red-600
                hover:bg-red-50
                rounded-lg
                transition
                "
              >
                Delete
              </button>

            </div>

          </div>

        );

      })}



      {/* EDIT MODAL */}
      {editing && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">

            <h2 className="text-lg font-semibold mb-4">
              Edit Bookmark
            </h2>

            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="Bookmark title"
              className="border rounded-lg w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <input
              value={editUrl}
              onChange={e => setEditUrl(e.target.value)}
              placeholder="Bookmark URL"
              className="border rounded-lg w-full p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}



      {/* DELETE MODAL */}
      {deleteId && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-xl w-[350px] text-center">

            <h2 className="text-lg font-semibold mb-3">
              Delete Bookmark
            </h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this bookmark?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}


    </div>
  );
}
