import Category from "../models/Category.js";

const addCategory = async (req, res, next) => {
  try {
    const { title, desc } = req.validated.body;
    const id = req.user.id;

    // Check if exist title
    const existTitle = await Category.findOne({ title });
    if (existTitle) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Title already exist" });
    }

    const newCategory = new Category({ title, desc, updatedBy: id });
    await newCategory.save();

    res.status(201).json({
      code: 201,
      status: true,
      message: "Title created successfully",
      data: { newCategory },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const { title, desc } = req.validated.body;
    const userId = req.user.id;

    // Check if exist category
    const updatedCategory = await Category.findById(id);
    if (!updatedCategory) {
      return res
        .status(404)
        .json({ code: 404, status: false, message: "Category not found" });
    }

    // Check if exist title
    const existTitle = await Category.findOne({ title });
    if (existTitle && existTitle._id.toString() !== id) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Title already exist" });
    }

    // Update category
    updatedCategory.title = title;
    updatedCategory.desc = desc;
    updatedCategory.updatedBy = userId;
    await updatedCategory.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Category updated successfully",
      data: { updatedCategory },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const { q, size, page } = req.query;
    let query = {};

    const sizeNum = parseInt(size) || 10;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * sizeNum;

    if (q) {
      const search = new RegExp(q, "i");
      query = { $or: [{ title: search }, { desc: search }] };
    }

    const totalDocs = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / sizeNum);

    const categories = await Category.find(query)
      .populate("updatedBy", "-password -verificationCode -forgotPasswordCode")
      .skip(skip)
      .limit(sizeNum);
    res.status(200).json({
      code: 200,
      status: true,
      message: "Categories retrieved successfully",
      data: { categories, totalDocs, totalPages },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.validated.params;
    const category = await Category.findById(id).populate(
      "updatedBy",
      "-password -verificationCode -forgotPasswordCode",
    );
    if (!category) {
      return res.status(404).json({
        code: 404,
        status: false,
        message: "Category not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Category retrieved successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
};
