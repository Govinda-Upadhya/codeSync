"use client";
import { CodeXml, List, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useScrollDirection from "../hooks/useScrollDirection";

export default function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const scrollDirection = useScrollDirection();
  const pathname = usePathname();

  const handleNavbar = () => setOpen((prev) => !prev);

  return (
    <nav
      className={`sticky w-full top-0 left-0 z-50 flex flex-col ${scrollDirection == "top" ? "bg-navbarbackground-500/100" : "bg-navbarbackground-500/60"} md:p-4 md:flex-row md:items-center md:justify-between shadow-lg backdrop-blur-md md:w-full`}
    >
      {/* --- Left Section (Logo + Mobile Toggle) --- */}
      <div className="flex items-center justify-between w-full md:w-auto p-3">
        <div className="flex items-center gap-2">
          <CodeXml className="text-logoicon-500 w-[25px] h-[25px]" />
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-xl font-bold md:text-2xl">
            <Link href={"/"}>CodeSync</Link>
          </p>
        </div>

        {/* --- Mobile Menu Button --- */}
        <button
          onClick={handleNavbar}
          className="md:hidden text-logoicon-500 focus:outline-none"
        >
          {open ? (
            <X className="w-[36px] h-[36px]" />
          ) : (
            <List className="w-[36px] h-[36px]" />
          )}
        </button>
      </div>

      {/* --- Nav Links --- */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out md:flex md:items-center md:w-auto md:overflow-visible ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
        }`}
      >
        <ul className="flex flex-col items-center gap-6 py-4 md:flex-row md:gap-8 text-lg text-gray-300">
          {["Dashboard", "Get Started"].map((item) => {
            const path = `/${item.toLowerCase().replace(" ", "-")}`;
            const isActive = pathname === path;

            return (
              <div key={item} className="flex flex-col items-center">
                <Link
                  href={path}
                  className={`transition-all duration-300 hover:text-white hover:scale-105 cursor-pointer ${
                    isActive
                      ? "text-logotext1-500 font-semibold"
                      : "text-gray-300"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
                <div
                  className={`w-full h-[3px] bg-logotext1-500 transform origin-left transition-transform ease-linear ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                ></div>
              </div>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
