"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { sendMessage } from "@/lib/messaging";

export default function ChatComponent() {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      setMessages(data || []);
    };

    fetchMessages();

    const subscription = supabase
      .channel("realtime:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    await sendMessage(newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="p-4">
      <div className="h-80 overflow-y-auto border rounded p-2 mb-2">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-1 text-sm">
            🗨️ {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="border rounded px-2 py-1 flex-1"
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="bg-blue-500 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
