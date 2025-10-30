"use client";

import axios from "axios";
import React, { useState } from "react";

import { Bounce, toast, ToastContainer } from "react-toastify";
import { BASE_URL } from "../../../lib";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("Javascript");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!roomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call (replace with your API endpoint)
      const res = await axios.post("/api/collab", {
        roomName,
        fileName,
        language,
      });

      toast.success(`Room "${roomName}" created successfully!`);
      setRoomName("");
      router.push(`/dashboard/collabs/${roomName}`);
    } catch (err) {
      toast.error("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navbarbackground-500 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Create a New Room
        </h1>

        <input
          type="text"
          placeholder="Enter your room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     placeholder-gray-400 text-gray-800"
        />
        <input
          type="text"
          placeholder="Enter file name (e.g. main.cpp)"
          value={fileName}
          onChange={(e) => setFileName(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 
                     placeholder-gray-400 text-gray-800"
        />

        {/* Language Dropdown */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value.trim())}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                     bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
        >
          <option value="JavaScript">Javascript</option>
          <option value="Python">Python</option>
          <option value="C++">C++</option>
          <option value="Java">Java</option>
        </select>

        <button
          onClick={handleCreate}
          disabled={loading}
          className={`w-full py-2 text-white rounded-xl font-medium transition 
            ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
          `}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
