import {
  draftInputCreate,
  draftInputGetDelete,
  draftInputPublish,
  draftInputSubmit,
  draftInputUpdate,
} from "~/server/utils/zodSchemas";
import { createTRPCRouter, editorProcedure, writerProcedure } from "../trpc";


/*
GET ALL OWN DRAFTS
GET OWN DRAFT
GET SUBMITTED DRAFTS
GET OTHERS DRAFT
UPDATE OWN DRAFT
SUBMIT DRAFT
DELETE DRAFT AND POST
*/

export const draftRouter = createTRPCRouter({
  getAllOwnDrafts: writerProcedure.query(async ({ ctx }) => {
    const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
    });
    const drafts = await ctx.prisma.draft.findMany({
      where: {
        authorId,
      },
    });
    return drafts;
  }),
  getOwnDraft: writerProcedure
    .input(draftInputGetDelete)
    .query(async ({ ctx, input }) => {
      const draft = await ctx.prisma.draft.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        select: {
          id: true,
        title: true,
        content: true,
        metaDescription: true,
        createdAt: true,
        updatedAt: true,
        authorId: true,
        seriesPostOrder: true,
          series: {
            select: {
              id: true,
              title: true,
            }
          },
          images: true,
          categories: true,
          tags: true,
        }
      });
      if(!!draft.series) {
        const seriesDrafts = await ctx.prisma.series.findUniqueOrThrow({
          where: {
            id: draft.series.id
          },
          include: {
            _count: {
              select: {
                drafts: true,
              }
            }
          }
        })
        const seriesCount = seriesDrafts._count.drafts
        const draftWithSeries = {
          seriesCount,
          ...draft
        }
        return draftWithSeries
      }
      const seriesCount = 0;
      const draftWithoutSeries = {
        seriesCount,
        ...draft
      }
      return draftWithoutSeries;
    }),
  getSubmittedDrafts: editorProcedure.query(async ({ ctx }) => {
    const drafts = await ctx.prisma.draft.findMany({
      where: {
        submitted: true,
      },
    });
    return drafts;
  }),
  getOtherDraft: editorProcedure
    .input(draftInputGetDelete)
    .query(async ({ ctx, input }) => {
      const draft = await ctx.prisma.draft.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return draft;
    }),
  createDraft: writerProcedure
    .input(draftInputCreate)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
      });
      const newDraftInfo = {
        id: input.id,
        title: input.title,
        content: "",
        metaDescription: "",
        submitted: false,
        published: false,
        authorId,
      };
      const newDraft = await ctx.prisma.draft.create({
        data: {
          ...newDraftInfo,
        },
      });
      return newDraft;
    }),
  updateOwnDraft: writerProcedure
    .input(draftInputUpdate)
    .mutation(async ({ ctx, input }) => {
      const updatedDraft = await ctx.prisma.draft.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          content: input.content,
          metaDescription: input.metaDescription,
          series: {
            connect: {
              id: input.seriesId,
            },
          },
          seriesPostOrder: input.seriesPostOrder,
          images: {
            connect: input.images,
          },
          categories: {
            connect: input.categories,
          },
          tags: {
            connect: input.tags,
          },
        },
      });
      return updatedDraft;
    }),
  submitDraft: writerProcedure
    .input(draftInputSubmit)
    .mutation(async ({ ctx, input }) => {
      const submittedDraft = await ctx.prisma.draft.update({
        where: {
          id: input.id,
        },
        data: {
          submitted: true,
        },
      });
      return submittedDraft;
    }),
  publishDraftToPost: editorProcedure
    .input(draftInputPublish)
    .mutation(async ({ ctx, input }) => {
      const date = new Date(Date.now());
      const newPostAction = ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          metaDescription: input.metaDescription,
          seriesPostOrder: input.seriesPostOrder,
          author: {
            connect: {
              id: input.authorId,
            },
          },
          draft: {
            connect: {
              id: input.id,
            },
          },
          series: {
            connect: {
              id: input.seriesId,
            },
          },
          images: {
            connect: input.images,
          },
        },
      });
      const updateDraftAction = ctx.prisma.draft.update({
        where: {
          id: input.id,
        },
        data: {
          submitted: false,
          submittedAt: undefined,
          published: true,
          publishedAt: date,
        },
      });
      const [newPost, updatedDraft] = await ctx.prisma.$transaction([
        newPostAction,
        updateDraftAction,
      ]);
      return {
        newPost,
        updatedDraft,
      };
    }),
  deleteDraftAndPost: editorProcedure
    .input(draftInputGetDelete)
    .mutation(async ({ ctx, input }) => {
      const deletedDraft = await ctx.prisma.draft.delete({
        where: {
          id: input.id,
        },
      });
      const postToDelete = await ctx.prisma.post.findUnique({
        where: { draftId: input.id },
      });
      if (!!postToDelete) {
        const deletedPost = await ctx.prisma.post.delete({
          where: { draftId: input.id },
        });
        return {
          deletedDraft,
          deletedPost,
        };
      }
      return deletedDraft;
    }),
});
