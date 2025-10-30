"use client";

import { useForm } from "react-hook-form";
import { signupFormType } from "../../myTypes";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signupFormType>();

  const onSubmitData = async (data: signupFormType) => {
    console.log("Form submitted:", data);
    try {
      const res = await axios.post("/api/signup", data, {
        withCredentials: true,
      });
      console.log(data);
      reset();

      router.push("/signin");
    } catch (error) {
      console.log(error);
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <form
        onSubmit={handleSubmit(onSubmitData)}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Create an Account
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Sign up to get started 🚀
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("username", { required: "Name is required" })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition"
            placeholder="Enter your name"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Eye className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeOff className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          disabled={isSubmitting}
          type="submit"
          className={`w-full rounded-lg px-4 py-2 font-semibold text-white transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Signing up...
            </span>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <a
            onClick={() => router.push("/signin")}
            className="font-semibold text-blue-600 hover:underline hover:cursor-pointer"
          >
            Log in
          </a>
        </p>
        <p className="mt-6 text-center text-sm text-gray-500">
          <a
            onClick={() => router.push("/signin")}
            className="font-semibold text-blue-600 hover:underline hover:cursor-pointer"
          >
            Signin with Google{" "}
          </a>
        </p>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default Page;
