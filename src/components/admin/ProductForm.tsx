'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct, getBrands, getCategories, createBrand, createCategory } from '@/data-access/admin/products';
import { uploadImage, uploadImages } from '@/lib/utils/upload-image';
import { Brand, Category, Product } from '@/types/database';
import { toast } from 'sonner';
import { Plus, X, Upload, ArrowLeft, ImageIcon, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { InputField } from '../ui/Forms/InputField';

interface ProductFormProps {
    initialData?: Product;
    mode?: 'create' | 'edit';
}

export default function ProductForm({ initialData, mode = 'create' }: ProductFormProps) {
    const router = useRouter();

    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showNewBrand, setShowNewBrand] = useState(false);
    const [showNewCategory, setShowNewCategory] = useState(false);

    // Initialize form data
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        brand_id: initialData?.brand_id || '',
        category_id: initialData?.category_id || '',
        base_image_url: initialData?.base_image_url || '',
        gallery_images: initialData?.gallery_images || [] as string[],
        variants: initialData?.variants?.map(v => ({
            id: v.id, // Keep ID for updates
            size_label: v.size_label,
            price: v.price,
            stock_quantity: v.stock_quantity
        })) || [
                { size_label: '', price: 0, stock_quantity: 0 }
            ]
    });

    const [newBrand, setNewBrand] = useState({ name: '', slug: '' });
    const [newCategory, setNewCategory] = useState({ name: '', parent_id: null });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [brandsData, categoriesData] = await Promise.all([
                getBrands(),
                getCategories(),
            ]);
            setBrands(brandsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to load data:', error);
            toast.error('Failed to load brands and categories');
        }
    };

    const handleCreateBrand = async () => {
        try {
            const slug = newBrand.slug || newBrand.name.toLowerCase().replace(/\s+/g, '-');
            const brand = await createBrand({ name: newBrand.name, slug });
            setBrands([...brands, brand]);
            setFormData({ ...formData, brand_id: brand.id });
            setNewBrand({ name: '', slug: '' });
            setShowNewBrand(false);
            toast.success('Brand created successfully');
        } catch (error) {
            console.error('Failed to create brand:', error);
            toast.error('Failed to create brand');
        }
    };

    const handleCreateCategory = async () => {
        try {
            const category = await createCategory(newCategory);
            setCategories([...categories, category]);
            setFormData({ ...formData, category_id: category.id });
            setNewCategory({ name: '', parent_id: null });
            setShowNewCategory(false);
            toast.success('Category created successfully');
        } catch (error) {
            console.error('Failed to create category:', error);
            toast.error('Failed to create category');
        }
    };

    // Variant Management
    const handleAddVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { size_label: '', price: 0, stock_quantity: 0 }]
        });
    };

    const handleRemoveVariant = (index: number) => {
        setFormData({
            ...formData,
            variants: formData.variants.filter((_, i) => i !== index)
        });
    };

    const handleVariantChange = (index: number, field: string, value: string | number) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };

    // Image Upload Logic
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBase: boolean) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const fileArray = Array.from(files);

            // Convert to format expected by uploadImages
            const filesToUpload = await Promise.all(
                fileArray.map(async (file) => {
                    const buffer = await file.arrayBuffer();
                    return {
                        name: file.name,
                        data: Buffer.from(buffer)
                    };
                })
            );

            // Note: In a real client-side component, we might want to upload directly to Supabase via client SDK 
            // to avoid sending large files to Next.js server actions if payload limits are an issue.
            // But for now, using the server action utility:

            if (isBase) {
                // Upload single base image
                const url = await uploadImage(filesToUpload[0].data, filesToUpload[0].name);
                setFormData(prev => ({ ...prev, base_image_url: url }));
            } else {
                // Upload gallery images
                const urls = await uploadImages(filesToUpload);
                setFormData(prev => ({
                    ...prev,
                    gallery_images: [...prev.gallery_images, ...urls]
                }));
            }

            toast.success('Images uploaded successfully');
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.message || 'Failed to upload images');
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemoveGalleryImage = (index: number) => {
        setFormData({
            ...formData,
            gallery_images: formData.gallery_images.filter((_, i) => i !== index)
        });
    };

    // Drag and Drop Logic
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            // Trigger upload logic essentially identical to file input
            // (Refactored for reuse if strictly needed, or just copy logic momentarily)
            try {
                setUploading(true);
                const fileArray = Array.from(files);
                const filesToUpload = await Promise.all(
                    fileArray.map(async (file) => {
                        const buffer = await file.arrayBuffer();
                        return {
                            name: file.name,
                            data: Buffer.from(buffer)
                        };
                    })
                );

                const urls = await uploadImages(filesToUpload);
                setFormData(prev => ({
                    ...prev,
                    gallery_images: [...prev.gallery_images, ...urls]
                }));
                toast.success('Images uploaded');
            } catch (error) {
                console.error(error);
                toast.error('Upload failed');
            } finally {
                setUploading(false);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.brand_id || !formData.category_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.variants.length === 0) {
            toast.error('Please add at least one variant');
            return;
        }

        if (formData.variants.some(v => !v.size_label || v.price <= 0)) {
            toast.error('All variants must have a size label and price');
            return;
        }

        try {
            setLoading(true);

            if (mode === 'create') {
                await createProduct(formData);
                toast.success('Product created successfully!');
            } else {
                if (!initialData?.id) throw new Error('Product ID missing');
                await updateProduct({
                    id: initialData.id,
                    ...formData
                });
                toast.success('Product updated successfully!');
            }

            router.push('/dashboard/products');
            router.refresh();
        } catch (error: any) {
            console.error('Failed to save product:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h2>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Product Title *
                    </label>
                    <InputField
                        icon=""
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Dior Sauvage Eau de Toilette"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624] focus:border-transparent transition-all shadow-sm"
                        placeholder="Describe the perfume notes, longevity, occasion..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Brand */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Brand *
                        </label>
                        {!showNewBrand ? (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={formData.brand_id}
                                        onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                                        className="w-full appearance-none px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624]"
                                        required
                                    >
                                        <option value="" className="text-gray-400">Select Brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id} className="text-gray-900">
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowNewBrand(true)}
                                    className="px-4 py-2 text-[#511624] bg-[#511624]/5 hover:bg-[#511624]/10 rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                <InputField
                                    icon=""
                                    type="text"
                                    value={newBrand.name}
                                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                    placeholder="Brand Name"
                                />
                                <InputField
                                    icon=""
                                    type="text"
                                    value={newBrand.slug}
                                    onChange={(e) => setNewBrand({ ...newBrand, slug: e.target.value })}
                                    placeholder="Slug (optional)"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCreateBrand}
                                        className="px-4 py-2 bg-[#511624] text-white rounded-lg hover:bg-[#511624]/90 text-sm"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewBrand(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">
                            Category *
                        </label>
                        {!showNewCategory ? (
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full appearance-none px-4 py-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624]"
                                        required
                                    >
                                        <option value="" className="text-gray-400">Select Category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id} className="text-gray-900">
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowNewCategory(true)}
                                    className="px-4 py-2 text-[#511624] bg-[#511624]/5 hover:bg-[#511624]/10 rounded-lg transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                <InputField
                                    icon=""
                                    type="text"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    placeholder="Category Name"
                                />
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        className="px-4 py-2 bg-[#511624] text-white rounded-lg hover:bg-[#511624]/90 text-sm"
                                    >
                                        Create
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCategory(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Product Images</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Base Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">Base Image (Main)</label>
                        <div className="flex items-start gap-4">
                            <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner flex-shrink-0">
                                {formData.base_image_url ? (
                                    <Image
                                        src={formData.base_image_url}
                                        alt="Base preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        <ImageIcon size={32} />
                                    </div>
                                )}
                                {uploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>}
                            </div>
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, true)}
                                    className="hidden"
                                    id="base-image-upload"
                                />
                                <label
                                    htmlFor="base-image-upload"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
                                >
                                    <Upload size={16} />
                                    Upload Base Image
                                </label>
                                <p className="text-xs text-gray-500 mt-2">
                                    Recommended: 800x800px, JPG or PNG.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Gallery Images Dropzone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-800 mb-2">Gallery Images</label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${dragActive
                                ? 'border-[#511624] bg-[#511624]/5 transform scale-[1.02]'
                                : 'border-gray-300 hover:border-[#511624] hover:bg-gray-50'
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileUpload(e, false)}
                                className="hidden"
                                id="gallery-upload"
                            />
                            <label htmlFor="gallery-upload" className="cursor-pointer block">
                                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-gray-400">
                                    {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
                                </div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Gallery Preview Grid */}
                {formData.gallery_images.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Gallery Preview</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {formData.gallery_images.map((url, idx) => (
                                <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                    <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryImage(idx)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Variants */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-6 border border-gray-100">
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="text-xl font-semibold text-gray-900">Product Variants</h2>
                    <button
                        type="button"
                        onClick={handleAddVariant}
                        className="flex items-center gap-2 text-[#511624] bg-[#511624]/5 hover:bg-[#511624]/10 px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                    >
                        <Plus size={16} />
                        Add Variant
                    </button>
                </div>

                <div className="space-y-4">
                    {formData.variants.map((variant, index) => (
                        <div key={index} className="flex gap-4 items-start p-5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm relative group">
                            <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-300 group-hover:bg-[#511624] transition-colors" />
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        Size Label
                                    </label>
                                    <input
                                        type="text"
                                        value={variant.size_label}
                                        onChange={(e) => handleVariantChange(index, 'size_label', e.target.value)}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624] focus:border-transparent text-sm"
                                        placeholder="e.g., 100ML"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        Price (LE)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)}
                                            className="w-full pl-8 px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624] focus:border-transparent text-sm"
                                            min="0"
                                            step="1"
                                            required
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">LE</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        value={variant.stock_quantity}
                                        onChange={(e) => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)}
                                        className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#511624] focus:border-transparent text-sm"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                            {formData.variants.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveVariant(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-6"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 sticky bottom-0 bg-gray-50/90 backdrop-blur-sm p-4 border-t z-10">
                <Link
                    href="/dashboard/products"
                    className="px-6 py-3 text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-8 py-3 bg-[#511624] text-white rounded-lg hover:bg-[#511624]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-md flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                    {mode === 'create' ? 'Create Product' : 'Update Product'}
                </button>
            </div>
        </form>
    );
}
