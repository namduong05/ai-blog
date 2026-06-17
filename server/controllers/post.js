import Post from "../models/Post.js";
import File from "../models/File.js";
import Category from "../models/Category.js";

const addPost = async (req, res, next) => {
  try {
    const { title, desc, file, category } = req.validated.body;
    const userId = req.user.id;

    if (file) {
      const existFile = await File.findById(file);
      if (!existFile) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "File not found",
        });
      }
    }

    if (category) {
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Category not found",
        });
      }
    }

    const newPost = new Post({
      title,
      desc,
      file,
      category,
      updatedBy: userId,
    });

    await newPost.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Post created successfully",
      data: { newPost },
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { title, desc, file, category } = req.validated.body;
    const userId = req.user.id;

    if (file) {
      const existFile = await File.findById(file);
      if (!existFile) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "File not found",
        });
      }
    }

    if (category) {
      const existCategory = await Category.findById(category);
      if (!existCategory) {
        return res.status(400).json({
          code: 400,
          status: false,
          message: "Category not found",
        });
      }
    }

    const updatedPost = await Post.findById(id);
    if (!updatedPost) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Post not found",
      });
    }

    if (userId !== updatedPost.updatedBy.toString()) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Permission denied!",
      });
    }

    updatedPost.title = title ? title : updatedPost.title;
    updatedPost.desc = desc ? desc : updatedPost.desc;
    updatedPost.file = file ? file : updatedPost.file;
    updatedPost.category = category ? category : updatedPost.category;
    await updatedPost.save();

    res.status(200).json({
      code: 200,
      status: true,
      message: "Post updated successfully",
      data: { updatedPost },
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const userId = req.user.id;
    const role = req.user.role;
    const deletedPost = await Post.findById(id).populate("file");
    if (!deletedPost) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Post not found",
      });
    }

    if (userId !== deletedPost.updatedBy.toString() && role !== 1) {
      return res.status(403).json({
        code: 403,
        status: false,
        message: "Permission denied!",
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Post deleted successfully",
      data: { deletedPost },
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const { q, size, page, category } = req.query;
    let query = {};

    const sizeParsed = parseInt(size, 10);
    const pageParsed = parseInt(page, 10);

    const sizeNum = sizeParsed > 0 ? sizeParsed : 10;
    const pageNum = pageParsed > 0 ? pageParsed : 1;
    const skip = (pageNum - 1) * sizeNum;

    if (q) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const search = new RegExp(escapeRegex(q), "i");
      query.$or = [{ title: search }];
    }
    if (category) {
      query.category = category;
    }

    const [totalDocs, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .populate(
          "updatedBy",
          "-password -verificationCode -forgotPasswordCode",
        )
        .populate("file")
        .populate("category")
        .skip(skip)
        .limit(sizeNum)
        .sort({ updatedAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalDocs / sizeNum);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Posts retrieved successfully",
      data: { posts, totalDocs, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

const getMyPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { q, size, page, category } = req.query;
    let query = { updatedBy: userId };

    const sizeParsed = parseInt(size, 10);
    const pageParsed = parseInt(page, 10);

    const sizeNum = sizeParsed > 0 ? sizeParsed : 10;
    const pageNum = pageParsed > 0 ? pageParsed : 1;
    const skip = (pageNum - 1) * sizeNum;

    if (q) {
      const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const search = new RegExp(escapeRegex(q), "i");
      query.$or = [{ title: search }];
    }
    if (category) {
      query.category = category;
    }

    const [totalDocs, posts] = await Promise.all([
      Post.countDocuments(query),
      Post.find(query)
        .populate("file")
        .populate("category")
        .skip(skip)
        .limit(sizeNum)
        .sort({ updatedAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalDocs / sizeNum);

    res.status(200).json({
      code: 200,
      status: true,
      message: "Posts retrieved successfully",
      data: { posts, totalDocs, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const post = await Post.findById(id)
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode")
      .populate("file")
      .populate("category");
    if (!post) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Post not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Post retrieved successfully",
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

export { addPost, updatePost, deletePost, getPosts, getMyPosts, getPostById };
