import {
  postInputDraftDelete,
  postInputGetOne,
} from "~/server/utils/zodSchemas";
import {
  createTRPCRouter,
  editorProcedure,
  publicProcedure,
  writerProcedure,
  protectedProcedure,
} from "../trpc";

/*
READ ALL POSTS
READ OWN POSTS
DELETE POST AND DRAFT
DELETE POSTS KEEP DRAFTS
Delete own/other
*/

export const postRouter = createTRPCRouter({
  //Get all Posts
  getPostFeed: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      select: {
        id: true,
        title: true,
        metaDescription: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            User: {
              select: {
                name: true,
              },
            },
          },
        },
        series: {
          select: {
            id: true,
            title: true,
          },
        },
        seriesPostOrder: true,
        categories: {
          select: {
            id: true,
            title: true,
          },
        },
        tags: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    return posts;
  }),

  //Get Post
  getPost: publicProcedure
    .input(postInputGetOne)
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      return post;
    }),
  //Get own Posts
  getOwnPosts: writerProcedure.query(async ({ ctx }) => {
    const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
      where: {
        id: ctx.session.user.id,
      },
    });
    const posts = await ctx.prisma.post.findMany({
      where: {
        authorId,
      },
    });
    return posts;
  }),
  //Favorite Post
  favoritePost: protectedProcedure
    .input(postInputGetOne)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favoritePosts: {
            connect: {
              id: input.id,
            },
          },
        },
      });
      const success = user ? 1 : 0;
      return success;
    }),
  //Unfavorite Post
  unfavoritePost: protectedProcedure
    .input(postInputGetOne)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          favoritePosts: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });
      const success = user ? 1 : 0;
      return success;
    }),
  //Delete Post
  deletePost: editorProcedure
    .input(postInputGetOne)
    .mutation(async ({ ctx, input }) => {
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
      return deletedPost;
    }),
  //Delete Post and Draft
  deletePostAndDraft: editorProcedure
    .input(postInputDraftDelete)
    .mutation(async ({ ctx, input }) => {
      const deletedPost = await ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
      const deletedDraft = await ctx.prisma.draft.delete({
        where: {
          id: input.draftId,
        },
      });
      return {
        deletedPost,
        deletedDraft,
      };
    }),
});
