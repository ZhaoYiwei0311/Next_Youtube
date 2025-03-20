"use client"

import { DEFAULT_LIMIT } from "@/constants";
import { trpc } from "@/trpc/client"
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { InfiniteScroll } from "@/components/infinite-scroll";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const VideoSection = () => {
    return (
        <div>

            <Suspense fallback={<p>Loading...</p>}>
                <ErrorBoundary fallback={<p>Error</p>}>
                    <VideosSectionSuspense />
                </ErrorBoundary>

            </Suspense>
        </div>
    )

};

const VideosSectionSuspense = () => {
    const router = useRouter();
    const [videos, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({
        limit: DEFAULT_LIMIT
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-6 w-[510px]">Video</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Views</TableHead>
                        <TableHead className="text-right">Comments</TableHead>
                        <TableHead className="text-right pr-6">Likes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {videos.pages.flatMap((page) => page.items).map((video) => (
                        <Link href={`/studio/videos/${video.id}`} key={video.id} legacyBehavior>
                            <TableRow onClick={() => router.push(`/studio/videos/${video.id}`)} className="cursor-pointer">
                                <TableCell>
                                    {video.title}
                                </TableCell>
                                <TableCell>
                                    {video.title}
                                </TableCell>                                
                                <TableCell>
                                    {video.title}
                                </TableCell>                                
                                <TableCell>
                                    {video.title}
                                </TableCell>                                
                                <TableCell>
                                    {video.title}
                                </TableCell>                                
                                <TableCell>
                                    {video.title}
                                </TableCell>
                            </TableRow>
                        </Link>
                    )
                    )}
                </TableBody>
            </Table>

            {/* {JSON.stringify(videos)} */}
            <InfiniteScroll
                isManual
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fecthNextPage={query.fetchNextPage}
            />

        </div>
    )
}

// export const VideoSection = () => {
//     const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
//         limit: DEFAULT_LIMIT
//     }, {
//         getNextPageParam: (lastPage) => lastPage.nextCursor,
//     });

//     return (
//         <div>
//             {JSON.stringify(data)}
//         </div>
//     )
// }