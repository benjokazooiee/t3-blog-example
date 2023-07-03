import {
  seriesInputCreate,
  seriesInputDeleteOther,
  seriesInputGetDelete,
  seriesInputUpdate,
  seriesInputs,
} from "~/server/utils/zodSchemas";
import {
  createTRPCRouter,
  editorProcedure,
  publicProcedure,
  writerProcedure,
} from "../trpc";

export const seriesRouter = createTRPCRouter({
  getAllSeries: publicProcedure.query(async ({ ctx }) => {
    const allSeries = await ctx.prisma.series.findMany();
    return allSeries;
  }),
  getOneSeries: publicProcedure
    .input(seriesInputGetDelete)
    .query(async ({ ctx, input }) => {
      const series = await ctx.prisma.series.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return series;
    }),
  getOwnSeries: writerProcedure.query(async ({ ctx }) => {
    const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
      },
    });
    const seriesByAuthor = await ctx.prisma.series.findMany({
      where: {
        authorId,
      },
    });
    return seriesByAuthor;
  }),
  getSeriesPosts: publicProcedure
    .input(seriesInputGetDelete)
    .query(async ({ ctx, input }) => {
      const seriesAndPosts = await ctx.prisma.series.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          posts: true,
        },
      });
      return seriesAndPosts;
    }),
  createSeries: writerProcedure
    .input(seriesInputCreate)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const newSeries = await ctx.prisma.series.create({
        data: {
          title: input.title,
          description: input.description,
          authorId,
        },
      });
      return newSeries;
    }),
  updateOwnSeries: writerProcedure
    .input(seriesInputUpdate)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const updatedSeries = await ctx.prisma.series.update({
        where: {
          id: input.id,
          authorId,
        },
        data: {
          title: input.title,
          description: input.description,
        },
      });
      return updatedSeries;
    }),
  deleteOwnSeries: writerProcedure
    .input(seriesInputGetDelete)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const deletedSeries = await ctx.prisma.series.delete({
        where: {
          id: input.id,
          authorId,
        },
      });
      return deletedSeries;
    }),
  updateOtherSeries: editorProcedure
    .input(seriesInputs)
    .mutation(async ({ ctx, input }) => {
      const updatedSeries = await ctx.prisma.series.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          authorId: input.authorId,
        },
      });
      return updatedSeries;
    }),
  deleteOtherSeries: editorProcedure
    .input(seriesInputDeleteOther)
    .mutation(async ({ ctx, input }) => {
      const deletedSeries = await ctx.prisma.series.delete({
        where: {
          id: input.id,
          authorId: input.authorId,
        },
      });
      return deletedSeries;
    }),
});
