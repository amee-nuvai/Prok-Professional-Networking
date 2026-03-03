import { mockApiResponses } from '../../data/mockData';
import type { Profile } from '../../types';

const API_URL = 'http://localhost:5000';

export const profileApi = {
  // ── Mock API (Day 3) — swap for real API in Day 4 ─────────────────────────
  getProfile: async (): Promise<Profile> => {
    return mockApiResponses.getProfile();
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    return mockApiResponses.updateProfile(profileData);
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    return mockApiResponses.uploadAvatar(file);
  },

  // ── Real API calls (Day 4 backend integration) ────────────────────────────
  _getProfileReal: async () => {
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.json();
  },

  _updateProfileReal: async (profileData: Partial<Profile>) => {
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};
