"use client";
import { CodeXml, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import useScrollDirection from "../hooks/useScrollDirection";

import { signOut } from "next-auth/react";

interface dashNavProps {
  profile: string | null | undefined;
}

const Dashnav = ({ profile }: dashNavProps) => {
  const scrollDirection = useScrollDirection();

  return (
    <nav
      className={`sticky w-full top-0 left-0 z-50 p-3 flex justify-between ${
        scrollDirection === "top"
          ? "bg-navbarbackground-500/100"
          : "bg-navbarbackground-500/60"
      } md:p-4 md:flex-row md:items-center md:justify-between shadow-lg backdrop-blur-md md:w-full border-b-2 border-gray-400 `}
    >
      <div className="flex items-center gap-2">
        <CodeXml className="text-logoicon-500 w-[25px] h-[25px]" />
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-xl font-bold md:text-2xl">
          <Link href={"/"}>CodeSync</Link>
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Profile Image */}
        {profile && (
          <div className="rounded-full bg-logoicon-500 h-[50px] w-[50px] overflow-hidden flex justify-center items-center">
            <img src={profile} className="h-full w-full rounded-full" />
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Dashnav;
