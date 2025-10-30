import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { prismaClient } from "@repo/db/client";
export async function POST(req: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "please login" }, { status: 400 });
  }
  const body = await req.json();
  console.log(session);
  console.log("body", body);
  try {
    const owner = await prismaClient.user.findFirst({
      where: {
        username: session!.user!.name!,
      },
    });
    const data = await prismaClient.fileSave.create({
      data: {
        name: body.fileName,
        language: body.language,
        code: body.code,
        ownerId: owner!.id,
      },
    });

    return NextResponse.json({ output: "done" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Couldnt be saved try again" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "please login" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    const res = await prismaClient.fileSave.delete({ where: { id: id! } });
    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "couldn't delete the file" },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "please login" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "File ID is required" },
      { status: 400 }
    );
  }

  try {
    const file = await prismaClient.fileSave.findUnique({
      where: { id },
      include: {
        owner: true, // optional: if you want user info
      },
    });

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    return NextResponse.json(file, { status: 200 });
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { message: "Error fetching file" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Please login" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { id, code, fileName, language } = body;

    if (!id) {
      return NextResponse.json(
        { message: "File ID is required" },
        { status: 400 }
      );
    }

    // Find the file first
    const file = await prismaClient.fileSave.findUnique({ where: { id } });

    if (!file) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }
    const userInfo = await prismaClient.user.findFirst({
      where: { id: file.ownerId },
    });
    if (!userInfo) {
      return NextResponse.json({ message: "no valid user" });
    }
    // Optional: check if the logged-in user is the owner
    if (userInfo.username !== session.user?.name) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    // Update the file
    const updatedFile = await prismaClient.fileSave.update({
      where: { id },
      data: {
        code,
        name: fileName,
        language,
      },
    });

    return NextResponse.json(
      { message: "File updated", file: updatedFile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating file:", error);
    return NextResponse.json(
      { message: "Could not update file" },
      { status: 500 }
    );
  }
}
