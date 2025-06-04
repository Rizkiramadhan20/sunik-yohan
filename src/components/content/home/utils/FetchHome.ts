import { homeProps } from "@/components/content/home/types/home";

const API_URL = `/api/${process.env.NEXT_PUBLIC_COLLECTIONS_HOME}`;

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

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching home contents:", error);
    throw error;
  }
};
