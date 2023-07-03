import {
  createTagInput,
  getdeleteTagInput,
  updateTagInput,
} from "~/server/utils/zodSchemas";
import { createTRPCRouter, editorProcedure, publicProcedure } from "../trpc";

export const tagRouter = createTRPCRouter({
  getTags: publicProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany();
    return tags;
  }),
  getTag: publicProcedure
    .input(getdeleteTagInput)
    .query(async ({ ctx, input }) => {
      const tag = ctx.prisma.tag.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return tag;
    }),
  getTagPosts: publicProcedure
    .input(getdeleteTagInput)
    .query(async ({ ctx, input }) => {
      const tagAndPosts = await ctx.prisma.tag.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          posts: true,
        },
      });
      return tagAndPosts;
    }),
  createTag: editorProcedure
    .input(createTagInput)
    .mutation(async ({ ctx, input }) => {
      const newTag = await ctx.prisma.tag.create({
        data: {
          title: input.title,
        },
      });
      return newTag;
    }),
  updateTag: editorProcedure
    .input(updateTagInput)
    .mutation(async ({ ctx, input }) => {
      const updatedTag = await ctx.prisma.tag.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
        },
      });
      return updatedTag;
    }),
  deleteTag: editorProcedure
    .input(getdeleteTagInput)
    .mutation(async ({ ctx, input }) => {
      const deletedTag = await ctx.prisma.tag.delete({
        where: {
          id: input.id,
        },
      });
      return deletedTag;
    }),
});
