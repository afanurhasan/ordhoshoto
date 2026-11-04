'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { productService } from '@/lib/services/productService';
import { orderService, ProductSaleRecord } from '@/lib/services/orderService';
import { Product, OrderStatus } from '@/lib/types';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Package,
  DollarSign,
  ShoppingCart,
  PackageCheck,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export default function AdminProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [salesRecords, setSalesRecords] = useState<ProductSaleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    async function loadProductAndSales() {
      if (!id) return;
      setLoading(true);
      try {
        const prod = await productService.getById(id, true);
        if (prod) {
          setProduct(prod);
          const sales = await orderService.getSalesByProductId(prod.id, prod.sku, prod.name);
          setSalesRecords(sales);
        }
      } finally {
        setLoading(false);
      }
    }
    loadProductAndSales();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-24 flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-900 font-bold">Loading product details and sales history...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8">
        <h2 className="text-xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-900 font-medium">The requested product could not be found or may have been deleted.</p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-primary-600 text-white px-5 py-2.5 rounded-xl shadow"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Product Catalog</span>
        </Link>
      </div>
    );
  }

  // Sales statistics calculation
  const totalUnitsSold = salesRecords.reduce((sum, r) => sum + r.quantity, 0);
  const nonCancelledSales = salesRecords.filter((r) => r.orderStatus !== 'cancelled');
  const totalRevenue = nonCancelledSales.reduce((sum, r) => sum + r.subtotal, 0);
  const deliveredUnits = salesRecords
    .filter((r) => r.orderStatus === 'delivered')
    .reduce((sum, r) => sum + r.quantity, 0);

  // Filtered sales records
  const filteredSales = salesRecords
    .filter((record) => {
      if (statusFilter !== 'all' && record.orderStatus !== statusFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        record.orderNumber.toLowerCase().includes(q) ||
        record.customerName.toLowerCase().includes(q) ||
        record.customerPhone.toLowerCase().includes(q) ||
        record.customerCity.toLowerCase().includes(q)
      );
    });

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="primary" dot size="sm">Approved</Badge>;
      case 'processing':
      case 'shipped':
        return <Badge variant="warning" dot size="sm">Processing</Badge>;
      case 'delivered':
        return <Badge variant="success" dot size="sm">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="danger" dot size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" dot size="sm">Pending</Badge>;
    }
  };

  const isDataUrl = (src?: string | null) => typeof src === 'string' && src.startsWith('data:');
  const productImage = product.thumbnail || product.images?.[0] || '/logo.png';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-slate-900 transition shadow-2xs"
            title="Back to Products"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-900 font-medium">
              <Link href="/admin/products" className="hover:text-primary-600">Products</Link>
              <span>/</span>
              <span className="font-bold text-slate-900 truncate max-w-xs">{product.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
              Product Details &amp; Sales History
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-2xs"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary-600" />
            <span>View on Storefront</span>
          </Link>
        </div>
      </div>

      {/* Product Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Product Thumbnail */}
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 shadow-xs flex items-center justify-center p-2">
            <Image
              src={productImage}
              alt={product.name}
              fill
              unoptimized={isDataUrl(productImage)}
              className="object-contain p-2"
              sizes="160px"
            />
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                {product.category?.name || 'Category'}
              </span>
              {product.subcategory?.name && (
                <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {product.subcategory.name}
                </span>
              )}
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md">
                SKU: {product.sku}
              </span>
              <Badge variant={product.status === 'active' ? 'success' : 'neutral'} dot size="sm">
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
              {product.name}
            </h2>

            {product.shortDescription && (
              <p className="text-xs text-slate-900 font-medium leading-relaxed">
                {product.shortDescription}
              </p>
            )}

            <div className="flex flex-wrap items-baseline gap-4 pt-1">
              <div>
                <span className="text-[11px] font-bold text-slate-900 block">Regular Price</span>
                <span className="text-sm font-black text-slate-900">{formatPrice(product.regularPrice)}</span>
              </div>
              {product.discountPrice && (
                <div>
                  <span className="text-[11px] font-bold text-slate-900 block">Discount Price</span>
                  <span className="text-sm font-black text-primary-600">{formatPrice(product.discountPrice)}</span>
                </div>
              )}
              <div>
                <span className="text-[11px] font-bold text-slate-900 block">Current Stock</span>
                <span className="text-sm font-black text-slate-900">{product.stock} units</span>
              </div>
              {product.warrantyInfo && (
                <div>
                  <span className="text-[11px] font-bold text-slate-900 block">Quality Guarantee</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> {product.warrantyInfo}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications if available */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2.5">
              Specifications &amp; Attributes
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-900 block">{key}</span>
                  <span className="font-bold text-slate-900 block truncate mt-0.5">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sales Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sold */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Total Units Sold</span>
            <div className="h-8 w-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalUnitsSold}</div>
          <p className="text-[11px] font-medium text-slate-900">Across all orders</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Total Revenue</span>
            <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600">{formatPrice(totalRevenue)}</div>
          <p className="text-[11px] font-medium text-slate-900">Non-cancelled revenue</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Total Orders</span>
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{salesRecords.length}</div>
          <p className="text-[11px] font-medium text-slate-900">Customer transactions</p>
        </div>

        {/* Delivered Units */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">Delivered Units</span>
            <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <PackageCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{deliveredUnits}</div>
          <p className="text-[11px] font-medium text-slate-900">Successfully completed</p>
        </div>
      </div>

      {/* Sales History Table ("Kobe, Kar Kase, Kotogula Sell Hoise") */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Sales Breakdown &amp; Customer Orders
            </h3>
            <p className="text-xs text-slate-900 font-medium mt-0.5">
              Complete log of when, to whom, and how many units were sold for this product
            </p>
          </div>

          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            {filteredSales.length} Transactions Found
          </span>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-4 w-4 absolute left-3.5 top-3 text-slate-900" />
            <input
              type="text"
              placeholder="Search customer, phone, order #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-primary-500 text-slate-900 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 bg-white outline-none focus:border-primary-500 w-full sm:w-auto"
            >
              <option value="all">All Order Statuses</option>
              <option value="confirmed">Approved</option>
              <option value="processing">Processing</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          {filteredSales.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Package className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">No Sales Records Found</h4>
              <p className="text-xs text-slate-900 font-medium max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'No orders match the selected search or status filter.'
                  : 'When customers place orders for this product, the date, customer details, and quantities sold will be automatically recorded here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-900 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5">Order Info</th>
                    <th className="px-5 py-3.5">Date &amp; Time</th>
                    <th className="px-5 py-3.5">Customer Details</th>
                    <th className="px-5 py-3.5 text-center">Quantity</th>
                    <th className="px-5 py-3.5 text-right">Price &amp; Subtotal</th>
                    <th className="px-5 py-3.5 text-center">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900 font-medium">
                  {filteredSales.map((sale, idx) => (
                    <tr key={`${sale.orderId}-${idx}`} className="hover:bg-slate-50/80 transition">
                      {/* Order Number */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <Link
                          href="/admin/orders"
                          className="font-mono font-black text-primary-600 hover:underline block"
                          title="Open Order in Admin Orders"
                        >
                          #{sale.orderNumber}
                        </Link>
                        <span className="text-[10px] font-bold text-slate-900">
                          {sale.isGuest ? 'Guest Order' : 'Registered User'}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                          <Calendar className="h-3.5 w-3.5 text-slate-900 shrink-0" />
                          <span>{formatDateTime(sale.date)}</span>
                        </div>
                      </td>

                      {/* Customer Details */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <span className="font-black text-slate-900 block">
                            {sale.customerName}
                          </span>
                          <div className="flex items-center gap-1 text-slate-900 font-bold text-[11px]">
                            <Phone className="h-3 w-3 text-primary-600 shrink-0" />
                            <a href={`tel:${sale.customerPhone}`} className="hover:underline">
                              {sale.customerPhone}
                            </a>
                          </div>
                          {sale.deliveryAddress && (
                            <div className="flex items-start gap-1 text-slate-900 font-medium text-[11px] truncate max-w-xs">
                              <MapPin className="h-3 w-3 text-slate-900 shrink-0 mt-0.5" />
                              <span className="truncate">{sale.deliveryAddress}, {sale.customerCity}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Quantity Sold */}
                      <td className="px-5 py-4 text-center">
                        <span className="inline-block bg-orange-50 border border-orange-200 text-primary-700 font-black text-sm px-3 py-1 rounded-xl shadow-2xs">
                          {sale.quantity} units
                        </span>
                      </td>

                      {/* Price & Subtotal */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="font-black text-slate-900 text-sm">
                          {formatPrice(sale.subtotal)}
                        </div>
                        <span className="text-[11px] font-bold text-slate-900 block">
                          {formatPrice(sale.unitPrice)} each
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        {getOrderStatusBadge(sale.orderStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

