import { prismaClient } from "@repo/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "please login" }, { status: 400 });
  }
  const body = await req.json();
  console.log(body.roomName);
  try {
    const owner = await prismaClient.user.findFirst({
      where: {
        username: session!.user!.name!,
      },
    });
    const roomExists = await prismaClient.collab.findFirst({
      where: {
        roomName: body.roomName,
      },
    });
    if (roomExists) {
      return NextResponse.json(
        { message: "Room already exists pick a new name" },
        { status: 400 }
      );
    }
    const data = await prismaClient.collab.create({
      data: {
        roomName: body.roomName,
        language: body.language,
        fileName: body.fileName,
        ownerId: owner!.id,
      },
    });

    return NextResponse.json({ output: "done" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Couldnt be created try again" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Please login" }, { status: 401 });
  }

  const { code, roomName, fileName } = await req.json();

  if (!roomName || typeof roomName !== "string") {
    return NextResponse.json(
      { message: "Invalid or missing room name" },
      { status: 400 }
    );
  }

  try {
    const collab = await prismaClient.collab.findUnique({
      where: { roomName },
    });

    if (!collab) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    const updated = await prismaClient.collab.update({
      where: { roomName },
      data: { code, fileName },
    });

    return NextResponse.json(
      { message: "Code updated successfully", collab: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating code:", error);
    return NextResponse.json(
      { message: "Failed to update code", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: "Please login" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Missing room ID" }, { status: 400 });
  }

  try {
    const room = await prismaClient.collab.findUnique({
      where: { id },
    });

    if (!room) {
      return NextResponse.json({ message: "Room not found" }, { status: 404 });
    }

    // Only the owner can delete the room
    const owner = await prismaClient.user.findFirst({
      where: { username: session.user!.name! },
    });

    if (room.ownerId !== owner!.id) {
      return NextResponse.json(
        { message: "You are not authorized to delete this room" },
        { status: 403 }
      );
    }

    await prismaClient.collab.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting room:", error);
    return NextResponse.json(
      { message: "Failed to delete room", error: String(error) },
      { status: 500 }
    );
  }
}
