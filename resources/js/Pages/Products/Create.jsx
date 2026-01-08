import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        image: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            forceFormData: true,
            onSuccess: () => {
                setData({ name: "", price: "", image: null });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Add Product
                </h2>
            }
        >
            <Head title="Add Product" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <Link
                            href={route("products.index")}
                            className="text-blue-500 mb-4 inline-block"
                        >
                            ← Back to Products
                        </Link>

                        <form
                            onSubmit={handleSubmit}
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                                {errors.name && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData("price", e.target.value)
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    required
                                />
                                {errors.price && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.price}
                                    </div>
                                )}
                            </div>

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

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {processing ? "Saving..." : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
