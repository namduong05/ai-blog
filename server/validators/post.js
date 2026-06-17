import z, { boolean } from "zod";
import { objectIdSchema } from "../utils/checkId.js";

const addPostValidator = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string().optional(),
    file: objectIdSchema.optional(),
    category: objectIdSchema,
  }),
});

const updatePostValidator = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string().optional(),
    file: objectIdSchema.optional(),
    category: objectIdSchema.optional(),
  }),
  params: z.object({
    id: objectIdSchema,
  }),
});

const idPostValidator = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export { addPostValidator, updatePostValidator, idPostValidator };
