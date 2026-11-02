import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchModalOpen: boolean;
  isCategoryMenuOpen: boolean;
  quickViewProductId: string | null;

  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setSearchModalOpen: (open: boolean) => void;
  setCategoryMenuOpen: (open: boolean) => void;
  toggleCategoryMenu: () => void;
  setQuickViewProductId: (id: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,
  isCategoryMenuOpen: false,
  quickViewProductId: null,

  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  setSearchModalOpen: (isSearchModalOpen) => set({ isSearchModalOpen }),
  setCategoryMenuOpen: (isCategoryMenuOpen) => set({ isCategoryMenuOpen }),
  toggleCategoryMenu: () => set((s) => ({ isCategoryMenuOpen: !s.isCategoryMenuOpen })),
  setQuickViewProductId: (quickViewProductId) => set({ quickViewProductId }),
}));
