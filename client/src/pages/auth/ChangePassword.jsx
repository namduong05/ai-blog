import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../schema";
import { useNavigate } from "react-router";
import authStore from "../../store/authStore";
import { toast } from "sonner";

const ChangePassword = () => {
  const navigate = useNavigate();

  const changePassword = authStore((state) => state.changePassword);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    const reqBody = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };

    try {
      const response = await changePassword(reqBody);
      toast.success(response?.message || "Password changed successfully.");
      reset({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      toast.error(error || "Password change failed.");
    }
  };
  return (
    <div className="w-3/4 mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trở lại
      </button>
      <button
        onClick={() => navigate("/profile")}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trang cá nhân
      </button>
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Đổi mật khẩu</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block my-2">Mật khẩu cũ:</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="**********"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="block my-2">Mật khẩu mới:</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="**********"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white px-4 py-2 cursor-pointer rounded w-full mt-3"
            disabled={loading}
          >
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
