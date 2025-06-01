import { useState } from "react";

interface APIReqOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, string> | string;
  headers?: Record<string, string>;
}

export const useFetch = ({
  setLoading,
}: {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async <T>({
    url,
    options = {},
  }: {
    url: string;
    options?: APIReqOptions;
  }): Promise<T> => {
    setLoading?.(true);
    setError(null);

    try {
      const response = await fetch(url, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData || "Request failed");
      }
      const data: T = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading?.(false);
    }
  };

  return { sendRequest, error };
};
