// app/editor/[...id]/page.tsx  (server component)

import { prismaClient } from "@repo/db/client";
import EditorPage from "./editorPage";
import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const file: {
    name: string;
    language: string;
    code: string;
    update: boolean;
  } = {
    name: "main.js",
    language: "Javascript",
    code: "",
    update: false,
  };
  const { id } = await params;
  if (id[0] !== "new") {
    const fileInfo = await prismaClient.fileSave.findFirst({
      where: { id: id[0] },
    });
    if (!fileInfo) {
      return redirect("/dashboard");
    }
    file.name = fileInfo.name;
    file.language = fileInfo.language;
    file.code = fileInfo.code;
    file.update = true;
  }
  return <EditorPage id={id} file={file} />; // pass id to client component
}
