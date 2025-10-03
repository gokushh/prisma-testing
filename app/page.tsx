"use client"

import { addUser, listUsers } from "@/actions/user";
import { useState } from "react";

export default function Home() {
    const [users, setUsers] = useState<{ id: number; name: string | null }[]>([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    const handleAddUser = async () => {
        if (!name.trim()) {
            setMessage({ type: "error", text: "Please enter a name" });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const result = await addUser(name);
            if (result.success) {
                setMessage({ type: "success", text: "User created successfully!" });
                setName("");
                // Refresh the user list
                const listResult = await listUsers();
                if (listResult.success && listResult.users) {
                    setUsers(listResult.users);
                }
            } else {
                setMessage({ type: "error", text: result.error || "Failed to create user" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    const handleListUsers = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const result = await listUsers();
            if (result.success && result.users) {
                setUsers(result.users);
                if (result.users.length === 0) {
                    setMessage({ type: "info", text: "No users found" });
                }
            } else {
                setMessage({ type: "error", text: result.error || "Failed to fetch users" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An unexpected error occurred" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management System</h1>
                    <p className="text-gray-600">Add and list users with server actions</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add User Section */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New User</h2>
                        <p className="text-gray-600 mb-6">Click the button to add a user to the database</p>

                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Enter user name"
                                disabled={loading}
                            />
                        </div>

                        <button
                            onClick={handleAddUser}
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                }`}
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>

                    {/* List Users Section */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
                            <button
                                onClick={handleListUsers}
                                disabled={loading}
                                className={`py-2 px-4 rounded-lg font-medium text-white transition ${loading
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    }`}
                            >
                                {loading ? "Loading..." : "Refresh List"}
                            </button>
                        </div>

                        <div className="mt-6">
                            {message && (
                                <div
                                    className={`p-4 rounded-lg mb-4 ${message.type === "error"
                                        ? "bg-red-50 text-red-800"
                                        : message.type === "success"
                                            ? "bg-green-50 text-green-800"
                                            : "bg-blue-50 text-blue-800"
                                        }`}
                                >
                                    {message.text}
                                </div>
                            )}

                            {users.length > 0 ? (
                                <div className="space-y-4">
                                    <ul className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <li key={user.id} className="py-4">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-800 font-medium">
                                                            {user.name?.charAt(0).toUpperCase() || "U"}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {user.name || "Unnamed User"}
                                                        </h3>
                                                        <p className="text-gray-500">ID: {user.id}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="text-gray-400 mb-2">No users to display</div>
                                    <p className="text-gray-500 text-sm">Click &quotRefresh List&quot to fetch users</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}