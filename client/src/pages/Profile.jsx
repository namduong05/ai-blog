import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../schema";
import { useNavigate } from "react-router";
import authStore from "../store/authStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();

  const user = authStore((state) => state.user);
  const signOut = authStore((state) => state.signOut);
  const changeProfile = authStore((state) => state.changeProfile);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset({
      name: user.name || "",
      email: user.email || "",
    });
  }, [reset, user]);

  const onSubmit = async (data) => {
    const reqBody = {
      name: data.name,
      email: data.email,
      profilePic: user.file?._id,
    };

    try {
      const response = await changeProfile(reqBody);
      toast.success(response?.message || "Information changed successfully!");
      if (user.email !== data.email) {
        toast.info("The email address has been changed, please log in again.");
        signOut();
      }
    } catch (err) {
      toast.error(error || "Error when changing information");
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
      {!user.isVerified && (
        <button
          onClick={() => navigate("/verify-user")}
          className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
        >
          Xác minh người dùng
        </button>
      )}
      <button
        onClick={() => navigate("/settings")}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Đổi mật khẩu
      </button>
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">Trang cá nhân</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block my-2">Tên</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="VD: Nam"
              {...register("name")}
              disabled={user.role === 1}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block my-2">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              placeholder="VD: email@example.com"
              {...register("email")}
              disabled={user.role === 1}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white px-4 py-2 cursor-pointer rounded w-full mt-3"
            disabled={loading || user.role === 1}
          >
            {loading ? "Đang cập nhật thông tin..." : "Cập nhật"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
