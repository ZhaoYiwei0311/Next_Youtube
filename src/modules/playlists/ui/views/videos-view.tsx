"use client";
import { trpc } from "@/trpc/client";
import { HistoryVideosSection } from "../sections/history-videos-section";
import { PlaylistHeaderSection } from "../sections/playlist-header-section";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VideosSection } from "../sections/videos-section";

interface VideoViewProps {
    playlistId: string;
}

export const VideosView = ( { 
    playlistId 
}: VideoViewProps) => {
    const utils = trpc.useUtils();
    const router = useRouter();

    const [playlist] = trpc.playlists.getOne.useSuspenseQuery({ id: playlistId });
    const remove = trpc.playlists.remove.useMutation({
        onSuccess: () => {
            toast.success("Playlist removed");
            utils.playlists.getMany.invalidate();
            router.push("/playlists");
        },
        onError: () => {
            toast.error("Something went wrong");
        }
    })
    
    return (
        <div className="max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistHeaderSection playlistId={playlistId} />

            <VideosSection playlistId={playlistId} />

        </div>
    );
};