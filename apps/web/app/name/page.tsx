"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/editor/${name}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-900 to-purple-900 p-4">
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-6 text-center">
            Enter Your Name
          </h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full p-3 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white p-3 rounded-md font-semibold"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-center bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Hello, {name}!</h2>
          <p className="text-gray-300">Welcome to the collaborative editor.</p>
        </div>
      )}
    </div>
  );
}
