"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    const { data, error } = await supabase.from("users").insert([
      {
        name: formData.name,
        age: Number(formData.age), // ensure age is a number
        address: formData.address,
        email: formData.email,
      },
    ]);

    if (error) {
      setMessage("❌ Failed to create user: " + error.message);
    } else {
      setMessage("✅ User created successfully!");
      setFormData({ name: "", age: "", address: "", email: "" });
    }

    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create New User</h2>

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
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
