import "server-only";

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import {cache, ReactNode} from "react";
import {createCallerFactory, createContext} from "@/trpc/init";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/app";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {TRPCQueryOptions} from "@trpc/react-query/shared";

export const getQueryClient = cache(makeQueryClient);
export const caller = createCallerFactory(appRouter);

export const trpc = createTRPCOptionsProxy({
    ctx: async () => createContext(),
    router: appRouter,
    queryClient: getQueryClient(),
})

export function HydrateClient({children}: {children: ReactNode}) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
        </HydrationBoundary>
    );
}

// @ts-ignore
export function prefetch<T extends ReturnType<TRPCQueryOptions<never, never>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    // @ts-ignore
    if (queryOptions.queryKey[1]?.type === 'infinite') {
        void queryClient.prefetchInfiniteQuery(queryOptions as never);
    } else {
        // @ts-ignore
        void queryClient.prefetchQuery(queryOptions);
    }
}
