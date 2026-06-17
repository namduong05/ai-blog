import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema, SignInSchema } from "../schema";
import authStore from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const SignIn = () => {
  const signIn = authStore((state) => state.signIn);
  const user = authStore((state) => state.user);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);
  const navigate = useNavigate();

  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignInSchema) });

  const onSubmit = async (data) => {
    const reqBody = {
      email: data.email,
      password: data.password,
    };

    try {
      const response = await signIn(reqBody);
      toast.success(response?.message || "Sign in success!");
      navigate("/");
    } catch (err) {
      toast.error(error || "Sign in failed!!");
    }
  };

  return (
    <div className="w-2/3 md:w-1/2 mx-auto h-screen flex flex-col items-center justify-center">
      <div className="border border-gray-500 rounded-xl px-8 py-4 w-full">
        <h1 className="text-3xl text-[#884413] font-bold mb-4 text-center border-b border-gray-300 pb-2">
          Đăng nhập
        </h1>
        <form className="min-w-2/3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block my-2">Email</label>
            <input
              type="email"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="VD: email@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label className="block my-2">Mật khẩu</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="***********"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Link to="/forgot-password" className="text-[#884413]">
            Quên mật khẩu?
          </Link>

          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white px-4 py-2 cursor-pointer rounded w-full mt-3"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-4 text-center">
          Bạn chưa có tài khoản?{" "}
          <Link to="/signup" className="text-[#884413]">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
