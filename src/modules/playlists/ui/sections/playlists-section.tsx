"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { VideoGridCardSkeleton } from "@/modules/videos/ui/components/video-grid-card";
import { VideoRowCardSkeleton } from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { PlaylistGridCard } from "../components/playlist-grid-card";



export const PlaylistsSection = () => {
    return (
        <Suspense>
            <ErrorBoundary fallback={<PlaylistsSectionSkeleton />}>
                <PlaylistsSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    )
}

const PlaylistsSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {Array.from({ length: 18 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>

            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 18 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )
}


const PlaylistsSectionSuspense = () => {
    const [playlists, query] = trpc.playlists.getMany.useSuspenseInfiniteQuery({
        limit: DEFAULT_LIMIT,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    }

    );

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2200px)]:grid-cols-6">
                {playlists.pages
                    .flatMap((page) => page.items)
                    .map((playlist) => (
                        <PlaylistGridCard 
                            key={playlist.id}
                            data={playlist}
                        />
                    ))
                }
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </div>

    )
}