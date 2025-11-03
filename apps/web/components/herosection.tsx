"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface heroprops {
  isLoggedIn: boolean;
}
const Herosection = (props: heroprops) => {
  const router = useRouter();
  async function handleNavigation() {
    if (props.isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }
  function scrollToFeatures() {
    const section = document.getElementById("features");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }
  return (
    <div className="flex flex-col md:p-20 w-full h-[80vh] md:h-[80vh] justify-center items-center p-8 bg-[#0F1419] bg-[linear-gradient(135deg,rgba(159,122,234,0.2)_0%,#0F1419_50%,rgba(8,199,222,0.1)_100%)]">
      <div className="text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-3xl font-extrabold text-center">
        Code Together, Build Faster
      </div>
      <div className="text-navbartextinactive-500 text-center p-5 md:text-xl">
        The ultimate collaborative code editor for teams. Real-time editing,
        powered by modern technology.
      </div>
      <div className="flex gap-3 text-[#F8FAFC]">
        <button
          className="bg-herobutton-500 p-2 rounded-lg hover:opacity-90 md:p-4 md:text-xl hover:cursor-pointer"
          onClick={handleNavigation}
        >
          Start coding
        </button>
        <button
          onClick={scrollToFeatures}
          className="bg-navbarbackground-500 p-2 rounded-lg border-2 md:p-4 md:text-xl hover:cursor-pointer"
        >
          Learn more
        </button>
      </div>
    </div>
  );
};

export default Herosection;
