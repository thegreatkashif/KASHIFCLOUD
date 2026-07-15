import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(process.env.API_URL + "/docker/containers", {
    headers: { Authorization: "Bearer " + token },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch containers" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
