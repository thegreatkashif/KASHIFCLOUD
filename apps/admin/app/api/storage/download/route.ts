import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  const res = await fetch(process.env.API_URL + "/storage/download?" + qs, {
    headers: { Authorization: "Bearer " + token },
  });

  const blob = await res.blob();
  const filename = url.searchParams.get("path")?.split("/").pop() || "download";

  return new NextResponse(blob, {
    headers: {
      "Content-Disposition": "attachment; filename=\"" + filename + "\"",
      "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
    },
  });
}
