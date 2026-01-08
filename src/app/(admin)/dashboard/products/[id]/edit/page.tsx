import ProductForm from "@/components/admin/products/ProductForm";
import { getProductById } from "@/data-access/admin/products";

// 1. Define interface without Promise
interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    // 2. Access id directly (no await)
    const { id } = await params;

    const product = await getProductById(id);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold font-serif">Edit Product</h1>
                <p className="text-gray-500 mt-1">Update product details, prices, and stock.</p>
            </div>
            <ProductForm mode="edit" initialData={product} />
        </div>
    );
}