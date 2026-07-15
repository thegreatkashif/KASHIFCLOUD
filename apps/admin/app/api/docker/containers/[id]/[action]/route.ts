import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  const token = req.cookies.get("kashif_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id, action } = await params;

  const allowedActions = ["start", "stop", "restart"];
  if (!allowedActions.includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const res = await fetch(
    process.env.API_URL + "/docker/containers/" + id + "/" + action,
    {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: "Action failed" }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
