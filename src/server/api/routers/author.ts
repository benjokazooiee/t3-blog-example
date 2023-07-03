import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const authorRouter = createTRPCRouter({
  getOwnAuthorId: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const fetchedAuthorId = await ctx.prisma.author.findUniqueOrThrow({
      where: {
        userId: userId,
      },
      select: {
        id: true,
      },
    });
    return fetchedAuthorId;
  }),
  getPostsByAuthor: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const authorAndPosts = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          createdPosts: true,
        },
      });
      return authorAndPosts;
    }),
});
