"use client";

import { useForm } from "react-hook-form";
import { signinFormType } from "../../myTypes";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Bounce, toast, ToastContainer } from "react-toastify";

import { resolve } from "path";

const SigninPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signinFormType>();

  const onSubmit = async (data: signinFormType) => {
    console.log("Form submitted:", data); // ✅ check browser console

    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      console.log(errors);
      // Show toast for invalid credentials
      toast.error("Incorrect username or password");
    } else if (res?.ok) {
      console.log("done");
      // Successful login → navigate to home
      toast.success("Login successful! Redirecting you to dashboard");
      reset();
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    }
  };
  async function googleSignIn() {
    try {
      const res = await signIn("google", {
        callbackUrl: "/dashboard", // where to redirect after login
      });

      console.log("Sign-in response:", res);
    } catch (err) {
      toast.error("Google sign-in failed");
    }
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Signin to your Account
        </h2>
        <p className="mb-8 text-center text-sm text-gray-500">
          Signin to get started 🚀
        </p>

        {/* Username */}
        <div className="mb-5">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            {...register("username", { required: "Username is required" })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none transition"
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">
              {errors.username.message}
            </p>
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

        {/* Submit Button */}
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
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
        <button
          type="button"
          onClick={googleSignIn}
          className="w-full flex justify-center mt-2 items-center gap-3 px-4 py-2 rounded-lg border shadow-sm bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.9 0 7 1.6 9.1 3.6l6.8-6.6C35.2 3.4 30.1 1 24 1 14.9 1 6.8 6.8 3.2 14.8l7.9 6.1C12.8 15 17.9 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.5 24.5c0-1.6-.1-2.8-.4-4.1H24v8h12.8c-.5 2.7-2.1 5-4.6 6.6l7.1 5.5C44.6 36.1 46.5 30.9 46.5 24.5z"
            />
            <path
              fill="#4A90E2"
              d="M10.9 29.9A14.6 14.6 0 0 1 10 24c0-1.9.4-3.7 1.1-5.4L3.2 12.5C1.2 16.6 0 20.9 0 25.9c0 4.8 1 9.3 2.9 13.3l7.9-9.3z"
            />
            <path
              fill="#FBBC05"
              d="M24 47c6.1 0 11.2-2 15-5.4l-7.1-5.5c-2 1.4-4.5 2.2-7.9 2.2-6.1 0-11.2-3.9-13-9.3l-7.9 6.1C6.8 41.2 14.9 47 24 47z"
            />
          </svg>

          <span className="text-sm font-medium text-gray-700">
            Sign in with Google
          </span>
        </button>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="font-semibold text-blue-600 hover:underline hover:cursor-pointer"
          >
            Signup
          </span>
        </p>
      </form>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default SigninPage;
