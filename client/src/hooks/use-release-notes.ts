import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useReleaseNotes() {
  return useQuery({
    queryKey: [api.releaseNotes.list.path],
    queryFn: async () => {
      const res = await fetch(api.releaseNotes.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch release notes");
      return api.releaseNotes.list.responses[200].parse(await res.json());
    },
  });
}
