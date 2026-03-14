import type { LoginCredentials, AuthResponse, User } from '@/types';
import apiClient from '@/lib/axios';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', {
        userId: credentials.userId.trim(),
        password: credentials.password,
      });
      const data: AuthResponse = response.data.data;
      this.setSession(data);
      return data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed');
    }
  },

  async register(userData: { userId: string; name: string; password: string; role?: 'ADMIN' | 'CUSTOMER' }): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const data: AuthResponse = response.data.data;
      this.setSession(data);
      return data;
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Registration failed');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const { data } = await apiClient.get('/auth/me');
      return data.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      this.logout();
      return null;
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  },

  setSession(response: AuthResponse) {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    // Store userId for easy access in customer pages
    if (response.user?.userId) {
      localStorage.setItem('userId', response.user.userId);
    }
  },

  getToken() {
    return localStorage.getItem('accessToken');
  }
};

