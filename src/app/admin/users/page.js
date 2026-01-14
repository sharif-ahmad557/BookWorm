"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaUserShield, FaUser, FaUsers, FaCheckCircle } from "react-icons/fa";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load users");
      setLoading(false);
    }
  };

  const handleRoleChange = async (user, newRole) => {
    Swal.fire({
      title: `Promote to ${newRole === "admin" ? "Admin" : "User"}?`,
      text: `Are you sure you want to make ${user.name} a ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/users/${user._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role: newRole }),
          });

          if (res.ok) {
            Swal.fire("Updated!", "User role has been updated.", "success");
            fetchUsers(); 
          } else {
            toast.error("Failed to update role");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading users...</div>;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-3 animate-fade-in-down">
          <FaUsers className="text-blue-600" /> Manage Users
        </h1>
        <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow text-gray-600 dark:text-gray-300">
          Total Users:{" "}
          <span className="font-bold text-blue-600">{users.length}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 text-sm uppercase">
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.photoURL ||
                          "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&q=80"
                        }
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                      <span className="font-semibold text-gray-800 dark:text-white">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {user.email}
                  </td>
                  <td className="p-4">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                        <FaUserShield /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <FaUser /> User
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {user.role === "user" ? (
                      <button
                        onClick={() => handleRoleChange(user, "admin")}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-lg shadow transition transform active:scale-95 flex items-center gap-2 mx-auto"
                      >
                        <FaUserShield /> Make Admin
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user, "user")}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm px-4 py-2 rounded-lg shadow transition transform active:scale-95 flex items-center gap-2 mx-auto"
                      >
                        <FaUser /> Remove Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
