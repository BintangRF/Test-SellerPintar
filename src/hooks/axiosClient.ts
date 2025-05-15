import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 100000,
});

export const request = async ({
  method = "GET",
  url = "",
  data = null,
  useToken = false,
  isFormData = false,
}: {
  method?: string;
  url: string;
  data?: string | object | FormData | null;
  useToken?: boolean;
  isFormData?: boolean;
}) => {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": isFormData ? "multipart/form-data" : "application/json",
    };

    if (useToken) {
      const token = localStorage.getItem("token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await axiosClient({
      method,
      url,
      data,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    if (axios.isAxiosError(error)) {
      throw error.response?.data || error.message;
    }
    throw error;
  }
};
