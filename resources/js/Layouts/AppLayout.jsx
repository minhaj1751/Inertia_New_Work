import React from "react";
import { Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

export default function AppLayout({ children }) {
    const logout = () => {
        if (confirm("Are you sure you want to logout?")) {
            Inertia.post(route("logout"));
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="w-48 bg-gray-200 p-4">
                <h2 className="text-xl mb-4">Admin Panel</h2>
                <Link href={route("dashboard")} className="block mb-2">
                    Dashboard
                </Link>
            </div>

            <div className="flex-1 p-4">
                <div className="flex justify-end mb-4">
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white px-4 py-1 rounded"
                    >
                        Logout
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
}
