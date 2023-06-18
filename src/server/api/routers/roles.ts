import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const findAllRolesOutputSingleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAdmin: z.boolean(),
});

export const findAllRolesOutputSchema = z.array(
  findAllRolesOutputSingleItemSchema
);

export const rolesRouter = createTRPCRouter({
  findAllRoles: protectedProcedure
    .output(findAllRolesOutputSchema)
    .query(async ({ ctx }) => {
      const roles = await ctx.prisma.role.findMany();

      return findAllRolesOutputSchema.parseAsync(roles);
    }),

  deleteRole: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.role.delete({
        where: {
          id: input.id,
        },
      });
    }),

  upsertRole: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        isAdmin: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.role.upsert({
        where: {
          id: input.id,
        },
        update: {
          name: input.name,
        },
        create: {
          name: input.name,
          isAdmin: input.isAdmin,
        },
      });
    }),
});
