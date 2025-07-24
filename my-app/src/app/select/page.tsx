"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      console.log("Logged data",data);
      
      if (error) console.error(error);
      else setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div>
        {users.map((user) => (
          <div key={user.id} >
            {user.name} {user.email} {user.age}
          </div>
        ))}
      </div>
    </>
  );
}

