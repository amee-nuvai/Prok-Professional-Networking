import type { Profile } from '../../types';

const API_URL = 'http://localhost:5000/api';

const token = "PASTE_VALID_JWT_HERE"; // hardcode a valid JWT for a real user

  // GET PROFILE FROM BACKEND
  // api.ts (example)
export const profileApi = {
  getProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No auth token found');

    const res = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch profile');
    }

    return res.json();
  },

  updateProfile: async (profileData: Partial<Profile>) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update profile');
    }

    return response.json();
  },
};