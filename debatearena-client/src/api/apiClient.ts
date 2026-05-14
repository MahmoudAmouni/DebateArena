import { env } from '../lib/env';

const BASE_URL = env.VITE_API_URL;

let accessToken: string | null = localStorage.getItem('accessToken');
let refreshPromise: Promise<string | null> | null = null;

export const setAuthToken = (token: string | null) => {
  accessToken = token;
};

class ApiClient {
  private async request(path: string, options: any = {}): Promise<any> {
    let url = `${BASE_URL}${path}`;
    
    if (options.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      delete options.params;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 for token refresh
      if (response.status === 401 && !path.includes('/auth/refresh') && !path.includes('/auth/login')) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // Retry the original request with new token
          headers['Authorization'] = `Bearer ${newToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          return { data: await retryResponse.json() };
        }
      }

      const data = await response.json();

      if (!response.ok) {
        throw { status: response.status, ...data };
      }

      return { data: data.data || data }; // Handle both wrapped and unwrapped responses
    } catch (error) {
      throw error;
    }
  }

  private async refreshToken(): Promise<string | null> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const response = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();
        if (response.ok && result.data?.accessToken) {
          accessToken = result.data.accessToken;
          // Note: We might need a way to notify AuthContext about the new token
          return accessToken;
        }
        return null;
      } catch (error) {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }

  get<T = any>(path: string, options?: any): Promise<T> {
    return this.request(path, { ...options, method: 'GET' });
  }

  post<T = any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T = any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  patch<T = any>(path: string, body?: any, options?: any): Promise<T> {
    return this.request(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T = any>(path: string, options?: any): Promise<T> {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient();
