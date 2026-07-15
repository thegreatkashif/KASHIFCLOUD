import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const qs = url.searchParams.toString();
  const formData = await req.formData();

  const res = await fetch(process.env.API_URL + "/storage/upload?" + qs, {
    method: "POST",
    headers: { Authorization: "Bearer " + token },
    body: formData,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
