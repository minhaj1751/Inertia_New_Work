import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";

export default function Index({ auth, categoryData }) {
    const [categoryList, setCategoryList] = useState(categoryData);
    const [open, setOpen] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        category_name: "",
        image: null,
    });

    // Handle Create Category
    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("category.store"), {
            forceFormData: true,
            onSuccess: (page) => {
                // Reset form + close modal + update list
                setData({ category_name: "", image: null });
                setCategoryList(page.props.categoryData);
                setOpen(false);
            },
        });
    };

    // Handle Delete Category
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Category List</h1>
                            <button
                                onClick={() => setOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                + Add Category
                            </button>
                        </div>

                        {/* Table */}
                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-2 text-left">Name</th>
                                    <th className="border px-2 py-2 text-left">Image</th>
                                    <th className="border px-2 py-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoryList.length > 0 ? (
                                    categoryList.map((category) => (
                                        <tr key={category.id}>
                                            <td className="border px-2 py-2">
                                                {category.category_name}
                                            </td>
                                            <td className="border px-2 py-2">
                                                {category.image && (
                                                    <img
                                                        src={`/storage/${category.image}`}
                                                        alt={category.category_name}
                                                        className="h-12 object-cover rounded"
                                                    />
                                                )}
                                            </td>
                                            <td className="border px-2 py-2 text-center">
                                                <Link
                                                    href={route("category.edit", category.id)}
                                                    className="text-blue-500 hover:underline mr-3"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-500 hover:underline"
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
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="relative bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            {/* Category Name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={data.category_name}
                                    onChange={(e) =>
                                        setData("category_name", e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                                {errors.category_name && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.category_name}
                                    </div>
                                )}
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                    className="w-full"
                                />
                                {errors.image && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.image}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
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