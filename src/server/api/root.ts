import { commandRouter } from "./routers/command";
import { registerRouter } from "./routers/register";
import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  register: registerRouter,
  command: commandRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
