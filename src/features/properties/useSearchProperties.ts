import { useInfiniteQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";
import { SearchParams } from "@/types";

export function useSearchProperties(filters: Omit<SearchParams, "cursor">) {
  return useInfiniteQuery({
    queryKey: ["properties", "search", filters],
    queryFn: ({ pageParam }) =>
      propertyService.search({ ...filters, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.pagination.hasNextPage ? lastPage.pagination.nextCursor ?? undefined : undefined),
  });
}
