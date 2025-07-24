"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      const user = data.user;
      const session = data.session;

      console.log("loggned in user is:", user);
      console.log("loggned in user's session is:", session);

      setSuccess("Login successfull!");
      setFormData({ email: "", password: "" });
      // Optional: redirect after delay
      setTimeout(() => router.push("/home"), 0);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white">
        <h1 className="text-2xl font-bold mb-4">Log in account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Log In
          </button>
          <p
            className="text-sm text-blue-600 cursor-pointer mt-2"
            onClick={() => router.push("/reset-password")}
          >
            Forgot Password?
          </p>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {success && <p className="text-green-600 mt-4">{success}</p>}
      </div>
    </div>
  );
}
