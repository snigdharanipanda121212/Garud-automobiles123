import { NextRequest, NextResponse } from "next/server";
import { createAdminToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const enteredUsername = (username || "").trim().toLowerCase();
    const enteredPassword = (password || "").trim();

    // Default authenticating coordinates
    const defaultUsername = 'Garudautomobiles';
    const defaultPassword = 'garudautomobiles@1512025';

    // Retrieve environment values from server-side environment
    const targetUsername = (process.env.ADMIN_USERNAME || defaultUsername).trim().toLowerCase();
    const targetPassword = (process.env.ADMIN_PASSWORD || defaultPassword).trim();

    if (enteredUsername === targetUsername && enteredPassword === targetPassword) {
      const token = createAdminToken(targetUsername);
      const res = NextResponse.json({ success: true, token, username: targetUsername });
      // Set secure session cookie as well
      res.cookies.set('garud_admin_session', token, {
        httpOnly: false, // allow client-side sync
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      });
      return res;
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials. Please make sure there are no typos." },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server validation failure." },
      { status: 500 }
    );
  }
}
