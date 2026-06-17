import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "../schema";
import authStore from "../store/authStore";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const SignUp = () => {
  const signUp = authStore((state) => state.signUp);
  const loading = authStore((state) => state.loading);
  const error = authStore((state) => state.error);
  const user = authStore((state) => state.user);
  const navigate = useNavigate();

  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SignUpSchema) });

  const onSubmit = async (data) => {
    const reqBody = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await signUp(reqBody);
      toast.success(response.message);
      navigate("/signin");
    } catch (err) {
      toast.error(error || "Sign up failed");
    }
  };

  return (
    <div className="w-2/3 md:w-1/2 mx-auto h-screen flex flex-col items-center justify-center">
      <div className="border border-gray-500 rounded-xl px-8 py-4 w-full">
        <h1 className="text-3xl text-[#884413] font-bold mb-4 text-center border-b border-gray-300 pb-2">
          Đăng ký
        </h1>
        <form className="min-w-2/3" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block my-2">Tên</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="VD: Nam"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
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
          <div>
            <label className="block my-2">Nhập lại mật khẩu</label>
            <input
              type="password"
              className="border border-gray-300 rounded px-3 py-2 w-full outline-[#884413]"
              placeholder="***********"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#884413] hover:opacity-85 text-white px-4 py-2 cursor-pointer rounded w-full mt-3"
            disabled={loading}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <div className="mt-4 text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/signin" className="text-[#884413]">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
