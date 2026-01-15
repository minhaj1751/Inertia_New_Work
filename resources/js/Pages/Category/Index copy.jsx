import React, { useMemo, useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { GoPencil, GoPlusCircle } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { HiOutlineMenuAlt2, HiOutlineViewGrid, HiOutlineViewList } from "react-icons/hi";

export default function Index({ auth, categoryData }) {
    /* ================= STATES ================= */
    const [categoryList, setCategoryList] = useState(categoryData);

    // filter
    const [openFilter, setOpenFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusValue, setStatusValue] = useState("All");

    // add sidebar
    const [openAdd, setOpenAdd] = useState(false);
    
    // edit sidebar
    const [openEdit, setOpenEdit] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    // responsive states
    const [isMobile, setIsMobile] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

    /* ================= EFFECTS ================= */
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 640) {
                setViewMode("grid");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /* ================= FORMS ================= */
    const { data, setData, post, processing, errors } = useForm({
        category_name: "",
        image: null,
    });

    const { 
        data: editData, 
        setData: setEditData, 
        put, 
        processing: editProcessing, 
        errors: editErrors,
        reset
    } = useForm({
        category_name: "",
        image: null,
    });

    /* ================= FILTER LOGIC ================= */
    const filteredCategories = useMemo(() => {
        return categoryList.filter((cat) => {
            const matchSearch = searchTerm
                ? cat.category_name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : true;

            const matchStatus =
                statusValue === "All"
                    ? true
                    : statusValue === "Active"
                    ? cat.status === 1
                    : cat.status === 0;

            return matchSearch && matchStatus;
        });
    }, [categoryList, searchTerm, statusValue]);

    /* ================= HANDLERS ================= */
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.search.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("category.store"), {
            forceFormData: true,
            onSuccess: (page) => {
                setData({ category_name: "", image: null });
                setCategoryList(page.props.categoryData);
                setOpenAdd(false);
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("category_name", editData.category_name);
        
        if (editData.image instanceof File) {
            formData.append("image", editData.image);
        }

        router.post(route("category.update", editingCategory.id), formData, {
            forceFormData: true,
            onSuccess: (page) => {
                setCategoryList(page.props.categoryData);
                setOpenEdit(false);
                setEditingCategory(null);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            router.delete(route("category.destroy", id), {
                onSuccess: (page) => {
                    setCategoryList(page.props.categoryData);
                },
            });
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);
        setEditData({
            category_name: category.category_name,
            image: null,
        });
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditingCategory(null);
        reset();
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold text-gray-800">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />

            {/* ================= MAIN ================= */}
            <div className="py-4 md:py-8 lg:py-12">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-4 md:p-6">
                        {/* HEADER */}
                        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                                    Category List
                                </h1>
                                <p className="text-gray-600 text-sm mt-1">
                                    {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} found
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* SEARCH */}
                                <div className="relative flex-1 sm:flex-none">
                                    <form onSubmit={handleSearchSubmit}>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="search"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                placeholder="Search category..."
                                                className="w-full sm:w-64 border border-gray-300 px-4 py-2 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                            />
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                            {searchTerm && (
                                                <button
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <IoMdClose size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* VIEW MODE TOGGLE (Desktop) */}
                                {!isMobile && (
                                    <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode("table")}
                                            className={`p-2 rounded ${viewMode === "table" ? "bg-white shadow" : "hover:bg-gray-200"}`}
                                            title="Table View"
                                        >
                                            <HiOutlineViewList size={20} className={viewMode === "table" ? "text-primary" : "text-gray-600"} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow" : "hover:bg-gray-200"}`}
                                            title="Grid View"
                                        >
                                            <HiOutlineViewGrid size={20} className={viewMode === "grid" ? "text-primary" : "text-gray-600"} />
                                        </button>
                                    </div>
                                )}

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setOpenFilter(true)}
                                        className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 transition-colors"
                                    >
                                        <FiFilter size={18} />
                                        <span className="hidden sm:inline">Filter</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => setOpenAdd(true)}
                                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <GoPlusCircle size={18} />
                                        <span className="hidden sm:inline">Add Category</span>
                                        <span className="sm:hidden">Add</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ACTIVE FILTERS */}
                        {(searchTerm || statusValue !== "All") && (
                            <div className="mb-4 flex flex-wrap gap-2">
                                {searchTerm && (
                                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                        <span>Search: "{searchTerm}"</span>
                                        <button
                                            onClick={() => setSearchTerm("")}
                                            className="ml-1 hover:text-blue-900"
                                        >
                                            <IoMdClose size={14} />
                                        </button>
                                    </div>
                                )}
                                {statusValue !== "All" && (
                                    <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                        <span>Status: {statusValue}</span>
                                        <button
                                            onClick={() => setStatusValue("All")}
                                            className="ml-1 hover:text-green-900"
                                        >
                                            <IoMdClose size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TABLE VIEW */}
                        {viewMode === "table" ? (
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                                                Name
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b hidden md:table-cell">
                                                Image
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                                                Status
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {filteredCategories.length > 0 ? (
                                            filteredCategories.map((cat) => (
                                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            {cat.image && (
                                                                <img
                                                                    src={`/storage/${cat.image}`}
                                                                    className="h-8 w-8 rounded-full object-cover mr-3 md:hidden"
                                                                    alt={cat.category_name}
                                                                />
                                                            )}
                                                            <span className="font-medium text-gray-900">
                                                                {cat.category_name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 hidden md:table-cell">
                                                        {cat.image && (
                                                            <img
                                                                src={`/storage/${cat.image}`}
                                                                className="h-12 w-12 rounded-lg object-cover border"
                                                                alt={cat.category_name}
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {cat.status === 1 ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => handleEditClick(cat)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                title="Edit"
                                                            >
                                                                <GoPencil size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                title="Delete"
                                                            >
                                                                <RiDeleteBinLine size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-8 text-center">
                                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                                        <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                        <p className="text-lg font-medium">No categories found</p>
                                                        <p className="text-sm mt-1">Try adjusting your search or filter</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            /* GRID/CARD VIEW */
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <div key={cat.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-gray-900 text-lg truncate">
                                                        {cat.category_name}
                                                    </h3>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${cat.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {cat.status === 1 ? 'Active' : 'Inactive'}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 ml-2">
                                                    <button
                                                        onClick={() => handleEditClick(cat)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Edit"
                                                    >
                                                        <GoPencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(cat.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Delete"
                                                    >
                                                        <RiDeleteBinLine size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {cat.image && (
                                                <div className="mb-3">
                                                    <img
                                                        src={`/storage/${cat.image}`}
                                                        className="w-full h-40 object-cover rounded-lg"
                                                        alt={cat.category_name}
                                                    />
                                                </div>
                                            )}
                                            
                                            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                                                ID: {cat.id}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-lg font-medium">No categories found</p>
                                            <p className="text-sm mt-1">Try a different search or add a new category</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PAGINATION (if needed) */}
                        {filteredCategories.length > 0 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-700">
                                <div>
                                    Showing {filteredCategories.length} of {categoryList.length} categories
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 bg-primary text-white rounded">1</span>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ================= FILTER SIDEBAR ================= */}
            {openFilter && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div 
                        className={`w-full max-w-md h-full bg-white shadow-xl overflow-y-auto transform transition-transform ${isMobile ? 'animate-slideInUp' : 'animate-slideInRight'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b z-10">
                            <div className="flex justify-between items-center p-4">
                                <h2 className="text-lg font-semibold">Filter Categories</h2>
                                <button 
                                    onClick={() => setOpenFilter(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-6">
                            {/* Search Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Type category name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="space-y-2">
                                    {["All", "Active", "Inactive"].map((st) => (
                                        <button
                                            key={st}
                                            onClick={() => setStatusValue(st)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                                statusValue === st
                                                    ? "bg-primary border-primary text-white"
                                                    : "bg-white border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>{st}</span>
                                            {statusValue === st && (
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none">
                                    <option>Name (A-Z)</option>
                                    <option>Name (Z-A)</option>
                                    <option>Recently Added</option>
                                    <option>Status</option>
                                </select>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4">
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusValue("All");
                                    }}
                                    className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={() => setOpenFilter(false)}
                                    className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ADD SIDEBAR ================= */}
            {openAdd && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div 
                        className={`w-full max-w-md h-full bg-white shadow-xl overflow-y-auto transform transition-transform ${isMobile ? 'animate-slideInUp' : 'animate-slideInRight'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b z-10">
                            <div className="flex justify-between items-center p-4">
                                <h2 className="text-lg font-semibold">Add New Category</h2>
                                <button 
                                    onClick={() => setOpenAdd(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-6">
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.category_name}
                                    onChange={(e) => setData("category_name", e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="Enter category name"
                                    required
                                />
                                {errors.category_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category_name}</p>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Image
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input
                                                    id="image-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => setData("image", e.target.files[0])}
                                                    accept="image/*"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 2MB
                                        </p>
                                    </div>
                                </div>
                                {data.image && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600">Selected: {data.image.name}</p>
                                    </div>
                                )}
                                {errors.image && (
                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                )}
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 0].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setData("status", status)}
                                            className={`p-3 rounded-lg border ${
                                                data.status === status
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {status === 1 ? "Active" : "Inactive"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white border-t pt-4">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setOpenAdd(false)}
                                        className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Saving...
                                            </span>
                                        ) : (
                                            "Save Category"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ================= EDIT SIDEBAR ================= */}
            {openEdit && editingCategory && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-end">
                    <div 
                        className={`w-full max-w-md h-full bg-white shadow-xl overflow-y-auto transform transition-transform ${isMobile ? 'animate-slideInUp' : 'animate-slideInRight'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b z-10">
                            <div className="flex justify-between items-center p-4">
                                <h2 className="text-lg font-semibold">Edit Category</h2>
                                <button 
                                    onClick={handleCloseEdit}
                                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <IoMdClose size={24} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-4 space-y-6">
                            {/* Current Image Preview */}
                            {editingCategory.image && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Current Image
                                    </label>
                                    <div className="relative">
                                        <img
                                            src={`/storage/${editingCategory.image}`}
                                            className="w-full h-48 object-cover rounded-lg border"
                                            alt={editingCategory.category_name}
                                        />
                                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                            Current
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editData.category_name}
                                    onChange={(e) => setEditData("category_name", e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    required
                                />
                                {editErrors.category_name && (
                                    <p className="mt-1 text-sm text-red-600">{editErrors.category_name}</p>
                                )}
                            </div>

                            {/* Update Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Update Image (Optional)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="edit-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                                <span>Upload new image</span>
                                                <input
                                                    id="edit-image-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    onChange={(e) => setEditData("image", e.target.files[0])}
                                                    accept="image/*"
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Leave empty to keep current image
                                        </p>
                                    </div>
                                </div>
                                {editData.image instanceof File && (
                                    <div className="mt-3">
                                        <p className="text-sm text-gray-600">New image: {editData.image.name}</p>
                                    </div>
                                )}
                                {editErrors.image && (
                                    <p className="mt-1 text-sm text-red-600">{editErrors.image}</p>
                                )}
                            </div>

                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[1, 0].map((status) => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setEditData("status", status)}
                                            className={`p-3 rounded-lg border ${
                                                editData.status === status
                                                    ? "border-primary bg-primary text-white"
                                                    : "border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {status === 1 ? "Active" : "Inactive"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="sticky bottom-0 bg-white border-t pt-4">
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleCloseEdit}
                                        className="flex-1 py-2.5 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editProcessing}
                                        className="flex-1 py-2.5 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {editProcessing ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Updating...
                                            </span>
                                        ) : (
                                            "Update Category"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideInUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.3s ease-out;
                }
                
                .animate-slideInUp {
                    animation: slideInUp 0.3s ease-out;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}