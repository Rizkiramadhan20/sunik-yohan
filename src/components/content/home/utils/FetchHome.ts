import { homeProps } from "@/components/content/home/types/home";

export const fetchHomeContents = async (): Promise<homeProps[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_COLLECTIONS_HOME}`,
      {
        next: { revalidate: 10 }, // Revalidate every 10 seconds
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
        },
      }
    );

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
