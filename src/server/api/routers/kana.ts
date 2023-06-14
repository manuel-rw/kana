import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const kanaRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.kanaGroupType.findMany({
      include: {
        groups: {
          include: {
            kanas: true,
          },
        },
      },
    });
  }),

  deleteKanaGroup: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.kanaGroup.delete({
        where: {
          id: input.groupId,
        },
      });
    }),

  deleteKana: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.kana.delete({
        where: {
          id: input.id,
        },
      });
    }),

  upsertKana: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        romanji: z.string(),
        groupId: z.string(),
        kanaId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.kana.upsert({
        where: {
          id: input.kanaId,
        },
        update: {
          kana: input.name,
          romanji: input.romanji,
        },
        create: {
          kana: input.name,
          romanji: input.romanji,
          groupId: input.groupId,
        },
      });
    }),

  upsertKanaGroup: protectedProcedure
    .input(
      z.object({
        id: z.string().default(""),
        name: z.string(),
        typeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.kanaGroup.upsert({
        where: {
          id: input.id,
        },
        create: {
          name: input.name,
          typeId: input.typeId,
        },
        update: {
          name: input.name,
        },
      });
    }),

  upsertKanaGroupType: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.kanaGroupType.upsert({
        where: {
          id: input.id,
        },
        update: {
          name: input.name,
        },
        create: {
          name: input.name,
        },
      });
    }),

  deleteKanaGroupType: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.kanaGroupType.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
