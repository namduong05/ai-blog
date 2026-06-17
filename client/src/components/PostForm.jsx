import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema } from "../schema";
import categoryStore from "../store/categoryStore";
import postStore from "../store/postStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const PostForm = ({ formData }) => {
  const loading = postStore((state) => state.loading);
  const error = postStore((state) => state.error);
  const categories = categoryStore((state) => state.categories);
  const getAllCategories = categoryStore((state) => state.getAllCategories);

  const createPost = postStore((state) => state.createPost);
  const updatePost = postStore((state) => state.updatePost);

  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      desc: "",
      file: null,
      category: "",
    },
  });

  const file = watch("file");

  console.log(formData);

  useEffect(() => {
    if (formData) {
      reset({
        title: formData.title,
        desc: formData.desc || "",
        category: formData.category._id,
      });
    }
  }, [formData, reset]);

  const onSubmit = async (data) => {
    if (formData) {
      try {
        const response = await updatePost(
          formData._id,
          data,
          formData.file?._id,
          formData.file?.imageId,
        );
        toast.success(response?.message || "Cập nhật bài viết thành công!");
        navigate(`/my-posts/${formData._id}`);
      } catch (err) {
        toast.error(error || "Có lỗi khi cập nhật bài viết!");
      }
    } else {
      try {
        const response = await createPost(data);
        toast.success(response?.message || "Đăng bài thành công!");
        navigate("/my-posts");
      } catch (err) {
        toast.error(error || "Có lỗi khi đăng bài!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white outline-[#884413]"
          placeholder="Nhập tiêu đề bài viết của bạn..."
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          {...register("file")}
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white outline-[#884413]"
        />
        {file && file.length > 0 && (
          <button
            type="button"
            onClick={() => reset({ file: null })}
            className="bg-red-500 hover:bg-red-600 text-white mt-2 border border-red-500 p-1 rounded-sm cursor-pointer"
          >
            Xóa tệp
          </button>
        )}
        {errors.file && (
          <p className="text-red-500 text-sm mt-1">{errors.file.message}</p>
        )}
      </div>
      <div className="mt-4">
        <select
          name="category"
          {...register("category")}
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white outline-[#884413]"
        >
          <option value="">-- Chọn mục --</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.title}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
        )}
      </div>

      <div className="mt-4">
        <textarea
          {...register("desc")}
          placeholder="Viết điều gì đó..."
          className="border border-gray-300 rounded px-3 py-2 w-full bg-white outline-[#884413]"
        />
        {errors.desc && (
          <p className="text-red-500 text-sm mt-1">{errors.desc.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-[#884413] text-white rounded-xl p-2 mt-2 w-full hover:opacity-85 cursor-pointer"
        disabled={loading}
      >
        {loading
          ? formData
            ? "Đang cập nhật bài viết..."
            : "Đang đăng bài..."
          : formData
            ? "Cập nhật bài viết"
            : "Đăng bài"}
      </button>
    </form>
  );
};

export default PostForm;
