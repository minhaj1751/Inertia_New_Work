import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, products }) {
    const [productList, setProductList] = useState(products);

    const handleDelete = (id) => {
        if (confirm("Are you sure?")) {
            router.delete(route("products.destroy", id), {
                onSuccess: (page) => {
                    setProductList(page.props.products);
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-2xl font-bold">Product List</h1>
                            <Link
                                href={route("products.create")}
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Add Product
                            </Link>
                        </div>

                        <table className="w-full border">
                            <thead>
                                <tr>
                                    <th className="border px-2 py-1">Name</th>
                                    <th className="border px-2 py-1">Price</th>
                                    <th className="border px-2 py-1">Image</th>
                                    <th className="border px-2 py-1">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {productList.length > 0 ? (
                                    productList.map((product) => (
                                        <tr key={product.id}>
                                            <td className="border px-2 py-1">
                                                {product.name}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {product.price}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {product.image && (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="h-12"
                                                    />
                                                )}
                                            </td>
                                            <td className="border px-2 py-1">
                                                <Link
                                                    href={route(
                                                        "products.edit",
                                                        product.id
                                                    )}
                                                    className="text-blue-500 mr-2"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                    className="text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-4"
                                        >
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
