import { Campaign } from '../types';
import { mockCampaigns } from '../data/mockData';
import { storage } from '../utils';

const STORAGE_KEY = 'ordhosoto_campaigns_v2';

function getStoredCampaigns(): Campaign[] {
  const stored = storage.get<Campaign[]>(STORAGE_KEY, []);
  if (!stored || stored.length === 0) {
    storage.set(STORAGE_KEY, mockCampaigns);
    return mockCampaigns;
  }
  return stored;
}

export const campaignService = {
  async getAll(): Promise<Campaign[]> {
    return getStoredCampaigns();
  },

  async getActive(): Promise<Campaign[]> {
    const list = getStoredCampaigns();
    return list.filter((c) => c.isActive);
  },

  async getBySlug(slug: string): Promise<Campaign | null> {
    const list = getStoredCampaigns();
    return list.find((c) => c.slug === slug) || null;
  },

  async create(data: Omit<Campaign, 'id'>): Promise<Campaign> {
    const list = getStoredCampaigns();
    const newCamp: Campaign = {
      ...data,
      id: `camp-${Date.now()}`,
    };
    storage.set(STORAGE_KEY, [newCamp, ...list]);
    return newCamp;
  },

  async update(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const list = getStoredCampaigns();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;
    list[index] = { ...list[index], ...updates };
    storage.set(STORAGE_KEY, list);
    return list[index];
  },

  async delete(id: string): Promise<boolean> {
    const list = getStoredCampaigns();
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length === list.length) return false;
    storage.set(STORAGE_KEY, filtered);
    return true;
  },
};
