"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`/api/users/${user.email}`);
          const data = await res.json();

          if (data.role === "admin") {
            setIsAdmin(true);
          } else {
            toast.error("Access Denied: Admins Only!");
            router.push("/"); // সাধারণ ইউজার হলে হোমপেজে পাঠিয়ে দাও
          }
        } catch (error) {
          console.error("Role check failed");
          router.push("/");
        } finally {
          setCheckingRole(false);
        }
      } else if (!loading && !user) {
        router.push("/login");
      }
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [user, loading, router]);

  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">{children}</main>
    </div>
  );
}
