const API_URL = 'http://localhost:5000';

export const authApi = {
  login: async (credentials: { email: string; password: string; username?: string }) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        username: credentials.username || credentials.email,
        password: credentials.password
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Login failed' };
    }
    
    return response.json();
  },

  signup: async (userData: { email: string; password: string; name: string }) => {
    const response = await fetch(`${API_URL}/api/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { error: error.error || 'Signup failed' };
    }
    
    return response.json();
  },
};
