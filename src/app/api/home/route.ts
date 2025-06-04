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
      console.error("No session cookie found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const decodedToken = await auth.verifySessionCookie(sessionCookie);
      console.log("Session verified for user:", decodedToken.uid);

      const userDoc = await adminDb
        .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
        .doc(decodedToken.uid)
        .get();
      const userData = userDoc.data();
      console.log("User role:", userData?.role);

      if (!userData || userData.role !== Role.ADMIN) {
        console.error("User is not admin:", userData?.role);
        return NextResponse.json(
          { error: "Forbidden: Admin access required" },
          { status: 403 }
        );
      }

      // Verify environment variables
      if (!process.env.NEXT_PUBLIC_COLLECTIONS_HOME) {
        console.error("NEXT_PUBLIC_COLLECTIONS_HOME is not defined");
        throw new Error("Collection path is not configured");
      }

      const homeCollection = collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string
      );
      const querySnapshot = await getDocs(homeCollection);

      const homeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const response = NextResponse.json({ data: homeData }, { status: 200 });
      response.headers.set("Cache-Control", "public, max-age=60, s-maxage=60");
      response.headers.set("Content-Security-Policy", "default-src 'self'");

      return response;
    } catch (authError) {
      console.error("Authentication error:", authError);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error in API route:", error);

    // Log more details in development
    if (process.env.NODE_ENV !== "production") {
      console.error("Detailed error:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        env: {
          hasHomeCollection: !!process.env.NEXT_PUBLIC_COLLECTIONS_HOME,
          hasAccountsCollection: !!process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS,
        },
      });
    }

    const errorMessage =
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
        ? error.message
        : "Failed to process request";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
