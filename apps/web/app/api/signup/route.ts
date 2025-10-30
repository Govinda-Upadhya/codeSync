import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@repo/db/client";
import Email from "next-auth/providers/email";
import bcrypt from "bcrypt";
export async function POST(req: NextRequest) {
  const user = await req.json();
  try {
    let userExists = await prismaClient.user.findFirst({
      where: {
        email: user.email,
      },
    });
    if (userExists) {
      return NextResponse.json(
        {
          message: "User exists. Use different email ",
        },
        { status: 400 }
      );
    }
    userExists = await prismaClient.user.findFirst({
      where: {
        username: user.username,
      },
    });
    if (userExists) {
      return NextResponse.json(
        {
          message: "User exists. Use different username",
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const createUser = await prismaClient.user.create({
      data: {
        username: user.username,
        password: hashedPassword,
        email: user.email,
      },
    });
    return NextResponse.json(
      { message: "User created successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Couldn't signup, try again later" },
      { status: 500 }
    );
  }
}
