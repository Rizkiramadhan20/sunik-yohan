import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase/Firebase";

export async function GET() {
  try {
    const homeCollection = collection(db, "home");
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
