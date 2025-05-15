import { useCallback, useEffect, useState } from "react";
import { request } from "./axiosClient";

export const useGet = <T = Record<string, unknown>>(
  url: string,
  {
    useToken = false,
    refetchDeps = [],
  }: { useToken?: boolean; refetchDeps?: string[] } = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await request({ url, useToken });
      setData(res);
    } catch (err) {
      setError(
        (err as Error).message || "Terjadi kesalahan saat mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }, [url, useToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...refetchDeps]);

  return { data, loading, error, refetch: fetchData };
};

export const usePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async ({
    url,
    method = "POST",
    data,
    useToken = false,
    isFormData = false,
  }: {
    url: string;
    method?: "POST" | "PUT" | "DELETE";
    data: object;
    useToken?: boolean;
    isFormData?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request({
        method: method,
        url,
        data,
        useToken,
        isFormData,
      });
      return res;
    } catch (err) {
      setError(err as string);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { post, loading, error };
};
