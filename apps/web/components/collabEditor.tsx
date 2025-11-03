"use client";
import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Download, Play } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../lib";
import {
  useDisplayModal,
  useError,
  useOutput,
  useOutputLoading,
} from "../store/store";

// Dynamically import MonacoEditor with SSR disabled
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface EditorProps {
  roomName: string;
  code: string;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  update: boolean;
  setCode: React.Dispatch<React.SetStateAction<string>>;
}

const randomColor = () =>
  "#" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

const CollabEditor = ({
  roomName,
  setCode,
  setLanguage,
  code,
  language,
  update,
}: EditorProps) => {
  const languages = ["Javascript", "Java", "Python", "C++"];
  const setSaveModal = useDisplayModal((state) => state.setDisplay);
  const editorRef = useRef<any>(null);
  const userColor = useRef(randomColor());
  const remoteCursorsRef = useRef<string[]>([]);

  const setError = useError((state) => state.setError);
  const setLoading = useOutputLoading((state) => state.setLoading);
  const setOutput = useOutput((state) => state.setOutput);

  async function handleMount(editor: any, monacoInstance: any) {
    editorRef.current = editor;

    // 1️⃣ Monaco theme
    monacoInstance.editor.defineTheme("my-custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
        "editorCursor.foreground": userColor.current,
      },
    });
    monacoInstance.editor.setTheme("my-custom-theme");

    // 2️⃣ Yjs + WebRTC
    const Y = await import("yjs");
    const { WebrtcProvider } = await import("y-webrtc");

    const { MonacoBinding } = await import("y-monaco");

    const doc = new Y.Doc();
    const yText = doc.getText("monaco");

    const provider = new WebrtcProvider(roomName, doc, {
      signaling: ["ws://31.97.239.18:4444"],
    });
    const awareness = provider.awareness;

    // Announce local user
    const username = "User-" + Math.floor(Math.random() * 1000);
    awareness.setLocalStateField("user", {
      name: username,
      color: userColor.current,
    });

    console.log("Monaco before binding:", editor.getModel().getValue());
    console.log("Yjs before binding:", yText.toString());

    // Bind Monaco to Yjs
    new MonacoBinding(yText, editor.getModel(), new Set([editor]), awareness);

    // Listen for awareness updates
    function maybeInsertInitialCode() {
      const peerCount = Array.from(awareness.getStates().keys()).length;
      console.log("👥 Current peer count:", peerCount);

      // Only insert code if this document is still empty and there’s just one peer
      if (peerCount === 1 && yText.toString().trim() === "") {
        console.log("✅ First user detected — inserting default code...");
        yText.insert(0, code);
      }
    }

    // Call once now (in case this client really is first)
    maybeInsertInitialCode();

    // And also call again when awareness updates (other users connect)
    awareness.on("update", () => {
      maybeInsertInitialCode();
    });

    // Debug logs
    console.log("Monaco after binding:", editor.getModel().getValue());
    console.log("Yjs after binding:", yText.toString());

    // Render remote cursors
    awareness.on("change", () => {
      renderCursors(editor, awareness, monacoInstance);
      console.log("Users in room:", awareness.getStates().size);
    });
  }

  function renderCursors(editor: any, awareness: any, monacoInstance: any) {
    const oldDecorations = remoteCursorsRef.current;
    const newDecorations: any[] = [];
    const model = editor.getModel();
    if (!model) return;

    Array.from(awareness.getStates().values()).forEach((state: any) => {
      if (!state.user || !state.selection) return;
      const { anchor, head } = state.selection;
      if (!anchor || !head) return;

      const startPos = model.getPositionAt(anchor.index || 0);
      const endPos = model.getPositionAt(head.index || 0);

      newDecorations.push({
        range: new monacoInstance.Range(
          startPos.lineNumber,
          startPos.column,
          endPos.lineNumber,
          endPos.column
        ),
        options: {
          inlineClassName: "remote-selection",
          className: "remote-cursor",
          beforeContentClassName: "remote-cursor-label",
          overviewRuler: {
            color: state.user.color,
            position: monacoInstance.editor.OverviewRulerLane.Full,
          },
        },
      });
    });

    remoteCursorsRef.current = editor.deltaDecorations(
      oldDecorations,
      newDecorations
    );
  }

  async function handleOutput() {
    try {
      setLoading(true);
      setOutput([""]);
      setError("");
      const res = await axios.post(`${BASE_URL}/api/execute`, {
        code,
        language: language.toLowerCase(),
      });

      const output = res.data.output;
      if (output.run.stdout) setOutput(output.run.stdout.split("\n"));
      if (output.run.stderr) setError(output.run.stderr);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while executing the code.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(value: string | undefined) {
    setCode(value || "");
  }

  return (
    <div className="relative flex flex-col bg-blue-950 m-2 p-4 rounded-xl md:justify-between gap-3 h-[80%] w-[90%] ml-2">
      {/* Top controls */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
        <div className="grid grid-cols-3 gap-3 items-center md:grid-cols-4">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-xl hover:bg-blue-600 hover:text-white border-1 ${
                language === lang
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-200"
              } transition-colors duration-200 shadow`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleOutput}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-blue-700 transition-colors duration-200 shadow border-1"
          >
            <Play size={18} />
            <span>Run</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800 text-white hover:bg-blue-700 transition-colors duration-200 shadow border-1"
            onClick={() => setSaveModal(true)}
          >
            <Download size={18} />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-full w-full">
        <Editor
          theme="vs-dark"
          language={language.toLowerCase()}
          options={{
            fontSize: 16,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: "on",
            parameterHints: { enabled: true },
            suggestSelection: "first",
            cursorBlinking: "smooth",
          }}
          height="100%"
          width="100%"
          onMount={handleMount}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default CollabEditor;
