'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import { Product, Category } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New product form
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  async function loadData() {
    const [prods, cats] = await Promise.all([
      productService.getAll(),
      categoryService.getAll(),
    ]);
    setProducts(prods);
    setCategories(cats);
    if (cats.length > 0) {
      setCategoryId((prev) => prev || cats[0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || regularPrice <= 0) return;

    await productService.create({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sku: sku || `ORD-${Date.now().toString().slice(-4)}`,
      regularPrice: Number(regularPrice),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      stock: Number(stock),
      categoryId,
      subcategoryId: subcategoryId || undefined,
      images: [imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80'],
      thumbnail: imageUrl || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80',
      description: description || 'প্রিমিয়াম কোয়ালিটি ফ্যাব্রিক ও নিখুঁত ফিনিশিং।',
      isFeatured,
      rating: 5.0,
      totalReviews: 1,
      status: 'active',
    });

    setIsModalOpen(false);
    // Reset
    setName('');
    setSku('');
    setRegularPrice(0);
    setDiscountPrice(undefined);
    setImageUrl('');
    setSubcategoryId('');
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productService.delete(id);
      loadData();
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit prices, update stock, and control featured highlights
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-primary-500"
          />
        </div>
        <span className="text-xs text-slate-500 font-semibold">{filtered.length} Products Found</span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Regular Price</th>
                <th className="px-6 py-3.5">Discount Price</th>
                <th className="px-6 py-3.5">Stock</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                        <Image
                          src={product.thumbnail || product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <span className="font-bold text-slate-900 block truncate">{product.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {product.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800 block">
                      {product.category?.name || 'Fashion'}
                    </span>
                    {product.subcategory?.name && (
                      <span className="inline-block mt-0.5 text-[10px] font-medium text-primary-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {product.subcategory.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {formatPrice(product.regularPrice)}
                  </td>
                  <td className="px-6 py-4 font-bold text-primary-600">
                    {product.discountPrice ? formatPrice(product.discountPrice) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    {product.stock <= 0 ? (
                      <Badge variant="danger" size="sm">Out of Stock</Badge>
                    ) : product.stock <= 5 ? (
                      <Badge variant="warning" size="sm">{product.stock} (Low)</Badge>
                    ) : (
                      <span className="font-bold text-slate-800">{product.stock} units</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={product.status === 'active' ? 'success' : 'neutral'} dot size="sm">
                      {product.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete Product"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product" maxWidth="lg">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. অর্ধশত রয়েল কটন এমব্রয়ডারি পাঞ্জাবি"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">SKU</label>
              <input
                type="text"
                placeholder="e.g. ORD-PANJ-001"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Regular Price (৳) *</label>
              <input
                type="number"
                required
                min={1}
                placeholder="2450"
                value={regularPrice || ''}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Discount Price (৳)</label>
              <input
                type="number"
                min={0}
                placeholder="2150"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Subcategory <span className="text-slate-400 font-normal">(ঐচ্ছিক)</span>
              </label>
              {(() => {
                const currentCat = categories.find((c) => c.id === categoryId);
                const subcats = currentCat?.subcategories || [];
                return (
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    disabled={subcats.length === 0}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  >
                    <option value="">
                      {subcats.length > 0 ? '-- Select Subcategory --' : 'No Subcategories'}
                    </option>
                    {subcats.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                );
              })()}
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Description</label>
            <textarea
              rows={2}
              placeholder="পণ্যের সংক্ষিপ্ত বিবরণ ও বৈশিষ্ট্য..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 outline-none focus:border-primary-500 text-xs resize-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 text-primary-600 rounded border-slate-300"
            />
            <label htmlFor="isFeatured" className="font-bold text-slate-700 cursor-pointer">
              Mark as Featured Product on Homepage
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
            >
              Save Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
