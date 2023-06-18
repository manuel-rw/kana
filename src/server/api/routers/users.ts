import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const findAllUsersOutputSchema = z.array(
  z.object({
    name: z.string(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    roles: z.array(z.any()),
    id: z.string(),
  })
);

export const userRouter = createTRPCRouter({
  findAllUsers: protectedProcedure
    .output(findAllUsersOutputSchema)
    .query(async ({ ctx }) => {
      const users = await ctx.prisma.user.findMany({
        include: {
          roles: true,
        },
      });

      return findAllUsersOutputSchema.parseAsync(users);
    }),

  deleteUser: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
