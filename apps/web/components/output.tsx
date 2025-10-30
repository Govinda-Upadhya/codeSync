"use client";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useError, useOutput, useOutputLoading } from "../store/store";

const Output = () => {
  const output = useOutput((state) => state.output);
  const outputLoading = useOutputLoading((state) => state.loading);
  const error = useError((state) => state.error);
  return (
    <div className="flex flex-col mb-6 mr-4 h-[80%] w-full bg-gray-900 rounded-2xl shadow-lg overflow-clip">
      <p className="text-white font-bold m-3 text-2xl ">Output</p>
      <div
        className="flex-1 bg-gray-800 rounded-lg p-3 text-gray-200 font-mono text-sm justify-center items-center h-[80%]"
        id="output-container"
      >
        {outputLoading && (
          <>
            <div className="flex flex-col items-center justify-center h-screen gap-3">
              <div className="animate-spin">
                <Loader size={50} />
              </div>

              <p className="text-2xl animate-pulse">loading...</p>
            </div>
          </>
        )}
        {output && (
          <>
            {output.map((line, key) => (
              <p key={key}>{line}</p>
            ))}
          </>
        )}
        {error && <p className="text-red-400">{error}</p>}
      </div>
    </div>
  );
};

export default Output;
