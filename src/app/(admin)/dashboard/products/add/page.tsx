import ProductForm from "@/components/admin/products/ProductForm";

export default function AddProductPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 font-serif">Add New Product</h1>
            <ProductForm mode="create" />
        </div>
    );
}
