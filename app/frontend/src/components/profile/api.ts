import { mockApiResponses } from '../../data/mockData';
import type { Profile } from '../../types';

const API_URL = 'http://localhost:5000';

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    // Use mock data for Day 3 — will connect to backend in Day 4
    return mockApiResponses.getProfile();
  },

  updateProfile: async (profileData: Partial<Profile>): Promise<Profile> => {
    // Use mock data for Day 3 — will connect to backend in Day 4
    return mockApiResponses.updateProfile(profileData);
  },

  uploadAvatar: async (file: File): Promise<{ avatar_url: string }> => {
    // Use mock data for Day 3 — will connect to backend in Day 4
    return mockApiResponses.uploadAvatar(file);
  },

  // Real API calls (for Day 4 backend integration):
  _getProfileReal: async () => {
    const response = await fetch(`${API_URL}/profile`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    return response.json();
  },

  _updateProfileReal: async (profileData: Partial<Profile>) => {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};
