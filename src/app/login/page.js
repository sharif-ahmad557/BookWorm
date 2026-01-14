"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const { signIn, googleSignIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // রোল চেক ফাংশন
  const checkRoleAndRedirect = async (email) => {
    try {
      // --- এই লাইনটি ঠিক করা হয়েছে ---
      const res = await fetch(`/api/users/${email}`);
      // -------------------------------
      const data = await res.json();

      console.log("Login Role Check:", data?.role);

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
      // লগইন সফল হলে রোল চেক
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

  // ... (বাকি JSX অংশ যেমন আছে তেমনই থাকবে, শুধু উপরের লজিকটুকু বদলান)
  // পুরো JSX কোড আবার লাগলে বলবেন, তবে আশা করি শুধু ফাংশন আপডেট করলেই হবে।

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full flex bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block w-1/2 relative order-2">
          <img
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
            alt="Reading"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-600/40 mix-blend-multiply"></div>
          <div className="absolute bottom-10 right-10 text-white p-4 text-right">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-lg">Pick up where you left off.</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 order-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex justify-center items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white mt-4"
            >
              <FaGoogle className="text-red-500" /> Google Login
            </button>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              New here?{" "}
              <Link href="/register" className="text-blue-600">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
