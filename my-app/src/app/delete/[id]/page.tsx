"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DeleteUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        setMessage("❌ Error fetching user: " + error.message);
      } else {
        setUser(data);
      }

      setLoading(false);
    };

    if (id) fetchUser();
  }, [id]);

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", Number(id));

    if (error) {
      setMessage("❌ Failed to delete: " + error.message);
    } else {
      setMessage("✅ User deleted successfully!");
      // Optionally redirect
      setTimeout(() => {
        router.push("/"); // Or wherever your users list is
      }, 1500);
    }
    setLoading(false);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <p className="p-4">User not found.</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-red-600">Delete User</h2>

      <p className="mb-2">Are you sure you want to delete the following user?</p>
      <div className="border p-3 rounded mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </div>

      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Deleting..." : "Yes, Delete User"}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
