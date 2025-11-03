"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    router.push(`/dashboard/collabs/${encodeURIComponent(roomName.trim())}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0F1419] text-white px-6">
      <div className="max-w-md w-full bg-[#1A1F25] p-8 rounded-2xl shadow-lg border border-gray-800">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-transparent bg-clip-text">
          Join a Room
        </h1>
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter room or session name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="p-3 rounded-lg bg-[#0F1419] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-logotext1-500"
          />
          <button
            type="submit"
            className="bg-logotext1-500 hover:bg-logotext1-600 text-white py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
