import { useAuth } from "../context/AuthContect";

interface APIReqOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, string> | string;
  headers?: Record<string, string | null>;
}

export const useFetch = ({
  setLoading,
}: {
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { accessToken, setAccessToken } = useAuth();
  const sendRequest = async <T>({
    url,
    options = {},
  }: {
    url: string;
    options?: APIReqOptions;
  }): Promise<T> => {
    setLoading?.(true);

    const performRequest = async (
      accessTokenNew?: string
    ): Promise<Response> => {
      return await fetch(url, {
        method: options.method || "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessTokenNew ? accessTokenNew : accessToken || "",
          ...options.headers,
        },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    };

    try {
      let response = await performRequest();

      if (!response.ok) {
        const errorData = await response.json();

        if (errorData.message === "Invalid token") {
          const refreshResponse = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!refreshResponse.ok) {
            throw new Error("Failed to refresh token");
          }

          const refreshData: { message: string; accessToken: string } =
            await refreshResponse.json();
          setAccessToken(refreshData.accessToken);

          response = await performRequest(refreshData.accessToken); // Retry the original request with the new token
        } else {
          throw new Error(errorData || "Request failed");
        }
      }

      const data: T = await response.json();
      return data;
    } finally {
      setLoading?.(false);
    }
  };

  return { sendRequest };
};
