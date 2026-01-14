import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { GoPlusCircle } from "react-icons/go";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

export default function Index({ auth, categoryData }) {
    /* ================= STATES ================= */
    const [categoryList, setCategoryList] = useState(categoryData);

    // filter
    const [openFilter, setOpenFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusValue, setStatusValue] = useState("All");

    // add sidebar
    const [openAdd, setOpenAdd] = useState(false);

    /* ================= FORM ================= */
    const { data, setData, post, processing, errors } = useForm({
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
                setOpenAdd(false); // close sidebar
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
            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
                            <h1 className="text-2xl font-bold">
                                Category List
                            </h1>

                            <div className="flex gap-2">
                                {/* SEARCH */}
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="flex"
                                >
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search category"
                                        className="border px-3 py-2 rounded-l"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-primary text-white px-4 rounded-r"
                                    >
                                        Search
                                    </button>
                                </form>

                                {/* FILTER */}
                                <button
                                    onClick={() => setOpenFilter(true)}
                                    className="flex items-center gap-1 bg-primary-light text-primary px-3 py-2 rounded"
                                >
                                    <FiFilter />
                                    Filter
                                </button>

                                {/* ADD */}
                                <button
                                    onClick={() => setOpenAdd(true)}
                                    className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded"
                                >
                                    <GoPlusCircle />
                                    Add
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <table className="w-full border border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-3 py-2">
                                        Name
                                    </th>
                                    <th className="border px-3 py-2">
                                        Image
                                    </th>
                                    <th className="border px-3 py-2">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td className="border px-3 py-2">
                                                {cat.category_name}
                                            </td>

                                            <td className="border px-3 py-2">
                                                {cat.image && (
                                                    <img
                                                        src={`/storage/${cat.image}`}
                                                        className="h-12 rounded"
                                                    />
                                                )}
                                            </td>

                                            <td className="border px-3 py-2 text-center">
                                                <Link
                                                    href={route(
                                                        "category.edit",
                                                        cat.id
                                                    )}
                                                    className="text-blue-600 mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(cat.id)
                                                    }
                                                    className="text-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-4"
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

            {/* ================= FILTER SIDEBAR ================= */}
            {openFilter && (
                <div className="fixed inset-0 bg-black/30 z-40">
                    <div className="fixed right-0 top-0 w-full md:w-96 h-full bg-white shadow-lg p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Filter</h2>
                            <button onClick={() => setOpenFilter(false)}>
                                <IoMdClose size={22} />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Search category"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                            className="w-full border px-3 py-2 mb-4"
                        />

                        <div className="space-y-2">
                            {["All", "Active", "Inactive"].map((st) => (
                                <button
                                    key={st}
                                    onClick={() => setStatusValue(st)}
                                    className={`w-full py-2 rounded ${
                                        statusValue === st
                                            ? "bg-primary text-white"
                                            : "bg-gray-200"
                                    }`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusValue("All");
                                }}
                                className="bg-gray-300 px-4 py-2 rounded"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setOpenFilter(false)}
                                className="bg-primary text-white px-4 py-2 rounded"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= ADD SIDEBAR ================= */}
            {openAdd && (
                <div className="fixed inset-0 bg-black/30 z-40">
                    <div className="fixed right-0 top-0 w-full md:w-96 h-full bg-white shadow-lg p-5">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h2 className="text-lg font-semibold">
                                Add Category
                            </h2>
                            <button
                                onClick={() => setOpenAdd(false)}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <IoMdClose size={22} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category Name
                                </label>
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
                                    required
                                />
                                {errors.category_name && (
                                    <p className="text-red-500 text-sm">
                                        {errors.category_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData(
                                            "image",
                                            e.target.files[0]
                                        )
                                    }
                                />
                                {errors.image && (
                                    <p className="text-red-500 text-sm">
                                        {errors.image}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setOpenAdd(false)}
                                    className="bg-gray-300 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-primary text-white px-4 py-2 rounded"
                                >
                                    {processing ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
