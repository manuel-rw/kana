import { type UserSolution } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getStats: protectedProcedure
    .output(
      z.object({
        accuracy: z.number(),
        countTotalKanaSolutions: z.number(),
        countWrongKanaSolutions: z.number(),
        countCorrectKanaSolutions: z.number(),
        mostFrequentMistake: z.object({
          count: z.number(),
          original: z.string(),
          roumaji: z.string(),
        }).optional()
      })
    )
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUniqueOrThrow({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          userSolutions: true,
        },
      });

      const total = user.userSolutions.length;
      const wrong = user.userSolutions.filter((sol) => !sol.correct).length;
      const correct = total - wrong;

      const mostFrequentMistakeById = findMostFrequentMistake(user.userSolutions);

      if (!mostFrequentMistakeById || !mostFrequentMistakeById.id) {
        return {
          accuracy: (correct / total) || 0,
          countTotalKanaSolutions: total,
          countWrongKanaSolutions: wrong,
          countCorrectKanaSolutions: correct,
        };
      }

      const mostFrequentMistake = await ctx.prisma.kana.findUniqueOrThrow({
        where: {
          id: mostFrequentMistakeById.id,
        }
      });

      return {
        accuracy: (correct / total) || 0,
        countTotalKanaSolutions: total,
        countWrongKanaSolutions: wrong,
        countCorrectKanaSolutions: correct,
        mostFrequentMistake: {
          count: mostFrequentMistakeById.count,
          original: mostFrequentMistake.kana,
          roumaji: mostFrequentMistake.roumaji,
        }
      };
    }),
});

const findMostFrequentMistake = (solutions: UserSolution[]) => {
  const mistakes: { [key: string]: number } = {};

  solutions.forEach((solution) => {
    if (solution.correct) {
      return;
    }

    if (mistakes[solution.kanaId] === undefined) {
      mistakes[solution.kanaId] = 1;
      return;
    }

    mistakes[solution.kanaId]++;
  });

  let mostFrequentMistakeById: string | null = null;
  let maxFrequency = 0;

  for (const mistake in mistakes) {
    const count = mistakes[mistake] ?? -1;
    if (count < maxFrequency) {
      return;
    }

    mostFrequentMistakeById = mistake;
    maxFrequency = count;
  }

  return {
    count: maxFrequency,
    id: mostFrequentMistakeById,
  }
}
