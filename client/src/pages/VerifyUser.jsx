import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyUserSchema } from "../schema";
import { useNavigate } from "react-router";
import authStore from "../store/authStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const VerifyUser = () => {
  const navigate = useNavigate();

  const [loadingSendCode, setLoadingSendCode] = useState(0);

  const user = authStore((state) => state.user);
  const sendCode = authStore((state) => state.sendCode);
  const verifyUser = authStore((state) => state.verifyUser);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyUserSchema),
  });

  const onSubmit = async (data) => {
    const reqBody = {
      email: user?.email,
      code: data?.code,
    };

    try {
      const response = await verifyUser(reqBody);
      toast.success(response?.message || "Verify success!");
      navigate("/");
    } catch (err) {
      toast.error(error || "Verify failed!!!");
    }
  };

  useEffect(() => {
    if (loadingSendCode === 0) return;

    const idTime = setTimeout(() => {
      setLoadingSendCode((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(idTime);
  }, [loadingSendCode]);

  const handleSendCode = async () => {
    if (!user?.email) {
      toast.error("Không tìm thấy thông tin email người dùng!");
      return;
    }

    setLoadingSendCode(60);
    const reqBody = {
      email: user?.email,
    };
    try {
      const response = await sendCode(reqBody);
      toast.success(
        response?.message || "The code has been successfully sent!",
      );
    } catch (err) {
      toast.error(error || "The code delivery failed!!!");
      setLoadingSendCode(0);
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
        onClick={handleSendCode}
        disabled={loadingSendCode !== 0}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        {`Gửi mã${loadingSendCode === 0 ? "" : ` (${loadingSendCode}s)`}`}
      </button>
      <div className="w-1/2 mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Xác minh người dùng
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block my-2">Code:</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              {...register("code")}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white px-4 py-2 cursor-pointer rounded w-full mt-3"
            disabled={loading}
          >
            {loading ? "Đang xác minh..." : "Xác minh"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;
