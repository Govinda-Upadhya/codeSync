import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
    language: body.language,
    version: "*",
    files: [
      {
        name: "general",
        content: body.code,
      },
    ],
  });

  return NextResponse.json({ output: res.data }, { status: 200 });
}
