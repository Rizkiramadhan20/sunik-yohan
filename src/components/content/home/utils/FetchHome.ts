import { homeProps } from "@/components/content/home/types/home";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/home`;

export const fetchHomeContents = async (): Promise<homeProps[]> => {
  try {
    const response = await fetch(API_URL, {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch home contents: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Invalid response format: missing data property");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching home contents:", error);
    return []; // Return empty array instead of throwing to prevent page crash
  }
};
