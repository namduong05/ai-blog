import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendCodeSchema, resetWithCodeSchema } from "../../schema";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import authStore from "../../store/authStore";

const ForgotPassword = () => {
  const [emailInput, setEmailInput] = useState("");
  const sendResetCode = authStore((state) => state.sendResetCode);
  const resetPassword = authStore((state) => state.resetPassword);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);
  const navigate = useNavigate();

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  const emailForm = useForm({
    resolver: zodResolver(sendCodeSchema),
  });

  const resetForm = useForm({
    resolver: zodResolver(resetWithCodeSchema),
  });

  const onSendCodeSubmit = async (data) => {
    try {
      await sendResetCode(data);
      toast.success("The OTP code has been sent.!");
      setSavedEmail(data.email);
      setIsCodeSent(true);
    } catch (err) {
      toast.error(error || "Sending code failed!!!");
    }
  };

  const onResetSubmit = async (data) => {
    const payload = {
      email: savedEmail,
      code: data.code,
      newPassword: data.newPassword,
    };

    try {
      await resetPassword(payload);
      toast.success("Password changed successfully.!");
      navigate("/signin");
    } catch (err) {
      toast.error(error || "Incorrect or expired OTP code!");
    }
  };

  return (
    <div className="w-1/2 mx-auto mt-8">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300  rounded-xl p-2 m-2 hover:bg-gray-400 cursor-pointer"
      >
        Trở lại
      </button>
      <h2 className="text-2xl font-bold text-center mb-6">Quên mật khẩu</h2>

      {/* GIAI ĐOẠN 1: NHẬP EMAIL */}
      {!isCodeSent ? (
        <form onSubmit={emailForm.handleSubmit(onSendCodeSubmit)}>
          <div>
            <label className="block mb-1 font-medium">
              Điền email của bạn:
            </label>
            <input
              type="email"
              className="border p-2 w-full rounded outline-[#884413]"
              {...emailForm.register("email")}
            />
            {emailForm.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {emailForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white p-2 rounded w-full mt-4"
          >
            {loading ? "Đang gửi mã OTP cho bạn..." : "Gửi mã OTP"}
          </button>
        </form>
      ) : (
        // GIAI ĐOẠN 2: NHẬP CODE & PASS (ẨN HOÀN TOÀN INPUT EMAIL)
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)}>
          <p className="text-green-600 mb-4 text-sm">
            Mã OTP dã được gửi tới địa chỉ email: <strong>{savedEmail}</strong>
          </p>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Mã OTP</label>
            <input
              type="text"
              className="border p-2 w-full rounded outline-[#884413]"
              {...resetForm.register("code")}
            />
            {resetForm.formState.errors.code && (
              <p className="text-red-500 text-sm mt-1">
                {resetForm.formState.errors.code.message}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-medium">Mật khẩu mới</label>
            <input
              type="password"
              className="border p-2 w-full rounded outline-[#884413]"
              {...resetForm.register("newPassword")}
            />
            {resetForm.formState.errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white p-2 rounded w-full mt-4"
          >
            {loading ? "Đang đổi mật khẩu..." : "Xác nhận thay đổi mật khẩu"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
