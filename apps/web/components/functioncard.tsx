"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface functionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  navigate: string;
}

const Functioncard = ({
  icon,
  title,
  description,
  navigate,
}: functionProps) => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(navigate as string)}
      className="group flex flex-col p-4 bg-[#222938] border-2 border-gray-400 hover:shadow-2xl transition-all ease-linear duration-100 rounded-2xl gap-3 overflow-hidden justify-start"
    >
      {/* Wrap the logo so it scales inside the card without overflowing */}
      <div className="h-12 w-12 text-primary  group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="text-white font-bold">{title}</div>
      <div className="text-gray-400 ">{description}</div>
    </div>
  );
};

export default Functioncard;
