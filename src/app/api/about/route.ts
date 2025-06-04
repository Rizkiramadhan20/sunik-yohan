import { NextResponse } from "next/server";

import axios from "axios";

import { headers } from "next/headers";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET() {
  try {
    const headersList = await headers();
    const apiKey = headersList.get("x-api-key");

    if (!apiKey || apiKey !== API_KEY) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/home/about`
    );
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Failed to fetch data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// Endpoint to get the API key
export async function POST() {
  return NextResponse.json({ apiKey: API_KEY });
}
