
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        console.log("Session Data is", session);
        setUserEmail(session?.user?.email ?? null); // ✅ Save user email to state
      }
    };

    checkUser();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {userEmail ? (
        <p>
          Welcome, <strong>{userEmail}</strong>
        </p>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}
