"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
    } else {
      fetch(`/api/users/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.role === "admin") {
            router.replace("/admin/dashboard");
          } else {
            router.replace("/my-library");
          }
        })
        .catch((err) => {
          console.error("Redirect logic error:", err);
          router.replace("/my-library");
        });
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}
