import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const getAuthConfig = (
    config?: AxiosRequestConfig,
    useToken: boolean = false
  ): AxiosRequestConfig => {
    const token = useToken ? localStorage.getItem("token") : null;

    return {
      ...config,
      headers: {
        ...(config?.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  };

  const getData = async (
    endpoint: string,
    config?: AxiosRequestConfig,
    useToken: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${BASE_URL}${endpoint}`,
        getAuthConfig(config, useToken)
      );
      return response.data;
    } catch (error) {
      setError(error as AxiosError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const pushData = async (
    endpoint: string,
    method: "post" | "put" | "delete",
    data: any,
    config?: AxiosRequestConfig,
    useToken: boolean = false
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
        ...getAuthConfig(config, useToken),
      });
      return response.data;
    } catch (error) {
      setError(error as AxiosError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { getData, pushData, loading, error };
};
