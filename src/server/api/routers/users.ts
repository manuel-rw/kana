import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const findAllUsersOutputSingleItemSchema = z.object({
  name: z.string(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  roles: z.array(
    z.object({ id: z.string(), name: z.string(), isAdmin: z.boolean() })
  ),
  id: z.string(),
});

export const findAllUsersOutputSchema = z.array(
  findAllUsersOutputSingleItemSchema
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
      await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string().email().nullable(),
        roles: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roles = await ctx.prisma.role.findMany({
        where: {
          id: {
            in: input.roles,
          },
        },
      });

      await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
          roles: {
            set: [],
            connectOrCreate: roles.map((role) => ({
              create: role,
              where: {
                id: role.id,
              },
            })),
          },
        },
      });
    }),
});
