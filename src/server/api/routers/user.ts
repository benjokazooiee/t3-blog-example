import { z } from "zod";
import { adminProcedure, createTRPCRouter, editorProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  userToAuthor: editorProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newAuthor = await ctx.prisma.author.create({
        data: {
          userId: input.userId,
        },
      });
      if (!newAuthor) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return newAuthor;
    }),
  userToWriter: editorProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newAuthor = ctx.prisma.author.create({
        data: {
          userId: input.userId,
        },
      });
      const updatedUser = ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          dbAccess: 1,
          role: env.ROLE_TWO,
        },
      });
      const result = await Promise.all([newAuthor, updatedUser]);
      if (!result[0] || !result[1]) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return result;
    }),

  userToEditor: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newAuthor = ctx.prisma.author.create({
        data: {
          userId: input.userId,
        },
      });
      const updatedUser = ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          dbAccess: 2,
          role: env.ROLE_THREE,
        },
      });
      const result = await Promise.all([newAuthor, updatedUser]);
      if (!result[0] || !result[1]) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return result;
    }),
  writerToEditor: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          dbAccess: 2,
          role: env.ROLE_THREE,
        },
      });
      if (!updatedUser) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return updatedUser;
    }),
  deactivateAuthor: editorProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deactivatedAuthor = ctx.prisma.author.update({
        where: {
          userId: input.userId,
        },
        data: {
          active: false,
        },
      });
      const updatedUser = ctx.prisma.user.update({
        where: {
          id: input.userId,
        },
        data: {
          dbAccess: 0,
          role: env.ROLE_ONE,
        },
      });
      const result = await Promise.all([deactivatedAuthor, updatedUser]);
      if (!result[0] || !result[1]) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      return result;
    }),
});
