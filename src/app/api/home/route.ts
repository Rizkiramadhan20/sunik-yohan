import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase/Firebase";

export async function GET(request: Request) {
  try {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
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

    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API key" },
        { status: 401 }
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
    console.error("Error fetching home collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch home collection" },
      { status: 500 }
    );
  }
}
