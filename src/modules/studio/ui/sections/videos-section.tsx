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
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoThumbnail } from "@/modules/videos/ui/components/video-thumbnail";
import { snakeCaseToTitle } from "@/lib/utils";
import { Globe2Icon, LockIcon } from "lucide-react";

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
                                    <div className="flex items-center gap-4">
                                        <div className="relative aspect-video w-36 shrink-0">
                                            <VideoThumbnail 
                                                title={video.title}
                                                imageUrl={video.thumbnailUrl} 
                                                previewUrl={video.previewUrl}
                                                duration={video.duration || 0}
                                            />
                                        </div>
                                        <div className="flex flex-col overflow-hidden gap-1">
                                            <span className="text-sm line-clamp-1">{video.title}</span>
                                            <span className="text-xs text-muted-foreground line-clamp-1">
                                                {video.description || "No descripton"}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        {video.visibility === "private" ? (
                                            <LockIcon className="size-4 mr-2" />
                                        ): (
                                            <Globe2Icon className="size-4 mr-2" />
                                        )}
                                        {snakeCaseToTitle(video.visibility)}
                                    </div>
                                </TableCell>                                
                                <TableCell>
                                    <div className="flex items-center">
                                        {snakeCaseToTitle(video.muxStatus || "error")}
                                    </div>
                                </TableCell>                                
                                <TableCell className="text-sm truncate">
                                    {format(new Date(video.createdAt), "d MMM yyyy")}
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
