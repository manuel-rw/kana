import { kanaRouter } from "./routers/kana";
import { registerRouter } from "./routers/register";
import { createTRPCRouter } from "~/server/api/trpc";
import { kanaSolutionsRouter } from "./routers/kana-solutions";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  register: registerRouter,
  kana: kanaRouter,
  kanaSolutions: kanaSolutionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
