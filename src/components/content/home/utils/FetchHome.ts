import axios from "axios";

import { HomeData, ApiResponse } from "@/components/content/home/types/home";

export const fetchHomeData = async (): Promise<HomeData[]> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/home`,
      {
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};
