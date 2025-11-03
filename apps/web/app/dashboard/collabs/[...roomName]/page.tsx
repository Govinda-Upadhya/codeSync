import { prismaClient } from "@repo/db/client";
import EditorPage from "./editorPage";
import { getServerSession } from "next-auth";

export default async function Page({
  params,
}: {
  params: { roomName: string[] };
}) {
  const roomName = params!.roomName[0]!.trim();
  let contributor = true;
  // 1️⃣ Get the current session
  const session = await getServerSession();
  if (!session?.user?.name) {
    return (
      <div className="text-white p-10">Please log in to join this room.</div>
    );
  }

  // 2️⃣ Find the logged-in user
  const user = await prismaClient.user.findUnique({
    where: { username: session.user.name },
  });

  if (!user) {
    return <div className="text-white p-10">User not found.</div>;
  }

  // 3️⃣ Find the collab room
  const room = await prismaClient.collab.findFirst({
    where: { roomName },
    include: { collaborators: true },
  });

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0F1419] text-white px-6">
        <div className="bg-[#1A1F25] p-10 rounded-2xl shadow-2xl border border-gray-800 text-center max-w-md w-full">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-logotext1-500 to-logotext2-500 text-transparent bg-clip-text">
            Room Not Found
          </h1>

          <p className="text-gray-400 text-lg mb-8">
            The room you’re trying to join doesn’t exist or may have been
            closed.
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="/joinSession"
              className="bg-logotext1-500 hover:bg-logotext1-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              Join Another Room
            </a>

            <a
              href="/"
              className="bg-navbarbackground-500 border border-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    );
  }
  console.log(room.ownerId, user.id);
  if (room.ownerId == user.id) {
    console.log("owner");
    contributor = false;
    console.log(contributor);
  }
  // 4️⃣ Prevent owner from being added as a collaborator
  if (room.ownerId !== user.id) {
    const alreadyCollaborator = room.collaborators.some(
      (c) => c.id === user.id
    );

    // 5️⃣ Add collaborator only if not already in list
    if (!alreadyCollaborator) {
      await prismaClient.collab.update({
        where: { roomName },
        data: {
          collaborators: {
            connect: { id: user.id },
          },
        },
      });
      console.log(`✅ Added ${user.username} as collaborator to ${roomName}`);
    }
  } else {
    console.log("ℹ️ Owner joined — skipping collaborator addition.");
  }

  // 6️⃣ Render editor
  return (
    <EditorPage
      contributor={contributor}
      name={room.fileName}
      prog_language={room.language}
      prog_code={room.code ?? ""}
      roomName={roomName}
    />
  );
}
