

import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, text, timestamp, uniqueIndex, pgEnum, primaryKey } from "drizzle-orm/pg-core";
import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    // TODO: Add more fields here
    imageUrl: text("image_url").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)]
);

export const subscriptions = pgTable("subscriptions", {
    viewerId: uuid("viewer_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    creatorId: uuid("creator_id").references(() => users.id, { onDelete: "cascade"}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [
    primaryKey({
        name: "subscriptions_pk",
        columns: [t.viewerId, t.creatorId]
    })
]);

export const subscriptionRelations = relations(subscriptions, ({ one }) => ({
    viewerId: one(users, {
        fields: [subscriptions.viewerId],
        references: [users.id],
        relationName: "subscriptions_viewer_id_fkey"
    }),
    creatorId: one(users, {
        fields: [subscriptions.creatorId],
        references: [users.id],
        relationName: "subscriptions_creator_id_fkey"
    })
}));

export const userRelations = relations(users, ({ many }) => ({
    videos: many(videos),
    videoViews: many(videoViews),
    videoReactions: many(videoReactions),
    subscriptions: many(subscriptions, {
        relationName: "subscriptions_viewer_id_fkey"
    }),
    subscribers: many(subscriptions, {
        relationName: "subscriptions_creator_id_fkey"
    }),
    comments: many(comments)
}));

export const categories = pgTable("catagories", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => [uniqueIndex("name_idx").on(t.name)]
);

export const categoryRelations = relations(users, ({ many }) => ({
    videos: many(videos),
}));

export const videoVisibility = pgEnum("video_visibility", [
    "private",
    "public"
]);

export const videos = pgTable("videos", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    muxStatus: text("mux_status"),
    muxAssetId: text("mux_asset_id").unique(),
    muxUploadId: text("mux_upload_id").unique(),
    muxPlaybackId: text("mux_playback_id").unique(),
    muxTrackId: text("mux_track_id").unique(),
    muxTrackStatus: text("mux_track_status"),
    thumbnailUrl: text("thumbnail_url"),
    thumbnailKey: text("thumbnai_key"),
    previewUrl: text("preview_url"),
    previewKey: text("preview_key"),
    duration: integer("duration").default(0).notNull(),
    visibility: videoVisibility("visibility").default("private").notNull(),
    userId: uuid("user_id").references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    categoryId: uuid("category_id").references(() => categories.id, {
        onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const videoSelectSchema = createSelectSchema(videos);
export const videoInsertSchema = createInsertSchema(videos);
export const videoUpdateSchema = createUpdateSchema(videos);

export const videoRelations = relations(videos, ({ one, many }) => ({
    user: one(users, {
        fields: [videos.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [videos.categoryId],
        references: [categories.id],
    }),
    views: many(videoViews),
    reactions: many(videoReactions),
    comments: many(comments)
}));

export const comments = pgTable("comments", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade"}).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade"}).notNull(),
    value: text("value").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentRelations = relations(comments, ({ one }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id]
    }),
    video: one(videos, {
        fields: [comments.videoId],
        references: [videos.id]
    })
}))


export const commentsInsertSchema = createInsertSchema(comments);
export const commentsSelectSchema = createSelectSchema(comments);
export const commentsUpdateSchema = createUpdateSchema(comments);

export const videoViews = pgTable("video_views", {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }, (t) => [
    primaryKey({
        name: "video_views_pk",
        columns: [t.userId, t.videoId],
      })
  ]);

export const videoViewsRelations = relations(videoViews, ({ one }) => ({ 
    users: one(users, {
        fields: [videoViews.userId],
        references: [users.id]
    }),
    videos: one(videos, {
        fields: [videoViews.videoId],
        references: [videos.id],
    })
}));

export const videoViewInsertSchema = createInsertSchema(videoViews);
export const videoViewSelectSchema = createSelectSchema(videoViews);
export const videoViewUpdateSchema = createUpdateSchema(videoViews);

export const reactionType = pgEnum("reaction_type", ["like", "dislike"]);

export const videoReactions = pgTable("video_reactions", {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    videoId: uuid("video_id").references(() => videos.id, { onDelete: "cascade" }).notNull(),
    type: reactionType("type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  }, (t) => [
    primaryKey({
        name: "video_reactions_pk",
        columns: [t.userId, t.videoId],
      })
  ]);

export const videoReactionRelations = relations(videoReactions, ({ one }) => ({ 
    users: one(users, {
        fields: [videoReactions.userId],
        references: [users.id]
    }),
    videos: one(videos, {
        fields: [videoReactions.videoId],
        references: [videos.id],
    })
}));


export const videoReactionInsertSchema = createInsertSchema(videoReactions);
export const videoReactionSelectSchema = createSelectSchema(videoReactions);
export const videoReactionUpdateSchema = createUpdateSchema(videoReactions);