import { TRPCError } from "@trpc/server";

import bcrypt from "bcrypt";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { userRegisterFormSchema } from "~/schemas/user-schema";
import { prisma } from "~/server/db";
import { hashPassword } from "~/utils/security";

export const registerRouter = createTRPCRouter({
  register: publicProcedure
    .input(userRegisterFormSchema)
    .mutation(async ({ input }) => {
      const existingUser = await prisma.user.findFirst({
        where: {
          name: input.username,
        },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = hashPassword(input.password, salt);

      const user = await prisma.user.create({
        data: {
          name: input.username,
          password: hashedPassword,
          salt: salt,
        },
      });

      return {
        id: user.id,
        name: user.name,
      };
    }),
});
