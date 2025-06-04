import { NextResponse } from "next/server";

import { collection, getDocs } from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

import { cookies } from "next/headers";

import { Role } from "@/types/Auth";

import { auth, db as adminDb } from "@/utils/firebase/admins";

export async function GET(request: Request) {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the session cookie
    const decodedToken = await auth.verifySessionCookie(sessionCookie);

    // Get user data from Firestore
    const userDoc = await adminDb
      .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
      .doc(decodedToken.uid)
      .get();
    const userData = userDoc.data();

    if (!userData || userData.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // If we get here, user is authenticated and is an admin
    const homeCollection = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string
    );
    const querySnapshot = await getDocs(homeCollection);

    const homeData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Add cache control headers
    const response = NextResponse.json({ data: homeData }, { status: 200 });
    response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
    response.headers.set("Content-Security-Policy", "default-src 'self'");

    return response;
  } catch (error) {
    console.error("Error in API route:", error);

    // Sanitize error message for production
    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
        ? error.message
        : "Failed to process request";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
