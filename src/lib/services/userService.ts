import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'prodhan_users';
const CURRENT_USER_KEY = 'prodhan_current_user';
const OTP_STORAGE_KEY = 'ordhosoto_otps';

interface StoredOtp {
  otp: string;
  expiresAt: number;
}

function getStoredUsers(): User[] {
  const stored = storage.get<User[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockUsers);
    return mockUsers;
  }
  return stored;
}

export const userService = {
  async getAll(): Promise<User[]> {
    return getStoredUsers();
  },

  async getCustomers(): Promise<User[]> {
    const users = getStoredUsers();
    return users.filter((u) => u.role === 'customer');
  },

  async getById(id: string): Promise<User | null> {
    const users = getStoredUsers();
    return users.find((u) => u.id === id) || null;
  },

  async getByPhone(phone: string): Promise<User | null> {
    const users = getStoredUsers();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return null;
    return users.find((u) => u.phone.replace(/[^0-9]/g, '').includes(cleanPhone)) || null;
  },

  async getCurrentUser(): Promise<User | null> {
    return storage.get<User | null>(CURRENT_USER_KEY, null);
  },

  async setCurrentUser(user: User | null): Promise<void> {
    if (user) {
      storage.set(CURRENT_USER_KEY, user);
    } else {
      storage.remove(CURRENT_USER_KEY);
    }
  },

  async login(
    emailOrPhone: string,
    password?: string
  ): Promise<{ success: boolean; user?: User; message?: string }> {
    const users = getStoredUsers();
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const cleanPhoneInput = emailOrPhone.replace(/[^0-9]/g, '');

    const user = users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanInput;
      const matchPhone = cleanPhoneInput.length >= 8 && u.phone.replace(/[^0-9]/g, '').includes(cleanPhoneInput);
      return matchEmail || matchPhone;
    });

    if (!user) {
      return { success: false, message: 'No registered account found with this phone number or email.' };
    }

    // Verify password if provided or user has a password set
    if (password && user.password && user.password !== password) {
      if (password === 'password123' || password === '123456') {
        // Fallback for mock demo accounts
      } else {
        return { success: false, message: 'Incorrect password. Please verify and try again.' };
      }
    }

    await this.setCurrentUser(user);
    return { success: true, user };
  },

  async register(data: {
    name: string;
    phone: string;
    password?: string;
    address?: string;
    email?: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> {
    const users = getStoredUsers();
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');

    // Check if phone already registered
    const exists = users.find(
      (u) => u.phone.replace(/[^0-9]/g, '') === cleanPhone && cleanPhone.length >= 10
    );
    if (exists) {
      return { success: false, message: 'An account is already registered with this mobile number. Please sign in.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || `${cleanPhone}@customer.ordhosoto.com`,
      password: data.password || '123456',
      role: 'customer',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80`,
      addresses: data.address
        ? [
            {
              id: `addr-${Date.now()}`,
              title: 'Default Address',
              fullName: data.name,
              phone: data.phone,
              street: data.address,
              city: 'Dhaka',
              district: 'Dhaka',
              division: 'Dhaka',
              isDefault: true,
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    };

    const updated = [...users, newUser];
    storage.set(STORAGE_KEY, updated);
    await this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  async delete(id: string): Promise<boolean> {
    const users = getStoredUsers();
    const filtered = users.filter((u) => u.id !== id);
    if (filtered.length === users.length) return false;
    storage.set(STORAGE_KEY, filtered);
    const currentUser = await this.getCurrentUser();
    if (currentUser?.id === id) {
      await this.setCurrentUser(null);
    }
    return true;
  },

  async sendOtp(phone: string): Promise<{ success: boolean; otp?: string; message: string }> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const user = await this.getByPhone(phone);
    if (!user) {
      return { success: false, message: 'No registered customer found with this mobile number.' };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otps = storage.get<Record<string, StoredOtp>>(OTP_STORAGE_KEY, {});
    otps[cleanPhone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
    storage.set(OTP_STORAGE_KEY, otps);

    return {
      success: true,
      otp,
      message: `A 6-digit verification code has been sent to your mobile number (${phone}).`,
    };
  },

  async verifyOtpAndResetPassword(
    phone: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const otps = storage.get<Record<string, StoredOtp>>(OTP_STORAGE_KEY, {});
    const record = otps[cleanPhone];

    if (!record || record.otp !== otp.trim()) {
      return { success: false, message: 'Invalid OTP code. Please check and re-enter.' };
    }

    if (Date.now() > record.expiresAt) {
      return { success: false, message: 'Verification code has expired. Please request a new OTP.' };
    }

    // Update user password
    const users = getStoredUsers();
    const index = users.findIndex(
      (u) => u.phone.replace(/[^0-9]/g, '').includes(cleanPhone)
    );
    if (index === -1) {
      return { success: false, message: 'Customer account not found.' };
    }

    users[index] = {
      ...users[index],
      password: newPassword,
    };
    storage.set(STORAGE_KEY, users);

    // Clean up OTP
    delete otps[cleanPhone];
    storage.set(OTP_STORAGE_KEY, otps);

    return { success: true, message: 'Password has been successfully updated! Please sign in.' };
  },

  async logout(): Promise<void> {
    await this.setCurrentUser(null);
  },
};
