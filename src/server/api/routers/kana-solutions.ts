import { type PrismaClient } from "@prisma/client";
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
        desiredKanaGroups: z.array(z.string()),
      })
    )
    .output(
      z.object({
        proposalIsCorrect: z.boolean(),
        nextKana: z.object({
          original: z.string(),
          id: z.string(),
          expectedLength: z.number(),
        }),
        solution: z.object({
          kana: z.string().optional(),
          triesUntilSolution: z.number().default(-1),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.isInitialRequest) {
        return await constructKanaAfterCorrectProposal(
          ctx.prisma,
          input.desiredKanaGroups
        );
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
          userId: ctx.session.user.id,
        },
      });

      if (proposalMatchesKana) {
        return await constructKanaAfterCorrectProposal(
          ctx.prisma,
          input.desiredKanaGroups
        );
      } else {
        const beforeDate = moment(new Date()).subtract(5, "minutes").toDate();
        const recentSolutions = await ctx.prisma.userSolution.count({
          where: {
            kanaId: kana.id,
            correct: false,
            date: {
              gt: beforeDate,
            },
            userId: ctx.session.user.id,
          },
        });

        const remainingTriesBeforeSolution = Math.max(3 - recentSolutions, 0);

        const showSolution = remainingTriesBeforeSolution === 0;

        return {
          proposalIsCorrect: false,
          nextKana: {
            id: kana.id,
            original: kana.kana,
            expectedLength: kana.roumaji.length,
          },
          solution: {
            triesUntilSolution: remainingTriesBeforeSolution,
            kana: showSolution ? kana.roumaji : undefined,
          },
        };
      }
    }),
});

const constructKanaAfterCorrectProposal = async (
  client: PrismaClient,
  desiredKanaGroups: string[]
) => {
  const randomKana = await findRandomKana(client, desiredKanaGroups);
  if (!randomKana) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to retrieve next kana",
    });
  }

  return {
    proposalIsCorrect: true,
    nextKana: {
      id: randomKana.id,
      original: randomKana.kana,
      expectedLength: randomKana.roumaji.length,
    },
    solution: {},
  };
};

const findRandomKana = async (
  client: PrismaClient,
  desiredKanaGroups: string[]
) => {
  const productsCount = await client.kana.count({
    where: {
      groupId: {
        in: desiredKanaGroups,
      },
    },
  });
  const skip = Math.floor(Math.random() * productsCount);
  return await client.kana.findFirst({
    where: {
      groupId: {
        in: desiredKanaGroups,
      },
    },
    skip: skip,
    take: 1,
  });
};
