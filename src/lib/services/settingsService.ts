import { SiteSettings } from '../types';
import { mockSiteSettings } from '../data/mockData';
import { storage } from '../utils';

const SETTINGS_STORAGE_KEY = 'ordhosoto_site_settings_v3';

export const settingsService = {
  getSettings(): SiteSettings {
    const saved = storage.get<SiteSettings | null>(SETTINGS_STORAGE_KEY, null);
    if (!saved) {
      return mockSiteSettings;
    }

    // Merge saved settings with default mockSiteSettings to ensure all fields & socialChannels exist
    return {
      ...mockSiteSettings,
      ...saved,
      socialChannels: {
        ...mockSiteSettings.socialChannels,
        ...(saved.socialChannels || {}),
      },
      socialLinks: {
        ...mockSiteSettings.socialLinks,
        ...(saved.socialLinks || {}),
      },
    };
  },

  updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated: SiteSettings = {
      ...current,
      ...updates,
      socialChannels: {
        ...current.socialChannels,
        ...(updates.socialChannels || {}),
      },
      socialLinks: {
        ...current.socialLinks,
        ...(updates.socialLinks || {}),
      },
    };

    storage.set(SETTINGS_STORAGE_KEY, updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ordhosoto_settings_updated', { detail: updated }));
    }

    return updated;
  },

  resetDefaults(): SiteSettings {
    storage.set(SETTINGS_STORAGE_KEY, mockSiteSettings);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ordhosoto_settings_updated', { detail: mockSiteSettings }));
    }
    return mockSiteSettings;
  },
};

