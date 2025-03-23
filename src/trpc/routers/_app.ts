import { z } from 'zod';
import { createTRPCRouter } from '../init';
import { categoriesRouter } from '@/modules/categories/server/procedure';
import { studioRouter } from '@/modules/studio/server/procedures';
import { videosRouter } from '@/modules/videos/server/procedures';
import { videoViewsRouter } from '@/modules/video-views/server/procedute';

export const appRouter = createTRPCRouter({
    studio: studioRouter,
    categories: categoriesRouter,
    videos: videosRouter,
    videoViews: videoViewsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;