"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaBookOpen,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const { signIn, googleSignIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // পাসওয়ার্ড টগল স্টেট

  const checkRoleAndRedirect = async (email) => {
    try {
      const res = await fetch(`/api/users/${email}`);
      const data = await res.json();

      if (data?.role === "admin") {
        router.replace("/admin/dashboard");
        toast.success("Welcome Admin!");
      } else {
        router.replace("/my-library");
        toast.success("Login Successful!");
      }
    } catch (error) {
      console.error("Redirect Error:", error);
      router.replace("/my-library");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      setLoading(true);
      await signIn(email, password);
      await checkRoleAndRedirect(email);
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await googleSignIn();
      const user = result.user;

      await fetch("/api/auth/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          firebaseUid: user.uid,
        }),
      });

      await checkRoleAndRedirect(user.email);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7260b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=2500&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 m-4 bg-white/10 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-lg"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg cursor-pointer"
          >
            <FaBookOpen className="text-3xl text-white" />
          </motion.div>
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-blue-200">Continue your reading journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="w-full py-4 pl-12 pr-4 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
          </div>

          {/* Password Input with Toggle */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaLock className="text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              name="password"
              type={showPassword ? "text" : "password"} // টগল লজিক
              required
              placeholder="Password"
              className="w-full py-4 pl-12 pr-12 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 hover:bg-gray-900/70 transition-all duration-300"
            />
            {/* Eye Icon Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-white/20"></div>
          <span className="px-4 text-sm text-gray-300">Or continue with</span>
          <div className="flex-grow border-t border-white/20"></div>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
        >
          <FaGoogle className="text-red-500 text-xl" />
          <span>Sign in with Google</span>
        </button>

        {/* Footer Link */}
        <p className="mt-8 text-center text-gray-300">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors"
          >
            Register now
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
