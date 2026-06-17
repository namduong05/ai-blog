import z from "zod";
import mongoose from "mongoose";
import { objectIdSchema } from "../utils/checkId.js";

const addCategorySchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string(),
  }),
});

const updateCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    title: z.string().min(1, "Title is required"),
    desc: z.string(),
  }),
});

const deleteCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

const getCategorySchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export {
  addCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  getCategorySchema,
};
