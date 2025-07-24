"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { filters } from "@/lib/filters"; // adjust path as needed

export default function FilteredUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilteredUsers = async () => {
      let query = supabase.from("users").select("*");

      // Apply filters dynamically
      if (filters.age) {
        query = query.gt("age", filters.age);
      }
      if (filters.name) {
        query = query.neq("name", filters.name);
      }
      if (filters.email) {
        query = query.ilike("email", filters.email);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching filtered users:", error.message);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    fetchFilteredUsers();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Filtered Users</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users match the filters.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} – {user.email} – {user.age} years
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
