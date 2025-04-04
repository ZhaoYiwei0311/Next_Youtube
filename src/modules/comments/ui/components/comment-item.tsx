import Link from "next/link";
import { toast } from "sonner";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { add, formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MessageSquareIcon, MoreVerticalIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
}

export const CommentItem = ({
    comment,
}: CommentItemProps) => {
    const clerk = useClerk();
    const { userId } = useAuth();
    const utils = trpc.useUtils();

    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success("Comment deleted");
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        },
    });

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/user/${comment.userId}`}>
                    <UserAvatar
                        size="lg"
                        imageUrl={comment.user.imageUrl}
                        name={comment.user.name}>

                    </UserAvatar>
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/user/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium text-sm pb-0.5">
                                {comment.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, {
                                    addSuffix: true
                                })}
                            </span>
                        </div>
                    </Link>
                    <p>{comment.value}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="size-8" size="icon">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { /* reply logic here */ }}>
                            <MessageSquareIcon className="size-4 mr-2" />
                            Reply
                        </DropdownMenuItem>

                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </div>
    )
}