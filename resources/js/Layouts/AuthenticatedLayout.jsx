import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import wblogo from "../images/logo/wbsoft.png";
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from "react";

import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose, IoMailOpenOutline } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { HiMenuAlt3, HiX } from "react-icons/hi";

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const user = auth.user;

    /* ---------------- Sidebar Toggle ---------------- */
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    /* -------------------- Mobile Menu -------------------- */
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /* -------------------- Notifications -------------------- */
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* ==================== NAVBAR ==================== */}
            <div className="bg-white shadow">
                <div className="flex items-center justify-between px-4 py-4 lg:px-6">

                    {/* Logo */}
                    <NavLink href={route("dashboard")}>
                        <img
                            src={wblogo}
                            alt="Logo"
                            className="w-40 lg:w-56"
                        />
                    </NavLink>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex gap-6 font-medium">
                        <NavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                            className={`px-4 py-2 rounded-md text-lg transition ${route().current("dashboard")
                                ? "bg-primary text-white"
                                : "hover:bg-primary-light"
                                }`}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            href={route("products.index")}
                            active={route().current("products.*")}
                            className={`px-4 py-2 rounded-md text-lg transition ${route().current("products.*")
                                ? "bg-primary text-white"
                                : "hover:bg-primary-light"
                                }`}
                        >
                            Products
                        </NavLink>

                        <NavLink
                            href={route("category.index")}
                            active={route().current("category.*")}
                            className={`px-4 py-2 rounded-md text-lg transition ${route().current("category.*")
                                ? "bg-primary text-white"
                                : "hover:bg-primary-light"
                                }`}
                        >
                            Category
                        </NavLink>
                    </ul>

                    {/* Right Section */}
                    <div className="flex items-center gap-3">

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="p-2 rounded-full hover:bg-gray-200"
                            >
                                <IoMdNotificationsOutline size={26} />
                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                                    <FaRegUserCircle size={24} />
                                    <span className="hidden sm:block text-sm font-medium">
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

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-200"
                        >
                            {mobileMenuOpen ? <HiX size={28} /> : <HiMenuAlt3 size={28} />}
                        </button>
                    </div>
                </div>

                {/* ==================== MOBILE MENU ==================== */}
                {mobileMenuOpen && (
                    <div className="lg:hidden px-4 pb-4 space-y-2 bg-white border-t">
                        <NavLink
                            href={route("dashboard")}
                            className="block px-4 py-2 rounded hover:bg-primary-light"
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            href={route("products.index")}
                            className="block px-4 py-2 rounded hover:bg-primary-light"
                        >
                            Products
                        </NavLink>

                        <NavLink
                            href={route("category.index")}
                            className="block px-4 py-2 rounded hover:bg-primary-light"
                        >
                            Category
                        </NavLink>
                    </div>
                )}
            </div>

            {/* ==================== PAGE CONTENT ==================== */}
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}


