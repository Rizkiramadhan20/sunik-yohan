import { AboutData, ApiResponse } from "@/components/content/about/types/about";

export const fetchAboutContents = async (): Promise<AboutData[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/home/about`,
      {
        next: {
          revalidate: 0,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: ApiResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching about data:", error);
    throw error;
  }
};
