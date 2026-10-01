import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { login, loginWithGoogle } from "~/services/authService";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "~/contexts/AuthProvider";
import { getProfile } from "~/services/userService";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";

const schema = yup.object().shape({
  // Tên field vẫn là `phone` vì API /auth/login đọc req.body.phone, nhưng giờ chỉ nhận email
  phone: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const onSubmit = async ({ phone, password }) => {
    try {
      const data = await login(phone, password);
      const profile = await getProfile();
      setUser(profile);
      toast.success("Đăng nhập thành công!");

      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      sessionStorage.removeItem("redirectAfterLogin");

      if (redirectPath && !redirectPath.startsWith("/login")) {
        navigate(redirectPath);
        return;
      }

      switch (profile.role) {
        case "admin":
          navigate("/admin");
          break;
        case "pt":
          navigate("/pt");
          break;
        case "student":
          navigate("/home");
          break;
        default:
          navigate("/home");
          break;
      }
    } catch (err) {
      // getProfile (/auth/me) là URL im lặng của interceptor nên vẫn toast ở đây; toastId trùng câu → không hiện 2 lần
      const message = err?.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message, { toastId: message });
    }
  };

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const data = await loginWithGoogle(idToken);
      setUser(data.user);
      toast.success("Đăng nhập Google thành công!");
      switch (data.user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "pt":
          navigate("/pt");
          break;
        case "student":
          navigate("/");
          break;
        default:
          break;
      }
    } catch {
      // axiosClient interceptor đã hiện toast lỗi, không toast lại ở đây
    }
  };

  const handleError = () => toast.error("Login Failed");

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-wide text-[#ff4d00]"
        >
          FITLINK
        </Link>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-[#1a1a1a]">
          {/* Left image section */}
          <div className="relative hidden md:block bg-[#111]">
            <img
              src="/poster.jpg"
              alt="Gym"
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="relative h-full w-full flex flex-col justify-end p-10 bg-gradient-to-t from-black/70 to-transparent">
              <h1 className="text-4xl font-bold text-white leading-tight">
                Make Your <span className="text-[#ff4d00]">Body Shape</span>
              </h1>
              <p className="mt-3 text-gray-300 max-w-md">
                Join our fitness community and achieve your goals with
                professional trainers and custom programs.
              </p>
              <Link
                to="/register"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#ff4d00] px-6 py-3 font-semibold text-white hover:bg-[#ff661a] transition"
              >
                Join Now
              </Link>
            </div>
          </div>

          {/* Right form section */}
          <div className="bg-[#1a1a1a] p-8 md:p-12">
            <h2 className="text-3xl font-bold text-[#ff4d00]">Sign In</h2>
            <p className="mt-2 text-sm text-gray-400">
              Welcome back! Please enter your details below.
            </p>

            <form
              className="mt-8 flex flex-col space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="user@fitlink.vn"
                  {...register("phone")}
                  className="w-full rounded-lg border border-[#333] bg-[#0e0e0e] px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff4d00] outline-none"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••"
                  {...register("password")}
                  className="w-full rounded-lg border border-[#333] bg-[#0e0e0e] px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#ff4d00] outline-none"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-500 bg-transparent"
                  />
                  Remember me
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[#ff4d00] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#ff4d00] py-3 font-semibold text-white hover:bg-[#ff661a] transition disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-700" />
                <span className="text-gray-400 text-xs uppercase">or</span>
                <div className="h-px flex-1 bg-gray-700" />
              </div>

              <GoogleLogin onSuccess={handleSuccess} onError={handleError} />

              <p className="text-center text-sm text-gray-400">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#ff4d00] hover:underline font-medium"
                >
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#222]">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} Fitnase. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
