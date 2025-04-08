"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { PlaylistCreateModal } from "../components/playlist-create-modal";
import { PlaylistsSection } from "../sections/playlists-section";

export const PlaylistsView = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
            <PlaylistCreateModal 
                open={createModalOpen}
                onOpenChange={setCreateModalOpen}
            />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2-xl font-bold">Playlists</h1>
                    <p className="text-xs text-muted-foreground">
                        Playlists you have created recently
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="rounded-full"
                    size="icon"
                    onClick={() => setCreateModalOpen(true)}
                >
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </div>

            <PlaylistsSection />

        </div>
    );
};