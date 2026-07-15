import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;

  const res = await fetch(process.env.API_URL + "/jobs/" + id + "/run", {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
