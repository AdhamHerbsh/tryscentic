'use client';

import { useEffect, useState } from 'react';
import { getProducts, getBrands, getCategories, deleteProduct } from '@/data-access/admin/products';
import { Product, Brand, Category } from '@/types/database';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, Package, Eye } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { InputField } from '@/components/ui/Forms/InputField';

export default function ProductsManage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        brand_id: '',
        category_id: '',
        is_active: undefined as boolean | undefined,
    });

    useEffect(() => {
        loadData();
    }, [page, search, filters]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [productsData, brandsData, categoriesData] = await Promise.all([
                getProducts({
                    search,
                    page,
                    limit: 10,
                    ...filters
                }),
                getBrands(),
                getCategories(),
            ]);

            setProducts(productsData.products);
            setTotalPages(productsData.totalPages);
            setBrands(brandsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await deleteProduct(id);
            toast.success('Product deleted successfully');
            loadData();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    const getTotalStock = (product: Product) => {
        if (!product.variants) return 0;
        return product.variants.reduce((sum, v) => sum + v.stock_quantity, 0);
    };

    const getMinPrice = (product: Product) => {
        if (!product.variants || product.variants.length === 0) return 0;
        return Math.min(...product.variants.map(v => v.price));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Products Management</h1>
                    <p className="text-gray-100 mt-1">Manage your perfume inventory</p>
                </div>
                <Link
                    href="/dashboard/products/add-product"
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                >
                    <Plus size={20} />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="md:col-span-1">
                        <div className="relative">
                            <InputField
                                icon={<Search size={16} />}
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>
                    </div>

                    {/* Brand Filter */}
                    <div>
                        <select
                            value={filters.brand_id}
                            onChange={(e) => {
                                setFilters({ ...filters, brand_id: e.target.value });
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option className="text-gray-400" value="">All Brands</option>
                            {brands.map((brand) => (
                                <option className="text-gray-800" key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={filters.category_id}
                            onChange={(e) => {
                                setFilters({ ...filters, category_id: e.target.value });
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option className="text-gray-400" value="">All Categories</option>
                            {categories.map((category) => (
                                <option className="text-gray-800" key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={filters.is_active === undefined ? '' : filters.is_active.toString()}
                            onChange={(e) => {
                                setFilters({
                                    ...filters,
                                    is_active: e.target.value === '' ? undefined : e.target.value === 'true'
                                });
                                setPage(1);
                            }}
                            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            <option className="text-black" value="">All Status</option>
                            <option className="text-black" value="true">Active</option>
                            <option className="text-black" value="false">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Brand
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Package className="mx-auto mb-2" size={48} />
                                        <p>No products found</p>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {product.base_image_url ? (
                                                        <Image
                                                            src={product.base_image_url}
                                                            alt={product.title}
                                                            width={48}
                                                            height={48}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-full h-full p-2 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{product.title}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {product.variants?.length || 0} variants
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {product.brand?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {product.category?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                            From LE {getMinPrice(product).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`inline-flex px-2 py-1 rounded-full ${getTotalStock(product) === 0
                                                    ? 'bg-red-100 text-red-700'
                                                    : getTotalStock(product) < 10
                                                        ? 'bg-yellow-100 text-black'
                                                        : 'bg-green-100 text-green-700'
                                                    }`}
                                            >
                                                {getTotalStock(product)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const newStatus = !product.is_active;
                                                        // Optimistic update
                                                        setProducts(products.map(p =>
                                                            p.id === product.id ? { ...p, is_active: newStatus } : p
                                                        ));

                                                        const { toggleProductStatus } = await import('@/data-access/admin/products');
                                                        await toggleProductStatus(product.id, newStatus);
                                                        toast.success(`Product ${newStatus ? 'activated' : 'deactivated'}`);
                                                    } catch (error) {
                                                        // Revert on error
                                                        setProducts(products.map(p =>
                                                            p.id === product.id ? { ...p, is_active: !product.is_active } : p
                                                        ));
                                                        toast.error('Failed to update status');
                                                        console.error(error);
                                                    }
                                                }}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${product.is_active ? 'bg-purple-600' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.is_active ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/shop/${product.id}`}
                                                    target="_blank"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/products/${product.id}/edit`}
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
