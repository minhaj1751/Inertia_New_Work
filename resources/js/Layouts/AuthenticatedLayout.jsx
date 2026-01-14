import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import wblogo from "../images/logo/wbsoft.png";
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose, IoMailOpenOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    /* -------------------- Theme -------------------- */
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        document.documentElement.className = savedTheme;
        setTheme(savedTheme);
    }, []);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        toast.success(
            newTheme === "dark" ? "Dark Mode Enabled" : "Light Mode Enabled"
        );
    };

    /* -------------------- Notifications -------------------- */
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const toggleNotificationDropdown = () =>
        setIsNotificationOpen((prev) => !prev);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* -------------------- Navbar -------------------- */}
            <div className="flex items-center justify-between px-6 py-4 bg-white shadow">
                {/* Logo */}
                <NavLink href={route("dashboard")}>
                    <img src={wblogo} alt="Logo" className="w-56" />
                </NavLink>

                {/* Menu */}
                <ul className="hidden lg:flex gap-6 font-medium">
                    <NavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        href={route("products.index")}
                        active={route().current("products.*")}
                    >
                        Products
                    </NavLink>

                    <NavLink
                        href={route("category.index")}
                        active={route().current("category.*")}
                    >
                        Category
                    </NavLink>
                </ul>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={toggleNotificationDropdown}
                            className="relative p-2 rounded-full hover:bg-gray-200"
                        >
                            <IoMdNotificationsOutline size={28} />
                            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">
                                5
                            </span>
                        </button>

                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-3 w-72 bg-white shadow-lg rounded-md z-50">
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="font-semibold">Notifications</h3>
                                    <IoMailOpenOutline size={20} />
                                </div>

                                <ul className="max-h-60 overflow-y-auto">
                                    {[1, 2, 3].map((i) => (
                                        <li
                                            key={i}
                                            className="flex justify-between p-3 border-b hover:bg-gray-100"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    New message received
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    4 days ago
                                                </p>
                                            </div>
                                            <IoClose className="cursor-pointer" />
                                        </li>
                                    ))}
                                </ul>

                                <div className="p-3 text-center text-sm text-blue-600 cursor-pointer">
                                    View all
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <button className="flex items-center gap-2">
                                <FaRegUserCircle size={26} />
                                <span className="text-sm font-medium">
                                    {user.name}
                                </span>
                                <IoIosArrowDown />
                            </button>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route("profile.edit")}>
                                Profile
                            </Dropdown.Link>

                            <Dropdown.Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </div>
            </div>

            {/* Optional Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        {header}
                    </div>
                </header>
            )}

            {/* Page Content */}
            <main className="p-6">{children}</main>
        </div>
    );
}
