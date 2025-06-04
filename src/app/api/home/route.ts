import { NextResponse } from "next/server";

import { collection, getDocs } from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

import { cookies } from "next/headers";

import { auth, db as adminDb } from "@/utils/firebase/admins";

import { headers } from "next/headers";

import { Role } from "@/types/Auth";

export async function GET() {
  try {
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key");

    // Check for API key first
    if (apiKey === process.env.API_KEY) {
      const homeCollection = collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_HOME as string
      );
      const querySnapshot = await getDocs(homeCollection);

      const homeData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({ data: homeData }, { status: 200 });
    }

    // If no API key, check for admin session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Verify session cookie and check admin role
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      const userDoc = await adminDb
        .collection(process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string)
        .doc(decodedClaims.uid)
        .get();
      const userData = userDoc.data();

      if (!userData || userData.role !== Role.ADMIN) {
        return NextResponse.json(
          { error: "Access denied - Admin only" },
          { status: 403 }
        );
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

      return NextResponse.json({ data: homeData }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid session - Please login again" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error fetching home collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch home collection" },
      { status: 500 }
    );
  }
}
