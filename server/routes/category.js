import express from "express";
import * as categoryControllers from "../controllers/category.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import validate from "../middlewares/validation.js";
import {
  addCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
  getCategorySchema,
} from "../validators/category.js";

const router = express.Router();

router.post(
  "/",
  validate(addCategorySchema),
  isAuth,
  isAdmin,
  categoryControllers.addCategory,
);

router.put(
  "/:id",
  validate(updateCategorySchema),
  isAuth,
  isAdmin,
  categoryControllers.updateCategory,
);

router.delete(
  "/:id",
  validate(deleteCategorySchema),
  isAuth,
  isAdmin,
  categoryControllers.deleteCategory,
);

router.get("/", isAuth, categoryControllers.getCategories);

router.get(
  "/:id",
  validate(getCategorySchema),
  isAuth,
  categoryControllers.getCategoryById,
);

export default router;
