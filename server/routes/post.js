import express from "express";
import * as postControllers from "../controllers/post.js";
import isAuth from "../middlewares/isAuth.js";
import validate from "../middlewares/validation.js";
import {
  addPostValidator,
  updatePostValidator,
  idPostValidator,
} from "../validators/post.js";

const router = express.Router();

router.post("/", isAuth, validate(addPostValidator), postControllers.addPost);

router.put(
  "/:id",
  isAuth,
  validate(updatePostValidator),
  postControllers.updatePost,
);

router.delete(
  "/:id",
  isAuth,
  validate(idPostValidator),
  postControllers.deletePost,
);

router.get("/", isAuth, postControllers.getPosts);

router.get("/my-posts", isAuth, postControllers.getMyPosts);

router.get(
  "/:id",
  isAuth,
  validate(idPostValidator),
  postControllers.getPostById,
);

export default router;
