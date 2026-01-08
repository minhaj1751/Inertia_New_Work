import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    FaUserGraduate,
    FaChalkboardTeacher,
    FaBook,
    FaClipboardList,
} from "react-icons/fa";
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <h2 className="text-2xl ml-6 font-semibold leading-tight text-gray-800">
                Dashboard
            </h2>

            <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

                {/* ===== Welcome Section ===== */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-2xl shadow-lg">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome 👋
                        </h1>
                        <p className="text-xl mt-2 font-semibold opacity-90">
                            Magic Result Dashboard
                        </p>
                        <p className="mt-3 text-sm opacity-80 max-w-md">
                            Manage students, classes, subjects and results easily from one place.
                        </p>
                    </div>

                    <div className="text-center border border-white/40 rounded-xl px-10 py-6 backdrop-blur-sm">
                        <h2 className="text-5xl font-bold">2025</h2>
                        <p className="uppercase tracking-wide text-sm mt-1">
                            Academic Year
                        </p>
                    </div>
                </div>

                {/* ===== Cards Section ===== */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Students */}
                    <div className="bg-base-200 p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Students</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    1,250
                                </h3>
                            </div>
                            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full text-2xl">
                                <FaUserGraduate />
                            </div>
                        </div>
                    </div>

                    {/* Teachers */}
                    <div className="bg-base-200 p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Teachers</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    85
                                </h3>
                            </div>
                            <div className="bg-green-100 text-green-600 p-4 rounded-full text-2xl">
                                <FaChalkboardTeacher />
                            </div>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div className="bg-base-200 p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Subjects</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    42
                                </h3>
                            </div>
                            <div className="bg-orange-100 text-orange-600 p-4 rounded-full text-2xl">
                                <FaBook />
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-base-200 p-6 rounded-xl shadow hover:shadow-lg transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Published Results</p>
                                <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                    18
                                </h3>
                            </div>
                            <div className="bg-purple-100 text-purple-600 p-4 rounded-full text-2xl">
                                <FaClipboardList />
                            </div>
                        </div>
                    </div>

                </div>

                {/* ===== Footer Text ===== */}
                <div className="text-center text-sm text-gray-400 pt-6">
                    © {new Date().getFullYear()} Magic Result • All rights reserved
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
