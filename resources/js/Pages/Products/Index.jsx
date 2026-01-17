import React, { useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { GoPencil, GoPlusCircle } from "react-icons/go";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiFilter } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

export default function Index({ auth, products }) {
    /* ================= STATES ================= */
    const [productList, setProductList] = useState(products);

    const [openFilter, setOpenFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusValue, setStatusValue] = useState("All");

    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    /* ================= FORMS ================= */
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        price: "",
        image: null,
    });

    const {
        data: editData,
        setData: setEditData,
        processing: editProcessing,
        errors: editErrors,
        reset,
    } = useForm({
        name: "",
        price: "",
        image: null,
    });

    /* ================= FILTER LOGIC ================= */
    const filteredProducts = useMemo(() => {
        return productList.filter((prod) => {
            const matchSearch = searchTerm
                ? prod.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : true;

            const matchStatus =
                statusValue === "All"
                    ? true
                    : statusValue === "Active"
                        ? prod.status === 1
                        : prod.status === 0;

            return matchSearch && matchStatus;
        });
    }, [productList, searchTerm, statusValue]);

    /* ================= HANDLERS ================= */
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.search.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            forceFormData: true,
            onSuccess: () => {
                setData({ name: "", price: "", image: null });
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("_method", "PUT");
        formData.append("name", editData.name);
        formData.append("price", editData.price);

        if (editData.image instanceof File) {
            formData.append("image", editData.image);
        }

        router.post(route("product.update", editingProduct.id), formData, {
            forceFormData: true,
            onSuccess: (page) => {
                setProductList(page.props.Products);
                setOpenEdit(false);
                setEditingProduct(null);
                reset();
            },
        });
    };

    const handleDelete = (id) => {
            if (confirm("Are you sure?")) {
                router.delete(route("products.destroy", id), {
                    onSuccess: (page) => {
                        setProductList(page.props.products);
                    },
                });
            }
        };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setEditData({
            name: product.name,
            price:product.price,
            image: null,
        });
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
        setEditingProduct(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Products</h2>}
        >
            <Head title="Products" />

            {/* ================= MAIN ================= */}
            <div className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
                    {/* HEADER */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <h1 className="text-2xl font-bold">
                            Product List
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
                                        Price
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
                                {filteredProducts.length ? (
                                    filteredProducts.map((prod) => (
                                        <tr key={prod.id}>
                                            <td className="border px-4 py-2 text-center">
                                                {prod.name}
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                {prod.price}
                                            </td>
                                            <td className="border px-4 py-2">
                                                {prod.image && (
                                                    <img
                                                        src={`/storage/${prod.image}`}
                                                        className="h-12 rounded"
                                                        alt={prod.name}
                                                    />
                                                )}
                                            </td>
                                            <td className="border px-4 py-2 text-center space-x-4">
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(prod)
                                                    }
                                                    className="text-blue-600"
                                                >
                                                    <GoPencil size={22} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(prod.id)
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
                                {openAdd && "Add Product"}
                                {openEdit && "Edit Product"}
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
                                                className={`w-full py-2 rounded ${statusValue === st
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
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Product name"
                                    required
                                />

                                <input
                                    type="text"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData(
                                            "price",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Product Price"
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
                        {openEdit && editingProduct && (
                            <form
                                onSubmit={handleEditSubmit}
                                className="space-y-4"
                                encType="multipart/form-data"
                            >
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) =>
                                        setEditData(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                <input
                                    type="text"
                                    value={editData.price}
                                    onChange={(e) =>
                                        setEditData(
                                            "price",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border px-3 py-2 rounded"
                                    required
                                />

                                {editingProduct.image && (
                                    <img
                                        src={`/storage/${editingProduct.image}`}
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
