import { TRPCError } from "@trpc/server";

import moment from "moment";

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
        solution: z.object({ kana: z.string().optional(), triesUntilSolution: z.number().default(-1) }),
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
          solution: {}
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

      const proposalMatchesKana = kana.roumaji === input.proposal;

      await ctx.prisma.userSolution.create({
        data: {
          correct: proposalMatchesKana,
          proposal: input.proposal,
          kanaId: kana.id,
          date: new Date(),
        }
      });

      if (proposalMatchesKana) {
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
          solution: {}
        };
      } else {
        const beforeDate = moment(new Date()).subtract(5, "minutes").toDate();
        const recentSolutions = await ctx.prisma.userSolution.count({
          where: {
            kanaId: kana.id,
            correct: false,
            date: {
              gt: beforeDate
            }
          }
        });

        const remainingTriesBeforeSolution = Math.max(3 - recentSolutions, 0);

        const showSolution = remainingTriesBeforeSolution === 0;

        return {
          proposalIsCorrect: false,
          nextKana: {
            id: kana.id,
            original: kana.kana,
          },
          solution: {
            triesUntilSolution: remainingTriesBeforeSolution,
            kana: showSolution ? kana.roumaji : undefined,
          }
        };
      }
    }),
});
