'use client';

import React, { useState, useEffect } from 'react';
import { categoryService } from '@/lib/services/categoryService';
import { Category } from '@/lib/types';
import { Plus, Trash2, Layers, X, Tag } from 'lucide-react';
import { Modal } from '@/components/common/Modal';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Category creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialSubcategories, setInitialSubcategories] = useState('');

  // Subcategory creation modal state
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState<Category | null>(null);
  const [subName, setSubName] = useState('');

  async function loadData() {
    const list = await categoryService.getAll();
    setCategories(list);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Parse initial subcategories if provided
    const parsedSubs: Category[] = initialSubcategories
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => ({
        id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: s,
        slug: s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }));

    await categoryService.create({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: description.trim(),
      isFeatured: true,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80',
      subcategories: parsedSubs.length > 0 ? parsedSubs : undefined,
    });

    setIsModalOpen(false);
    setName('');
    setDescription('');
    setInitialSubcategories('');
    loadData();
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    if (confirm(`Are you sure you want to delete category "${catName}"?`)) {
      await categoryService.delete(id);
      loadData();
    }
  };

  const openAddSubcategoryModal = (cat: Category) => {
    setTargetCategory(cat);
    setSubName('');
    setIsSubModalOpen(true);
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCategory || !subName.trim()) return;

    await categoryService.addSubcategory(targetCategory.id, {
      name: subName.trim(),
    });

    setIsSubModalOpen(false);
    setSubName('');
    setTargetCategory(null);
    loadData();
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string, subNameVal: string) => {
    if (confirm(`Are you sure you want to delete subcategory "${subNameVal}"?`)) {
      await categoryService.deleteSubcategory(categoryId, subcategoryId);
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Category Hierarchy</h1>
          <p className="text-xs text-slate-900 font-medium mt-0.5">
            Manage store categories, navigation mega-menus, and subcategories
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const subCount = cat.subcategories ? cat.subcategories.length : 0;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                      <span className="text-[11px] text-slate-900 font-mono font-medium">/{cat.slug}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="p-1.5 text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title={`Delete ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Subcategories Section */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-primary-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                        Subcategories ({subCount})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAddSubcategoryModal(cat)}
                      className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-bold text-[11px] px-2 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer border border-primary-200"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Sub</span>
                    </button>
                  </div>

                  {subCount > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.subcategories?.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 font-bold text-xs px-2.5 py-1 rounded-lg transition group"
                        >
                          <span>{sub.name}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubcategory(cat.id, sub.id, sub.name)}
                            className="text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full p-0.5 transition"
                            title={`Remove ${sub.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="py-3 px-3 text-center border border-dashed border-slate-300 rounded-xl bg-slate-50">
                      <p className="text-xs text-slate-900 font-medium">No subcategories yet</p>
                      <button
                        type="button"
                        onClick={() => openAddSubcategoryModal(cat)}
                        className="text-primary-600 hover:text-primary-700 font-bold text-xs mt-1 inline-flex items-center gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add first subcategory</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subcategory Modal */}
      <Modal
        isOpen={isSubModalOpen}
        onClose={() => {
          setIsSubModalOpen(false);
          setTargetCategory(null);
        }}
        title={`Add Subcategory to "${targetCategory?.name || ''}"`}
      >
        <form onSubmit={handleAddSubcategory} className="space-y-4 text-xs">
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-3 text-slate-900 font-medium">
            Category: <strong className="font-bold text-slate-900">{targetCategory?.name}</strong>
            <p className="text-[11px] text-slate-900 mt-0.5">
              Newly created subcategories will instantly appear in product forms, category filters, and website navigation.
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Subcategory Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Bogura Special Shahi Doi, Mustard Oil, Cotton Panjabi"
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
            />
            {subName.trim() && (
              <p className="text-[11px] text-slate-900 font-mono mt-1">
                Generated Slug: /{targetCategory?.slug}/
                {subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsSubModalOpen(false);
                setTargetCategory(null);
              }}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-sm transition"
            >
              Add Subcategory
            </button>
          </div>
        </form>
      </Modal>

      {/* Add New Category Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Category">
        <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-900 block mb-1">Category Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Food & Dairy"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">
              Initial Subcategories (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Pure Honey, Mustard Oil, Shahi Doi (comma separated)"
              value={initialSubcategories}
              onChange={(e) => setInitialSubcategories(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
            />
            <p className="text-[11px] text-slate-900 mt-1">
              Separate multiple subcategories with commas. You can also add more later.
            </p>
          </div>

          <div>
            <label className="font-bold text-slate-900 block mb-1">Description</label>
            <textarea
              rows={3}
              placeholder="Brief summary for SEO..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:border-primary-500 bg-white text-slate-900 font-medium"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-sm transition"
            >
              Save Category
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}