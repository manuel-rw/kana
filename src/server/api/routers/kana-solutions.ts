import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const kanaSolutionsRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(
      z.object({
        kanaId: z.string(),
        proposal: z.string(),
        isInitialRequest: z.boolean(),
      })
    )
    .output(
      z.object({
        proposalIsCorrect: z.boolean(),
        nextKana: z.object({ original: z.string(), id: z.string() }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.isInitialRequest) {
        const productsCount = await ctx.prisma.kana.count();
        const skip = Math.floor(Math.random() * productsCount);
        const nextKana = await ctx.prisma.kana.findFirst({
          skip: skip,
          take: 1,
        });

        if (!nextKana) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve next kana",
          });
        }

        return {
          proposalIsCorrect: true,
          nextKana: {
            id: nextKana.id,
            original: nextKana.kana,
          },
        };
      }

      const kana = await ctx.prisma.kana.findUnique({
        where: {
          id: input.kanaId,
        },
      });

      if (!kana) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kana was not found",
        });
      }

      if (kana.romanji === input.proposal) {
        const productsCount = await ctx.prisma.kana.count();
        const skip = Math.floor(Math.random() * productsCount);
        const nextKana = await ctx.prisma.kana.findFirst({
          skip: skip,
          take: 1,
        });

        if (!nextKana) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to retrieve next kana",
          });
        }

        return {
          proposalIsCorrect: true,
          nextKana: {
            id: nextKana.id,
            original: nextKana.kana,
          },
        };
      } else {
        return {
          proposalIsCorrect: false,
          nextKana: {
            id: kana.id,
            original: kana.kana,
          },
        };
      }
    }),
});
