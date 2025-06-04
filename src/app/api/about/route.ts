import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase/Firebase";

export async function GET(request: Request) {
  try {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NEXT_PHASE === "phase-production-build"
    ) {
      const aboutContentCollection = collection(
        db,
        process.env.NEXT_PUBLIC_COLLECTIONS_ABOUT_CONTENT as string
      );
      const querySnapshot = await getDocs(aboutContentCollection);

      const aboutContentData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return NextResponse.json({ data: aboutContentData }, { status: 200 });
    }

    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid API key" },
        { status: 401 }
      );
    }

    const aboutContentCollection = collection(
      db,
      process.env.NEXT_PUBLIC_COLLECTIONS_ABOUT_CONTENT as string
    );
    const querySnapshot = await getDocs(aboutContentCollection);

    const aboutContentData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ data: aboutContentData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching about collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch about collection" },
      { status: 500 }
    );
  }
}
