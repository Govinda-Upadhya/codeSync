import { CodeXml } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 flex justify-between items-center w-full p-3 bg-navbarbackground-500/60 border-t-2 border-gray-400 backdrop-blur-3xl ">
      <div className="flex items-center gap-2">
        <CodeXml className="text-logoicon-500 w-[25px] h-[25px]" />
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-xl font-bold md:text-2xl">
          <Link href="/">CodeSync</Link>
        </p>
      </div>
      <div className="flex text-gray-400 text-sm md:text-base ">
        © 2025 <span className="hidden md:block">CodeSync.</span> All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;
