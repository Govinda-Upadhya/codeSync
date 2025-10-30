"use client";
import { CodeXml } from "lucide-react";
import React from "react";
import Link from "next/link";
import useScrollDirection from "../hooks/useScrollDirection";

const EditorNav = () => {
  const scrollDirection = useScrollDirection();
  return (
    <nav
      className={`sticky w-full top-0 left-0 z-50 p-3 flex justify-between ${scrollDirection == "top" ? "bg-navbarbackground-500/100" : "bg-navbarbackground-500/60"} md:p-4 md:flex-row md:items-center md:justify-between shadow-lg backdrop-blur-md md:w-full border-b-2 border-gray-400 `}
    >
      <div className="flex items-center justify-between w-full md:w-auto p-3">
        {" "}
        <div className="flex items-center gap-2">
          <CodeXml className="text-logoicon-500 w-[25px] h-[25px]" />
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-xl font-bold md:text-2xl">
            <Link href={"/"}>CodeSync</Link>
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Link
          href={"/dashboard"}
          className={`transition-all duration-300 hover:text-white hover:scale-105 cursor-pointer text-gray-400`}
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
};

export default EditorNav;
