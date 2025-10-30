import { prismaClient } from "@repo/db/client";
import EditorPage from "./editorPage";
import { getServerSession } from "next-auth";

export default async function Page({
  params,
}: {
  params: { roomName: string[] };
}) {
  const roomName = params.roomName[0].trim();
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
    return <div className="text-white p-10">Room not found.</div>;
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
