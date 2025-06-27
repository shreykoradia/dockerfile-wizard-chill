// hooks/useGenerateDocker.ts
import { ResponseProps } from "@/pages/Index";
import { useMutation } from "@tanstack/react-query";

interface ConfigProps {
  stack: "node" | "next" | "fastapi";
  dependencies: string;
  needsRedis?: boolean;
  needsPostgres?: boolean;
}

export function useGenerateDocker() {
  return useMutation({
    mutationFn: async (config: ConfigProps): Promise<ResponseProps> => {
      const res = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/docker-generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-salt-key": import.meta.env.VITE_PUBLIC_API_SALT_KEY ?? "",
          },
          body: JSON.stringify(config),
        }
      );

      let data = await res.json();
      data = data.result;

      if (!res.ok) {
        throw new Error(data?.error?.formErrors?.join(", ") || "Unknown error");
      }

      return {
        dockerfile: data.dockerfile,
        dockerCompose: data.compose,
        dockerignore: data.ignore,
        explanation: data.explain,
      };
    },
  });
}
