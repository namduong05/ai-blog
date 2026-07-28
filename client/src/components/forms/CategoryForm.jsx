import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../schema";
import categoryStore from "../../store/categoryStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useEffect } from "react";

const CategoryForm = ({ formData }) => {
  const createCategory = categoryStore((state) => state.createCategory);
  const updateCategory = categoryStore((state) => state.updateCategory);
  const loading = categoryStore((state) => state.loading);
  const error = categoryStore((state) => state.error);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      desc: "",
    },
  });

  useEffect(() => {
    if (formData) {
      reset({
        title: formData.title,
        desc: formData.desc,
      });
    }
  }, [formData]);

  const onSubmit = async (data) => {
    const reqBody = {
      title: data.title,
      desc: data.desc,
    };

    if (formData) {
      try {
        const response = await updateCategory(formData._id, reqBody);
        toast.success(response?.message || "Cập nhật thể loại thành công!");
        navigate("/categories");
      } catch (err) {
        toast.error(error || "Có lỗi khi cập nhật thể loại!");
      }
    } else {
      try {
        const response = await createCategory(reqBody);
        toast.success(response?.message || "Thêm thể loại thành công!");
        navigate("/categories");
      } catch (err) {
        toast.error(error || "Có lỗi khi thêm thể loại!");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block my-2">Tiêu đề</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413] bg-white"
          placeholder="VD: Technology"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block my-2">Mô tả:</label>
        <textarea
          {...register("desc")}
          placeholder="Description"
          className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413] bg-white"
        />
        {errors.desc && (
          <p className="text-red-500 text-sm mt-1">{errors.desc.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="bg-[#884413] hover:opacity-85 text-white rounded-xl p-2 mt-2 w-full cursor-pointer"
        disabled={loading}
      >
        {loading
          ? formData
            ? "Đang cập nhật..."
            : "Đang thêm..."
          : formData
            ? "Cập nhật"
            : "Thêm"}
      </button>
    </form>
  );
};

export default CategoryForm;
