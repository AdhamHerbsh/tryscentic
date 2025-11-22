import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  const { id } = await params;

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users/" + id);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Upstream error" },
        { status: res.status }
      );
    }
    const users = await res.json();
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "Fetch failed" + err }, { status: 500 });
  }
}

export function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) {
  return "";
}
