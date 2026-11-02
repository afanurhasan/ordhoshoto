// ==========================================
// CORE DOMAIN TYPES & INTERFACES
// ==========================================

export type Currency = 'BDT';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  parentId?: string | null;
  subcategories?: Category[];
  isFeatured?: boolean;
  orderCount?: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isPopular?: boolean;
  website?: string;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Color: Midnight Blue", "RAM: 16GB"
  sku: string;
  price: number;
  discountPrice?: number;
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  sku: string;
  regularPrice: number;
  discountPrice?: number;
  stock: number;
  categoryId: string;
  category?: Category;
  subcategoryId?: string;
  subcategory?: Category;
  brandId?: string;
  brand?: Brand;
  images: string[];
  thumbnail: string;
  isFeatured?: boolean;
  isHot?: boolean;
  isNewArrival?: boolean;
  isFlashSale?: boolean;
  rating: number;
  totalReviews: number;
  status: 'active' | 'draft' | 'out_of_stock' | 'archived';
  specifications?: Record<string, string>;
  warrantyInfo?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: string; // unique cart item id (product id + variant id)
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  unitPrice: number;
  totalPrice: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discountTotal: number;
  grandTotal: number;
  totalItemsCount: number;
}

// Customer & Auth Types
export type UserRole = 'customer' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  addresses: Address[];
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface Address {
  id: string;
  title: string; // Home, Office, etc.
  fullName: string;
  phone: string;
  alternativePhone?: string;
  street: string;
  city: string;
  district: string;
  division: string;
  postalCode?: string;
  isDefault?: boolean;
}

// Order Types
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'card';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
  city: string;
  district: string;
  division: string;
  deliveryZone: 'inside_dhaka' | 'outside_dhaka' | 'express';
  orderNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "PRD-2026-1042"
  userId?: string | null; // null for guest checkout
  isGuest: boolean;
  customerInfo: CustomerOrderInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    note?: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// Campaign & Promotion Types
export interface Campaign {
  id: string;
  title: string;
  slug: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  discountPercentage?: number;
  isActive: boolean;
  productIds: string[];
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  hotline: string;
  whatsapp: string;
  email: string;
  address: string;
  corporateOffice?: string;
  factoryAddress?: string;
  logoUrl?: string;
  insideDhakaShippingFee: number;
  outsideDhakaShippingFee: number;
  currencySymbol: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    instagram?: string;
  };
}

// Admin Dashboard Metrics
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  guestOrdersCount: number;
}
