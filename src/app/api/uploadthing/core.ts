import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { videos, users } from "@/db/schema";

const f = createUploadthing();


export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({
      videoId: z.string().uuid(),
    }))

    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      // If you throw, the user will not be able to upload
      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      if (!user) {
        throw new UploadThingError("Unauthorized");
      }

      return { user, ...input}
    })
    .onUploadComplete(async ({ metadata, file }) => {
        await db
          .update(videos)
          .set({
            thumbnailUrl: file.url
          })
          .where(and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.user.id)
          ))

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
