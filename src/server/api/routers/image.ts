import { randomUUID } from "crypto";
import {
  createTRPCRouter,
  publicProcedure,
  writerProcedure,
} from "~/server/api/trpc";
import { gets3ImageKey, s3Client } from "~/server/utils/awsHelpers";
import {
  getPresignedImagePostInput,
  imageCreateInput,
  imageGetInput,
  imageUpdateDeleteInput,
} from "~/server/utils/zodSchemas";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "../../../env.mjs";
import { TRPCError } from "@trpc/server";
import {
  GetObjectCommand,
  type PutObjectCommandInput,
  type GetObjectCommandInput,
  PutObjectCommand,
  type DeleteObjectCommandInput,
  DeleteObjectCommand,
  type ListObjectsCommandInput,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";

/*
* TODO - ADD IMAGE PROCEDURES AND PAGES FOR EDITORS *
*/

export const imageRouter = createTRPCRouter({
  getImage: publicProcedure
    //endpoint: image.getImage
    .input(imageGetInput)
    .query(async ({ ctx, input }) => {
      const imageKey = gets3ImageKey({
        authorId: input.authorId,
        imageId: input.id,
        fileType: input.fileType,
      });
      const getImmageCommandInput: GetObjectCommandInput = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: imageKey,
      };
      const getImageCommand = new GetObjectCommand(getImmageCommandInput);
      const getDbImage = ctx.prisma.image.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });
      const gets3Image = s3Client.send(getImageCommand);
      const result = await Promise.all([getDbImage, gets3Image]);
      if (!result) {
        throw new TRPCError({
          message: "Transaction Failed",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      return result;
    }),
  getManyImages: publicProcedure.query(async ({ ctx }) => {
    const getImagesCommandInput: ListObjectsCommandInput = {
      Bucket: env.AWS_BUCKET_NAME,
    };
    const getImagesCommand = new ListObjectsCommand(getImagesCommandInput);
    const s3images = await s3Client.send(getImagesCommand);
    if (s3images.$metadata.httpStatusCode !== 200) {
      throw new TRPCError({ code: "PRECONDITION_FAILED" });
    }
    const prismaImages = await ctx.prisma.image.findMany();
    return {
      s3images,
      prismaImages,
    };
  }),
  getPresignedPost: writerProcedure
    .input(getPresignedImagePostInput)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
      const imgId = input.imageId ? input.imageId : randomUUID();
      const imageKey = gets3ImageKey({
        authorId,
        imageId: imgId,
        fileType: input.fileType,
      });
      const presignedPost = await createPresignedPost(s3Client, {
        Bucket: env.AWS_BUCKET_NAME,
        Key: imageKey,
      });
      return presignedPost;
    }),
  createImage: writerProcedure
    .input(imageCreateInput)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
      const imageId = input.imageId ? input.imageId : randomUUID();
      const newImage = await ctx.prisma.image.create({
        data: {
          id: imageId,
          alt: input.alt,
          authorId: authorId,
          fileType: input.fileType,
          title: input.title,
        },
      });
      return newImage;
    }),
  updateImage: writerProcedure
    .input(imageUpdateDeleteInput)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
      const imageKey = gets3ImageKey({
        authorId: authorId,
        imageId: input.imageId,
        fileType: input.fileType,
      });
      const putObjectCommandInput: PutObjectCommandInput = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: imageKey,
        Body: input.file,
      };
      const putObjectCommand = new PutObjectCommand(putObjectCommandInput);
      const putResult = await s3Client.send(putObjectCommand);
      if (!putResult) {
        throw new TRPCError({ code: "PRECONDITION_FAILED" });
      }
      const dbResult = await ctx.prisma.image.update({
        where: {
          id: input.imageId,
        },
        data: {
          title: input.title,
          fileType: input.fileType,
          alt: input.alt,
        },
      });

      return dbResult;
    }),
  deleteImage: writerProcedure
    .input(imageUpdateDeleteInput)
    .mutation(async ({ ctx, input }) => {
      const { id: authorId } = await ctx.prisma.author.findUniqueOrThrow({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
        },
      });
      const imageKey = gets3ImageKey({
        authorId: authorId,
        imageId: input.imageId,
        fileType: input.fileType,
      });
      const deleteObjectCommandInput: DeleteObjectCommandInput = {
        Bucket: env.AWS_BUCKET_NAME,
        Key: imageKey,
      };
      const deleteObjectCommand = new DeleteObjectCommand(
        deleteObjectCommandInput
      );
      const deleteResult = await s3Client.send(deleteObjectCommand);
      if (deleteResult.$metadata.httpStatusCode === 200) {
        throw new TRPCError({ code: "PRECONDITION_FAILED" });
      }
      const dbResult = await ctx.prisma.image.delete({
        where: {
          id: input.imageId,
        },
      });

      return dbResult;
    }),
});