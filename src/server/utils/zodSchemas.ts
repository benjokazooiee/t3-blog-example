import { z } from "zod";
/*
 * DRAFT INPUTS *
 */

const draftInputs = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  metaDescription: z.string(),
  createdAt: z.date().optional(), //
  updatedAt: z.date().optional(), //
  submitted: z.boolean(), //
  submittedAt: z.date().optional(), //
  published: z.boolean(), //
  publishedAt: z.date().optional(), //
  postId: z.string().optional(), //
  authorId: z.string(), //
  seriesId: z.string(),
  seriesPostOrder: z.number().optional(),
  images: z.array(z.object({ id: z.string() })).optional(),
  categories: z.array(z.object({ id: z.string() })).optional(),
  tags: z.array(z.object({ id: z.string() })).optional(),
});

// GET OR DELETE DRAFT

export const draftInputGetDelete = draftInputs.pick({ id: true });

// CREATE DRAFT
export const draftInputCreate = draftInputs.pick({
  title: true,
  id: true,
});
// UPDATE DRAFT

export const draftInputUpdate = draftInputs.omit({
  createdAt: true,
  updatedAt: true,
  submitted: true,
  submittedAt: true,
  published: true,
  publishedAt: true,
  postId: true,
  authorId: true,
});

// SUBMIT DRAFT

export const draftInputSubmit = draftInputs.pick({
  id: true,
});

// Publish Draft
export const draftInputPublish = draftInputs.omit({
  createdAt: true,
  updatedAt: true,
  submitted: true,
  submittedAt: true,
  published: true,
  publishedAt: true,
  postId: true,
});

/*
 * POST INPUTS *
 */

export const postInputs = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  metaDescription: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  seriesPostOrder: z.number().optional(),
  authorId: z.string(),
  seriesId: z.string().optional(),
  draftId: z.string(),
});

//Get, Delete, Favorite, Unfavorite Post
export const postInputGetOne = postInputs.pick({ id: true });

//Delete Post and Draft
export const postInputDraftDelete = postInputs.pick({
  id: true,
  draftId: true,
});

/*
 * IMAGE INPUTS *
 */
export const imageInputs = z.object({
  fileType: z.string(),
  alt: z.string(),
  file: z.custom<File>(),
  title: z.string(),
  imageId: z.string().optional(),
});

export const imageUpdateDeleteInput = z.object({
  fileType: z.string(),
  alt: z.string(),
  file: z.custom<File>(),
  title: z.string(),
  imageId: z.string(),
});

export const getPresignedImagePostInput = imageInputs.pick({
  fileType: true,
  imageId: true,
});
export const imageCreateInput = imageInputs.omit({
  authorId: true,
  file: true,
});

export const imageGetInput = z.object({
  id: z.string(),
  authorId: z.string(),
  fileType: z.string(),
});

export const imageFileUploadInput = z.object({
  url: z.string(),
  fields: z.record(z.string()),
  imageFile: z.custom<File>(),
});

/*
 * CATEGORY INPUTS *
 */
export const categoryInputs = z.object({
  title: z.string(),
  parentId: z.string().optional(),
  id: z.string(),
});
export const getDeleteCategoryInput = categoryInputs.pick({ id: true });
export const deleteManyCategoriesInput = z.array(z.string());
export const createCategoryInput = categoryInputs.omit({ id: true });

/*
 * SERIES INPUTS *
 */

export const seriesInputs = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  authorId: z.string(),
});

export const seriesInputGetDelete = seriesInputs.pick({ id: true });

export const seriesInputDeleteOther = seriesInputs.pick({
  id: true,
  authorId: true,
});

export const seriesInputCreate = seriesInputs.pick({
  title: true,
  description: true,
});

export const seriesInputUpdate = seriesInputs.omit({ authorId: true });

/*
 * TAG INPUTS *
 */
export const updateTagInput = z.object({
  id: z.string(),
  title: z.string(),
});
export const getdeleteTagInput = updateTagInput.pick({ id: true });
export const createTagInput = updateTagInput.pick({ title: true });
