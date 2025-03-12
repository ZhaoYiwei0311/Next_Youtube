"use-client";

import Link from "next/link";

import { 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarGroup,
    SidebarMenuButton,
    SidebarGroupLabel,
    SidebarMenuItem } from "@/components/ui/sidebar";

import { HistoryIcon, ThumbsUpIcon, ListVideoIcon } from "lucide-react";



const items = [
    {
        title: "History",
        url: "/playlists/history",
        icon: HistoryIcon,
        auth: true,
    },
    {
        title: "Liked Videos",
        url: "/playlists/liked-videos",
        icon: ThumbsUpIcon,
        auth: true,
    },
    {
        title: "All playlists",
        url: "/playlists",
        icon: ListVideoIcon,
        auth: true
    },

];

export const PersonalSection = () => {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={false}
                                // onClick={() => {}}
                            >
                                <Link href={item.url} className="flex items-center gap-4">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                    ))}

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
