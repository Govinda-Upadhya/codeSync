"use client";
import React, { useEffect, useState } from "react";
import EditorMain from "../../../components/editorMain";

import EditorNav from "../../../components/editorNav";
import Output from "../../../components/output";
import { useDisplayModal } from "../../../store/store";
import axios from "axios";
import { BASE_URL } from "../../../lib";
import { setTimeout } from "timers";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";

export default function EditorPage({
  id,
  file,
}: {
  id: string;
  file: { name: string; language: string; code: string; update: boolean };
}) {
  const [language, setLanguage] = useState<string>(file.language);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [code, setCode] = useState<string>(file.code);
  const [fileName, setFileName] = useState<string>(file.name);
  const display = useDisplayModal((state) => state.display);
  const setDisplay = useDisplayModal((state) => state.setDisplay);
  async function handlesubmit() {
    setSubmitting(true);

    const res = await axios.post(`${BASE_URL}/api/file`, {
      code,
      fileName,
      language,
    });
    console.log(res.data);
    setDisplay(false);
    toast.success("the file has been saved successfully");
    setSubmitting(false);
  }
  async function updateData() {
    const res = await axios.put(`${BASE_URL}/api/file`, {
      id: id[0],
      code,
      fileName,
      language,
    });
    console.log(res.data);
    setDisplay(false);
    toast.success("the file has been updated successfully");
    setSubmitting(false);
  }
  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      {display && (
        <div className="absolute z-1 flex justify-center items-center h-full w-full bg-gray-500/10 backdrop-blur-md rounded-2xl shadow-lg border border-white/10">
          <div className="border-2 rounded-2xl bg-white p-6 shadow-md max-w-md mx-auto flex flex-col gap-4">
            <div className="flex w-full justify-between">
              <h2 className="text-xl font-semibold text-gray-800">Save File</h2>
              <div>
                <X
                  className="flex bg-red-400 text-white rounded-md hover:cursor-pointer hover:bg-red-500"
                  onClick={() => setDisplay(false)}
                />
              </div>
            </div>

            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name (e.g. main.cpp)"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
            />

            {file.update ? (
              <button
                disabled={submitting}
                className={`w-full ${submitting ? "bg-gray-400 hover:cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}  text-white font-medium py-2 rounded-xl transition-colors duration-200`}
                onClick={updateData}
              >
                {submitting ? "Updating..." : "Update"}
              </button>
            ) : (
              <button
                disabled={submitting}
                className={`w-full ${submitting ? "bg-gray-400 hover:cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}  text-white font-medium py-2 rounded-xl transition-colors duration-200`}
                onClick={handlesubmit}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            )}
          </div>
        </div>
      )}
      <EditorNav />
      <div className="flex flex-col md:flex-row h-[90%] w-full">
        {" "}
        <EditorMain
          update={file.update}
          language={language}
          setLanguage={setLanguage}
          code={code}
          setCode={setCode}
        />
        <Output />
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
