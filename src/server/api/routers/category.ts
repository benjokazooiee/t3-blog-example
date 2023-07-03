import {
  categoryInputs,
  createCategoryInput,
  deleteManyCategoriesInput,
  getDeleteCategoryInput,
} from "~/server/utils/zodSchemas";
import { createTRPCRouter, editorProcedure, publicProcedure } from "../trpc";

export const categoryRouter = createTRPCRouter({
  getCategory: publicProcedure
    .input(getDeleteCategoryInput)
    .query(async ({ ctx, input }) => {
      const id = input.id;
      const category = await ctx.prisma.category.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return category;
    }),
  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.prisma.category.findMany();
    return categories;
  }),
  getCategoryPosts: publicProcedure
    .input(getDeleteCategoryInput)
    .query(async ({ ctx, input }) => {
      const categoryAndPosts = await ctx.prisma.category.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          relevantPosts: true,
        },
      });

      return categoryAndPosts;
    }),
  createCategory: editorProcedure
    .input(createCategoryInput)
    .mutation(async ({ ctx, input }) => {
      const { title, parentId } = input;
      const newCategory = await ctx.prisma.category.create({
        data: {
          title,
          parentId,
        },
      });
      return newCategory;
    }),
  updateCategory: editorProcedure
    .input(categoryInputs)
    .mutation(async ({ ctx, input }) => {
      const { id, title, parentId } = input;
      const updatedCategory = await ctx.prisma.category.update({
        where: {
          id,
        },
        data: {
          title,
          parentId,
        },
      });
      return updatedCategory;
    }),
  deleteCategories: editorProcedure
    .input(deleteManyCategoriesInput)
    .mutation(async ({ ctx, input }) => {
      const deletedCategories = await ctx.prisma.category.deleteMany({
        where: {
          id: {
            in: input,
          },
        },
      });
      return deletedCategories;
    }),
});
