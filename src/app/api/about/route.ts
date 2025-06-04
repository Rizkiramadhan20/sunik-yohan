import { NextResponse } from "next/server";

import { collection, getDocs } from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

export async function GET() {
  try {
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
    console.error("Error fetching about_content collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch about_content collection" },
      { status: 500 }
    );
  }
}
