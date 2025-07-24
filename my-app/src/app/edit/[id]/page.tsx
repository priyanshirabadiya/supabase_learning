"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch user data to pre-fill form
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(id))
        .single();

      if (error) {
        setMessage("❌ Failed to load user: " + error.message);
      } else {
        setFormData({
          name: data.name,
          age: data.age.toString(),
          address: data.address,
          email: data.email,
        });
      }
      setLoading(false);
    };

    if (id) fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("users")
      .update({
        name: formData.name,
        age: Number(formData.age),
        address: formData.address,
        email: formData.email,
      })
      .eq("id", Number(id));

    if (error) {
      setMessage("❌ Update failed: " + error.message);
    } else {
      setMessage("✅ User updated successfully!");
      // Optionally redirect:
      router.push("/select");
    }

    setLoading(false);
  };

  if (loading) return <p className="p-4">Loading user...</p>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit User</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full"
          required
        />
        <input
          name="age"
          type="number"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          className="border p-2 w-full"
          required
        />
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 w-full"
          required
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 w-full"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
