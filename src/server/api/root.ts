import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { imageRouter } from "~/server/api/routers/image";
import { authorRouter } from "~/server/api/routers/author";
import { categoryRouter } from "./routers/category";
import { draftRouter } from "./routers/draft";
import { postRouter } from "./routers/post";
import { seriesRouter } from "./routers/series";
import { tagRouter } from "./routers/tag";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  author: authorRouter,
  category: categoryRouter,
  draft: draftRouter,
  image: imageRouter,
  post: postRouter,
  series: seriesRouter,
  tag: tagRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
