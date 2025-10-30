import React from "react";

const CTASection = () => {
  return (
    <section className="flex justify-center items-center py-20 bg-[#0F1419] w-full">
      <div className=" w-full p-10 bg-gradient-to-br from-[#0F1419] via-[#1a1f2a] to-[#0F1419] rounded-xl shadow-lg text-center md:w-[80%]">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-gray-400 mb-6">
          Join thousands of developers coding together
        </p>
        <button className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition-colors duration-200">
          Get Started for Free
        </button>
      </div>
    </section>
  );
};

export default CTASection;
