import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant, CartItem, CartSummary } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Cart drawer state
  deliveryZone: 'inside_dhaka' | 'outside_dhaka';
  couponCode: string;
  couponDiscount: number;

  // Actions
  addItem: (product: Product, quantity?: number, selectedVariant?: ProductVariant) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setDeliveryZone: (zone: 'inside_dhaka' | 'outside_dhaka') => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  setIsOpen: (isOpen: boolean) => void;
  toggleCart: () => void;

  // Computed summary
  getSummary: () => CartSummary;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      deliveryZone: 'inside_dhaka',
      couponCode: '',
      couponDiscount: 0,

      addItem: (product, quantity = 1, selectedVariant) => {
        const items = [...get().items];
        const itemId = selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id;
        const unitPrice = selectedVariant?.discountPrice ?? selectedVariant?.price ?? product.discountPrice ?? product.regularPrice;

        const existingIndex = items.findIndex((i) => i.id === itemId);

        if (existingIndex > -1) {
          items[existingIndex].quantity += quantity;
          items[existingIndex].totalPrice = items[existingIndex].quantity * unitPrice;
        } else {
          items.push({
            id: itemId,
            product,
            quantity,
            selectedVariant,
            unitPrice,
            totalPrice: unitPrice * quantity,
          });
        }

        set({ items, isOpen: true }); // Automatically open cart drawer on add
      },

      removeItem: (itemId) => {
        set({ items: get().items.filter((i) => i.id !== itemId) });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        const items = get().items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            };
          }
          return item;
        });
        set({ items });
      },

      clearCart: () => {
        set({ items: [], couponCode: '', couponDiscount: 0 });
      },

      setDeliveryZone: (deliveryZone) => {
        set({ deliveryZone });
      },

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'PRODHAN10') {
          set({ couponCode: clean, couponDiscount: 10 }); // 10% off
          return true;
        } else if (clean === 'FIRST500') {
          set({ couponCode: clean, couponDiscount: 500 }); // ৳500 flat off
          return true;
        }
        return false;
      },

      removeCoupon: () => {
        set({ couponCode: '', couponDiscount: 0 });
      },

      setIsOpen: (isOpen) => set({ isOpen }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getSummary: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
        const totalItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

        // Delivery calculation
        const deliveryCharge = totalItemsCount === 0 ? 0 : state.deliveryZone === 'inside_dhaka' ? 60 : 120;

        // Discount calculation
        let discountTotal = 0;
        if (state.couponDiscount > 0) {
          if (state.couponDiscount <= 100) {
            // percentage
            discountTotal = Math.round((subtotal * state.couponDiscount) / 100);
          } else {
            // fixed amount
            discountTotal = state.couponDiscount;
          }
        }

        const grandTotal = Math.max(0, subtotal + deliveryCharge - discountTotal);

        return {
          items: state.items,
          subtotal,
          deliveryCharge,
          discountTotal,
          grandTotal,
          totalItemsCount,
        };
      },
    }),
    {
      name: 'prodhan_cart_store',
      partialize: (state) => ({
        items: state.items,
        deliveryZone: state.deliveryZone,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);
