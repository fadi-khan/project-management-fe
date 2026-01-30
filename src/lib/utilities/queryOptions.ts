import { UseQueryOptions } from "@tanstack/react-query"

export const queryOptions = <T = any>(
    keys: Array<string>,
    queryFunction: () => Promise<T>,
    staleTime?: number,
    gcTime?: number,
    retry?: number

): UseQueryOptions<T, Error, T, string[]> => {

    return {
        queryKey: keys,
        queryFn: queryFunction,
        staleTime: staleTime || 30 * 1000, // 30 seconds for search results
        gcTime: gcTime || 2 * 60 * 1000, // 2 minutes cache for search results
        retry: retry || 3,
        retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }

}