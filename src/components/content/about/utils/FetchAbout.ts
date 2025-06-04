import axios from "axios";

import { AboutData, ApiResponse } from "@/components/content/about/types/about";

export const fetchAboutContents = async (): Promise<AboutData[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/home/about`,
      {
        headers: {
          "Cache-Control": "public, max-age=10",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};
