import Link from "next/link";
import { toast } from "sonner";
import { CommentsGetManyOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";
import { trpc } from "@/trpc/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon, MessageSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from "lucide-react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CommentForm } from "./comment-form";
import { CommentReplies } from "./comment-replies";

interface CommentItemProps {
    comment: CommentsGetManyOutput["items"][number];
    variant?: "reply" | "comment";
}

export const CommentItem = ({
    comment,
    variant = "comment",
}: CommentItemProps) => {
    const clerk = useClerk();
    const { userId } = useAuth();

    const [isReplyOpne, setIsReplyOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);

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

    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });
    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error("Something went wrong");

            if (error.data?.code === "UNAUTHORIZED") {
                clerk.openSignIn();
            }
        }
    });

    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/user/${comment.userId}`}>
                    <UserAvatar
                        size={variant === "comment" ? "lg" : "sm"}
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
                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                    <Button
                                        disabled={like.isPending}
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => like.mutate({ commentId: comment.id })}
                                    >
                                        <ThumbsUpIcon className={
                                            cn(
                                                comment.viewerReaction === "like" && "fill-black"
                                            )}
                                        />
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                        {comment.likeCount}
                                    </span>
                                    <Button
                                        disabled={dislike.isPending}
                                        variant="ghost"
                                        size="icon"
                                        className="size-8"
                                        onClick={() => dislike.mutate({ commentId: comment.id })}
                                    >
                                        <ThumbsDownIcon className={
                                            cn(
                                                comment.viewerReaction === "dislike" && "fill-black"
                                            )}
                                        />
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                        {comment.dislikeCount}
                                    </span>
                                </div>
                                {variant === "comment" && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8"
                                        onClick={() => setIsReplyOpen(true)}
                                    >
                                        Reply
                                    </Button>
                                )}

                            </div>

                        </div>
                    </div>
                </div>
                {comment.user.clerkId === userId && variant === "comment" && (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-8" size="icon">
                                <MoreVerticalIcon />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">

                            <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
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

                )}

            </div>

            {isReplyOpne && variant === "comment" && (
                <div className="pl-14 mt-4">
                    <CommentForm
                        videoId={comment.videoId}
                        parentId={comment.id}
                        variant="reply"
                        onCancel={() => setIsReplyOpen(false)}
                        onSuccess={() => {
                            setIsReplyOpen(false);
                            setIsRepliesOpen(true);
                        }}
                    />
                </div>
            )}
            {comment.replyCount > 0 && variant === "comment" && (
                <div className="pl-14">
                    <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => setIsRepliesOpen((current) => !current)}
                    >
                        {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        {comment.replyCount} replies
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 && isRepliesOpen && variant === "comment" && (
                <CommentReplies
                    parentId={comment.id}
                    videoId={comment.videoId}
                />
            )}
        </div>
    )
}