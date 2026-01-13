"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaChartPie,
  FaBook,
  FaList,
  FaUsers,
  FaVideo,
  FaComments,
} from "react-icons/fa";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartPie /> },
    { name: "Manage Books", path: "/admin/books", icon: <FaBook /> },
    { name: "Manage Genres", path: "/admin/genres", icon: <FaList /> },
    { name: "Manage Users", path: "/admin/users", icon: <FaUsers /> },
    { name: "Reviews", path: "/admin/reviews", icon: <FaComments /> },
    { name: "Tutorials", path: "/admin/tutorials", icon: <FaVideo /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg hidden md:block min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Admin Panel
        </h2>
      </div>
      <nav className="mt-2">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-4 border-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
