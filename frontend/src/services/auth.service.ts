import type { LoginCredentials, AuthResponse, User } from '@/types';

// Mock user for development
const MOCK_ADMIN: User = {
  id: '1',
  userId: 'admin',
  name: 'Admin User',
  role: 'ADMIN',
  walletBalance: 0,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const MOCK_CUSTOMER: User = {
  id: '2',
  userId: 'test_user',
  name: 'Test Customer',
  role: 'CUSTOMER',
  walletBalance: 5000,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userId = credentials.userId.trim();
    const password = credentials.password; // Don't trim password usually, but for simple mocks maybe? No, passwords can end in space.

    // Admin Login
    if (userId === 'admin' && password === 'admin123') {
      const response: AuthResponse = {
        user: MOCK_ADMIN,
        accessToken: 'mock_admin_token',
        refreshToken: 'mock_admin_refresh',
      };
      this.setSession(response);
      return response;
    }

    // Customer Login
    if (credentials.userId === 'test_user' && credentials.password === 'password123') {
      const response: AuthResponse = {
        user: MOCK_CUSTOMER,
        accessToken: 'mock_customer_token',
        refreshToken: 'mock_customer_refresh',
      };
      this.setSession(response);
      return response;
    }

    throw new Error('Invalid credentials');
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  setSession(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
  },

  getToken() {
    return localStorage.getItem('accessToken');
  }
};
