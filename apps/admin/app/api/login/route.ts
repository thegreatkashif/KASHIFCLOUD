import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password, remember } = await req.json();

  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const res = await fetch(process.env.API_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();

  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

  const response = NextResponse.json({ success: true });
  response.cookies.set("kashif_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return response;
}
