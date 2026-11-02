import { Order, OrderStatus, DashboardStats } from '../types';
import { mockOrders, mockProducts, mockUsers } from '../data/mockData';
import { storage, generateOrderNumber } from '../utils';

const STORAGE_KEY = 'ordhosoto_orders_v3';

function getStoredOrders(): Order[] {
  const stored = storage.get<Order[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockOrders);
    return mockOrders;
  }
  return stored;
}

export interface OrderFilterParams {
  status?: OrderStatus | 'all';
  isGuest?: boolean;
  query?: string; // customer name, phone, or orderNumber
  startDate?: string;
  endDate?: string;
}

export const orderService = {
  async getAll(params?: OrderFilterParams): Promise<Order[]> {
    let orders = getStoredOrders();

    if (!params) return orders;

    if (params.status && params.status !== 'all') {
      orders = orders.filter((o) => o.status === params.status);
    }

    if (params.isGuest !== undefined) {
      orders = orders.filter((o) => o.isGuest === params.isGuest);
    }

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerInfo.fullName.toLowerCase().includes(q) ||
          o.customerInfo.phone.toLowerCase().includes(q) ||
          (o.customerInfo.email && o.customerInfo.email.toLowerCase().includes(q))
      );
    }

    if (params.startDate) {
      orders = orders.filter((o) => new Date(o.createdAt) >= new Date(params.startDate!));
    }

    if (params.endDate) {
      orders = orders.filter((o) => new Date(o.createdAt) <= new Date(params.endDate!));
    }

    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getById(id: string): Promise<Order | null> {
    const orders = getStoredOrders();
    return orders.find((o) => o.id === id || o.orderNumber === id) || null;
  },

  async getByUserId(userId: string): Promise<Order[]> {
    const orders = getStoredOrders();
    return orders
      .filter((o) => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async create(orderInput: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order> {
    const orders = getStoredOrders();
    const newOrder: Order = {
      ...orderInput,
      id: `ord-${Date.now()}`,
      orderNumber: generateOrderNumber(),
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          note: orderInput.isGuest ? 'Guest order placed' : 'Order placed by registered user',
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.set(STORAGE_KEY, [newOrder, ...orders]);
    return newOrder;
  },

  async updateStatus(id: string, newStatus: OrderStatus, note?: string): Promise<Order | null> {
    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) return null;

    const existing = orders[index];
    const updatedHistory = [
      ...existing.statusHistory,
      {
        status: newStatus,
        note: note || `Order status updated to ${newStatus}`,
        timestamp: new Date().toISOString(),
      },
    ];

    const updatedOrder: Order = {
      ...existing,
      status: newStatus,
      statusHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    storage.set(STORAGE_KEY, orders);
    return updatedOrder;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const orders = getStoredOrders();
    const products = storage.get(
      'prodhan_products',
      mockProducts
    );
    const users = storage.get('prodhan_users', mockUsers);

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
    const lowStockProducts = products.filter((p: { stock: number }) => p.stock <= 5).length;
    const guestOrdersCount = orders.filter((o) => o.isGuest).length;

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      totalProducts: products.length,
      lowStockProducts,
      totalCustomers: users.filter((u: { role: string }) => u.role === 'customer').length,
      guestOrdersCount,
    };
  },
};
