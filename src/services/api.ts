const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const authApi = {
  login: (credentials: { phone: string; password?: string }) => 
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
};

export const bookingApi = {
  getAll: () => apiFetch('/api/bookings'),
  create: (data: any) => apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
};
