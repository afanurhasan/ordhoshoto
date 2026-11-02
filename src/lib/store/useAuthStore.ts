import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { userService } from '../services/userService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;

  // Actions
  login: (emailOrPhone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  loginAsAdmin: () => Promise<void>;
  register: (data: {
    name: string;
    phone: string;
    password?: string;
    address?: string;
    email?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,

      login: async (emailOrPhone: string, password?: string) => {
        const res = await userService.login(emailOrPhone, password);
        if (res.success && res.user) {
          set({
            user: res.user,
            isAuthenticated: true,
            isAdmin: res.user.role === 'admin',
          });
          return { success: true };
        }
        return { success: false, message: res.message || 'Login failed' };
      },

      loginAsAdmin: async () => {
        const users = await userService.getAll();
        const adminUser = users.find((u) => u.role === 'admin') || {
          id: 'admin-super',
          name: 'Tauhid Admin',
          email: 'admin@prodhan.com',
          phone: '01711223344',
          role: 'admin' as const,
          addresses: [],
          createdAt: new Date().toISOString(),
        };
        set({
          user: adminUser,
          isAuthenticated: true,
          isAdmin: true,
        });
      },

      register: async (data) => {
        const res = await userService.register(data);
        if (res.success && res.user) {
          set({
            user: res.user,
            isAuthenticated: true,
            isAdmin: false,
          });
          return { success: true };
        }
        return { success: false, message: res.message || 'Registration failed' };
      },

      logout: () => {
        userService.logout();
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          isAdmin: user?.role === 'admin',
        });
      },
    }),
    {
      name: 'prodhan_auth_store',
    }
  )
);
