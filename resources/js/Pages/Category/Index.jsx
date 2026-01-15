import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { GoPencil, GoPlusCircle } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

export default function Index({ auth, categoryData }) {
    /* ================= STATES ================= */
    const [categoryList, setCategoryList] = useState(categoryData);

    const [openFilter, setOpenFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusValue, setStatusValue] = useState("All");

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    /* ================= FORMS ================= */
    const { data, setData, post, processing, errors } = useForm({
        category_name: "",
        image: null,
    });

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        errors: editErrors,
        reset,
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
                setCategoryList(page.props.categoryData);
                setData({ category_name: "", image: null });
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Categories</h2>}
        >
            <Head title="Categories" />

            {/* ================= MAIN ================= */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                    {/* HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold">
                            Category List
                        </h1>

                        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                            {/* SEARCH (UNCHANGED) */}
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex w-full sm:w-auto"
                            >
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search category"
                                    className="border px-3 py-2 rounded-l w-full sm:w-56"
                                />
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 rounded-r"
                                >
                                    Search
                                </button>
                            </form>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOpenFilter(true)}
                                    className="w-full flex items-center gap-1 bg-primary-light text-primary px-4 py-2 rounded"
                                >
                                    <FiFilter />
                                    Filter
                                </button>

                                <button
                                    onClick={() => setOpenAdd(true)}
                                    className="w-full flex items-center gap-1 bg-primary text-white px-4 py-2 rounded"
                                >
                                    <GoPlusCircle />
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2 text-left">
                                        Name
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Image
                                    </th>
                                    <th className="border px-4 py-2 text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCategories.length ? (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="border px-4 py-2 text-center">
                                                {cat.category_name}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {cat.image && (
                                                    <img
                                                        src={`/storage/${cat.image}`}
                                                        className="h-12 rounded"
                                                        alt={cat.category_name}
                                                    />
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 text-center space-x-4">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(cat)
                                                    }
                                                    className="text-blue-600"
                                                >
                                                    <GoPencil size={22} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(cat.id)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    <RiDeleteBinLine size={22} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-6"
                                        >
                                            No categories found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ================= FILTER / ADD / EDIT SIDEBARS ================= */}
            {(openFilter || openAdd || openEdit) && (
                <div className="fixed inset-0 bg-black/30 z-40 flex justify-end">
                    <div className="w-full sm:w-96 bg-white h-full shadow-lg p-5 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold">
                                {openFilter && "Filter"}
                                {openAdd && "Add Category"}
                                {openEdit && "Edit Category"}
                            </h2>
                            <button
                                onClick={() => {
                                    setOpenFilter(false);
                                    setOpenAdd(false);
                                    handleCloseEdit();
                                }}
                            >
                                <IoMdClose size={22} />
                            </button>
                        </div>

                        {/* FILTER */}
                        {openFilter && (
                            <>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full border px-3 py-2 mb-4"
                                />

                                <div className="space-y-2">
                                    {["All", "Active", "Inactive"].map(
                                        (st) => (
                                            <button
                                                key={st}
                                                onClick={() =>
                                                    setStatusValue(st)
                                                }
                                                className={`w-full py-2 rounded ${
                                                    statusValue === st
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-200"
                                                }`}
                                            >
                                                {st}
                                            </button>
                                        )
                                    )}
                                </div>
                            </>
                        )}

                        {/* ADD */}
                        {openAdd && (
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="text"
                                    value={data.category_name}
                                    onChange={(e) =>
                                        setData(
                                            "category_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Category name"
                                    required
                                />

                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "image",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-primary text-white py-2 rounded"
                                >
                                    {processing ? "Saving..." : "Save"}
                                </button>
                            </form>
                        )}

                        {/* EDIT */}
                        {openEdit && editingCategory && (
                            <form
                                onSubmit={handleEditSubmit}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="text"
                                    value={editData.category_name}
                                    onChange={(e) =>
                                        setEditData(
                                            "category_name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                {editingCategory.image && (
                                    <img
                                        src={`/storage/${editingCategory.image}`}
                                        className="h-16 rounded"
                                    />
                                )}

                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setEditData(
                                            "image",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="w-full bg-primary text-white py-2 rounded"
                                >
                                    {editProcessing
                                        ? "Updating..."
                                        : "Update"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
