import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  const res = await fetch(process.env.API_URL + "/storage/item?" + qs, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
