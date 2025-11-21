import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Define the file path (inside your project root or a writable directory)
    const filePath = path.join(process.cwd(), "users.json");

    // Read existing file or initialize empty array
    let existingData: { users: object[] } = { users: [] };
    try {
      const fileContent = await import("fs/promises").then((fs) =>
        fs.readFile(filePath, "utf-8")
      );
      existingData = JSON.parse(fileContent);
    } catch (readErr) {
      // File doesn't exist or is invalid; start fresh
      existingData = { users: [] };
    }

    // Append the new user
    existingData.users.push(body);

    // Write the updated JSON back to the file
    await import("fs/promises").then((fs) =>
      fs.writeFile(filePath, JSON.stringify(existingData, null, 2))
    );

    return new Response("User data saved successfully.", { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    return new Response("Failed to save user data.", { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
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
