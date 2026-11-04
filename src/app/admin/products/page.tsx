'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import { orderService } from '@/lib/services/orderService';
import { Product, Category } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';
import { Plus, Search, Trash2, Edit3, Upload, CheckCircle2, Eye, Flame, Sparkles } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [salesMap, setSalesMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<'all' | 'active' | 'inactive' | 'flashSale' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Product form states
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [sku, setSku] = useState('');
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [warrantyInfo, setWarrantyInfo] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);
  const [newProductStatus, setNewProductStatus] = useState<'active' | 'inactive'>('active');
  const [specsList, setSpecsList] = useState<{ key: string; val: string }[]>([]);

  async function loadData() {
    const [prods, cats, sMap] = await Promise.all([
      productService.getAll({ includeInactive: true }),
      categoryService.getAll(),
      orderService.getSalesCountsMap(),
    ]);
    setProducts(prods);
    setCategories(cats);
    setSalesMap(sMap);
    if (cats.length > 0) {
      setCategoryId((prev) => prev || cats[0].id);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = async (id: string) => {
    await productService.toggleStatus(id);
    loadData();
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setShortDescription('');
    setSku('');
    setRegularPrice(0);
    setDiscountPrice(undefined);
    setStock(10);
    setCategoryId(categories[0]?.id || '');
    setSubcategoryId('');
    setImageUrl('');
    setWarrantyInfo('100% Authentic Quality Guarantee');
    setDescription('');
    setIsFeatured(false);
    setIsFlashSale(false);
    setNewProductStatus('active');
    setSpecsList([
      { key: 'Origin', val: 'Bangladesh' },
      { key: 'Packaging', val: 'Standard Packaging' },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setShortDescription(p.shortDescription || '');
    setSku(p.sku || '');
    setRegularPrice(p.regularPrice);
    setDiscountPrice(p.discountPrice);
    setStock(p.stock);
    setCategoryId(p.categoryId);
    setSubcategoryId(p.subcategoryId || '');
    setImageUrl(p.thumbnail || p.images[0] || '');
    setWarrantyInfo(p.warrantyInfo || '');
    setDescription(p.description || '');
    setIsFeatured(!!p.isFeatured);
    setIsFlashSale(!!p.isFlashSale);
    setNewProductStatus(p.status === 'inactive' ? 'inactive' : 'active');
    if (p.specifications && Object.keys(p.specifications).length > 0) {
      setSpecsList(Object.entries(p.specifications).map(([key, val]) => ({ key, val })));
    } else {
      setSpecsList([{ key: '', val: '' }]);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WEBP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const rawDataUrl = loadEvent.target?.result as string;
      if (!rawDataUrl) return;

      // Optimize & downscale via canvas to keep Base64 size small (<120KB) and prevent localStorage overflow
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 900;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          setImageUrl(compressed);
        } else {
          setImageUrl(rawDataUrl);
        }
      };
      img.onerror = () => {
        setImageUrl(rawDataUrl);
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || regularPrice <= 0) return;

    // Convert specsList to dictionary
    const specifications: Record<string, string> = {};
    specsList.forEach((s) => {
      if (s.key.trim()) {
        specifications[s.key.trim()] = s.val.trim();
      }
    });

    const finalPhoto =
      imageUrl ||
      editingProduct?.thumbnail ||
      editingProduct?.images?.[0] ||
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80';

    if (editingProduct) {
      // Edit existing product
      await productService.update(editingProduct.id, {
        name,
        shortDescription: shortDescription || undefined,
        sku: sku || editingProduct.sku,
        regularPrice: Number(regularPrice),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock: Number(stock),
        categoryId,
        subcategoryId: subcategoryId || undefined,
        images: [finalPhoto],
        thumbnail: finalPhoto,
        warrantyInfo: warrantyInfo || undefined,
        description: description || editingProduct.description,
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
        isFeatured,
        isFlashSale,
        status: newProductStatus,
      });
    } else {
      // Create new product
      await productService.create({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        shortDescription: shortDescription || undefined,
        sku: sku || `ORD-${Date.now().toString().slice(-4)}`,
        regularPrice: Number(regularPrice),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        stock: Number(stock),
        categoryId,
        subcategoryId: subcategoryId || undefined,
        images: [finalPhoto],
        thumbnail: finalPhoto,
        warrantyInfo: warrantyInfo || undefined,
        description: description || 'Premium quality and superior finish.',
        specifications: Object.keys(specifications).length > 0 ? specifications : undefined,
        isFeatured,
        isFlashSale,
        rating: 5.0,
        totalReviews: 1,
        status: newProductStatus,
      });
    }

    setIsModalOpen(false);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await productService.delete(id);
      loadData();
    }
  };

  const handleToggleFlashSale = async (id: string) => {
    await productService.toggleFlashSale(id);
    loadData();
  };

  const filtered = products
    .filter((p) => {
      if (adminStatusFilter === 'active') return p.status === 'active';
      if (adminStatusFilter === 'inactive') return p.status === 'inactive';
      if (adminStatusFilter === 'flashSale') return !!p.isFlashSale;
      if (adminStatusFilter === 'featured') return !!p.isFeatured;
      return true;
    })
    .filter((p) => {
      if (categoryFilter !== 'all') {
        return p.categoryId === categoryFilter;
      }
      return true;
    })
    .filter(
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
          <p className="text-xs text-slate-900 font-medium mt-0.5">
            Create, edit prices, update stock, and control featured highlights
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative max-w-sm w-full">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-900" />
            <input
              type="text"
              placeholder="Search by title or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          {/* Status & Deals Filter */}
          <select
            value={adminStatusFilter}
            onChange={(e) => setAdminStatusFilter(e.target.value as any)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-white outline-none focus:border-primary-500 w-full sm:w-auto"
          >
            <option value="all">All Products</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="flashSale">Super Flash Deals (🔥)</option>
            <option value="featured">Featured Products (⭐)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-white outline-none focus:border-primary-500 w-full sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-900 font-bold self-end sm:self-auto">
          {filtered.length} Products Found
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-900 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Product</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Regular Price</th>
                <th className="px-6 py-3.5">Discount Price</th>
                <th className="px-6 py-3.5">Stock &amp; Sales</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="relative h-12 w-12 rounded-lg bg-slate-50 border border-slate-200 overflow-hidden shrink-0 block hover:opacity-90 transition"
                        title="View details & sales history"
                      >
                        <Image
                          src={product.thumbnail || product.images[0] || '/logo.png'}
                          alt={product.name}
                          fill
                          unoptimized={typeof (product.thumbnail || product.images?.[0]) === 'string' && (product.thumbnail || product.images?.[0]).startsWith('data:')}
                          className="object-contain p-1"
                          sizes="48px"
                        />
                      </Link>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="font-bold text-slate-900 block truncate hover:text-primary-600 transition"
                          title="View details & sales history"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-slate-900 font-mono font-bold block">SKU: {product.sku}</span>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleToggleFlashSale(product.id)}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition border cursor-pointer select-none",
                              product.isFlashSale
                                ? "bg-orange-500 text-white border-orange-600 hover:bg-orange-600 shadow-xs"
                                : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                            )}
                            title={product.isFlashSale ? "In Super Flash Deals (Click to remove)" : "Click to add to Super Flash Deals"}
                          >
                            <Flame className={cn("h-3 w-3", product.isFlashSale ? "fill-white text-white" : "text-slate-400")} />
                            <span>{product.isFlashSale ? "Flash Deal" : "+ Flash Deal"}</span>
                          </button>
                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                              <Sparkles className="h-2.5 w-2.5 text-amber-600" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 block">
                      {product.category?.name || 'Fashion'}
                    </span>
                    {product.subcategory?.name && (
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-primary-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                        {product.subcategory.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">
                    {formatPrice(product.regularPrice)}
                  </td>
                  <td className="px-6 py-4 font-black text-primary-600">
                    {product.discountPrice ? formatPrice(product.discountPrice) : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                      {product.stock <= 0 ? (
                        <Badge variant="danger" size="sm">Out of Stock</Badge>
                      ) : product.stock <= 5 ? (
                        <Badge variant="warning" size="sm">{product.stock} (Low)</Badge>
                      ) : (
                        <span className="font-bold text-slate-900 block">{product.stock} in stock</span>
                      )}
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                        title="Click to view sales history"
                      >
                        <span>{salesMap[product.id] || 0} sold</span>
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(product.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-xs select-none cursor-pointer',
                        product.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-300 hover:bg-slate-200'
                      )}
                      title={product.status === 'active' ? 'Click to deactivate' : 'Click to activate'}
                    >
                      {/* Animated switch toggle */}
                      <span
                        className={cn(
                          'relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out',
                          product.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'
                        )}
                      >
                        <span
                          className={cn(
                            'inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out shadow-xs',
                            product.status === 'active' ? 'translate-x-3.5' : 'translate-x-0.5'
                          )}
                        />
                      </span>

                      <span>{product.status === 'active' ? 'Active' : 'Inactive'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="p-1.5 text-slate-700 hover:text-primary-600 hover:bg-orange-50 rounded-lg transition"
                        title="View Product Sales & Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(product)}
                        className="p-1.5 text-slate-700 hover:text-primary-600 hover:bg-orange-50 rounded-lg transition"
                        title="Edit Product Details & Specifications"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product Details & Specifications" : "Add New Product"}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Authentic Bogura Special Shahi Doi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Short Description / Highlights
            </label>
            <input
              type="text"
              placeholder="e.g. 100% Pure Cow Milk, Traditional Bogura Recipe, Clay Pot Sealed."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-900 block mb-1">SKU</label>
              <input
                type="text"
                placeholder="e.g. ORD-ORG-DOI01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-900 block mb-1">Stock Quantity *</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Regular Price (BDT) *</label>
              <input
                type="number"
                required
                min={1}
                placeholder="380"
                value={regularPrice || ''}
                onChange={(e) => setRegularPrice(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-bold text-slate-900 block mb-1">Discount Price (BDT)</label>
              <input
                type="number"
                min={0}
                placeholder="320"
                value={discountPrice || ''}
                onChange={(e) => setDiscountPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-900 block mb-1">Category *</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-900 block mb-1">
                Subcategory (Optional)
              </label>
              {(() => {
                const currentCat = categories.find((c) => c.id === categoryId);
                const subcats = currentCat?.subcategories || [];
                return (
                  <select
                    value={subcategoryId}
                    onChange={(e) => setSubcategoryId(e.target.value)}
                    disabled={subcats.length === 0}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium disabled:bg-slate-100 disabled:text-slate-400"
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
            <label className="font-bold text-slate-900 block mb-1">Quality &amp; Guarantee Note</label>
            <input
              type="text"
              placeholder="e.g. 100% Fresh Delivery Guarantee in Temperature-Controlled Packaging"
              value={warrantyInfo}
              onChange={(e) => setWarrantyInfo(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          {/* Product Specifications & Details Editor */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 text-xs block">
                  Product Details &amp; Specifications
                </label>
                <span className="text-[11px] text-slate-900 font-medium">
                  e.g. Origin, Ingredients, Packaging, ShelfLife, Preservatives
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSpecsList((prev) => [...prev, { key: '', val: '' }])}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-900 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition flex items-center gap-1 shadow-2xs"
              >
                <Plus className="h-3 w-3" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specsList.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Field Name (e.g. Origin)"
                    value={spec.key}
                    onChange={(e) => {
                      const updated = [...specsList];
                      updated[index].key = e.target.value;
                      setSpecsList(updated);
                    }}
                    className="w-1/3 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500 font-bold text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Sajahanpur, Bogura)"
                    value={spec.val}
                    onChange={(e) => {
                      const updated = [...specsList];
                      updated[index].val = e.target.value;
                      setSpecsList(updated);
                    }}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-primary-500 font-medium text-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSpecsList(specsList.filter((_, i) => i !== index));
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    title="Remove specification"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Full Product Description</label>
            <textarea
              rows={2}
              placeholder="Enter detailed product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2 outline-none focus:border-primary-500 text-xs text-slate-900 font-medium resize-none"
            />
          </div>

          {/* Product Image Uploader (Direct from Computer) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-900 text-xs block">
                  Product Image
                </label>
                <span className="text-[11px] text-slate-900 font-medium">
                  Thumbnail and product details page will display the same image
                </span>
              </div>
            </div>

            {imageUrl ? (
              <div className="relative rounded-xl border border-primary-200 bg-white p-3.5 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                  <Image
                    src={imageUrl}
                    alt="Product preview"
                    fill
                    unoptimized={typeof imageUrl === 'string' && imageUrl.startsWith('data:')}
                    className="object-contain p-1.5"
                    sizes="96px"
                  />
                </div>

                <div className="flex-1 space-y-1.5 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Image Attached (Thumbnail &amp; Details)</span>
                  </div>
                  <p className="text-[11px] text-slate-900 font-medium truncate max-w-sm">
                    {imageUrl.startsWith('data:') ? 'Uploaded Image (Optimized)' : imageUrl}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                    <label className="cursor-pointer bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-[11px] px-3 py-1.5 rounded-lg border border-primary-200 transition shadow-2xs inline-flex items-center gap-1.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Change Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition"
                    >
                      Remove Image
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label className="group flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-primary-500 rounded-xl bg-white hover:bg-orange-50/20 cursor-pointer transition text-center">
                <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-900">
                  Click to upload image from computer
                </p>
                <p className="text-[11px] text-slate-900 font-medium mt-0.5">
                  JPG, PNG, WEBP - Automatically applies to thumbnail and details page
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            )}

            {/* Optional URL input toggle */}
            <div className="pt-1">
              <details className="text-[11px] text-slate-900 font-medium">
                <summary className="cursor-pointer hover:text-primary-600 select-none font-bold">
                  Or enter image URL (Optional)
                </summary>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-2 w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-500 text-slate-900 font-medium"
                />
              </details>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Product Status</label>
            <select
              value={newProductStatus}
              onChange={(e) => setNewProductStatus(e.target.value as 'active' | 'inactive')}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-bold"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="space-y-3 pt-2">
            {/* Super Flash Deals Spotlight Toggle */}
            <div className="p-3.5 bg-gradient-to-r from-orange-50 via-amber-50 to-white border border-orange-200 rounded-2xl">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFlashSale"
                  checked={isFlashSale}
                  onChange={(e) => setIsFlashSale(e.target.checked)}
                  className="h-4 w-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500 cursor-pointer"
                />
                <label htmlFor="isFlashSale" className="font-bold text-slate-900 cursor-pointer flex items-center gap-1.5 text-xs">
                  <Flame className="h-4 w-4 text-orange-600 fill-orange-500" />
                  <span>Include in Super Flash Deals (Homepage Spotlight)</span>
                </label>
              </div>
              <p className="text-[11px] text-slate-700 font-medium pl-6 mt-1">
                Display this product in the &ldquo;Super Flash Deals&rdquo; section on the homepage.
              </p>
            </div>

            {/* Featured Product Toggle */}
            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 text-primary-600 rounded border-slate-300 cursor-pointer"
              />
              <label htmlFor="isFeatured" className="font-bold text-slate-900 cursor-pointer flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Mark as Featured Product on Homepage</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition shadow"
            >
              {editingProduct ? 'Save Changes' : 'Save Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
