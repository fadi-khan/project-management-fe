import axios, { AxiosInstance } from "axios";
import { store } from "@/lib/store/store";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Debug logging to verify baseUrl
if (typeof window !== 'undefined') {
  console.log('Client-side baseUrl:', baseUrl);
} else {
  console.log('Server-side baseUrl:', baseUrl);
}

class HttpService {
  private axios: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: (() => void)[] = [];

  constructor() {
    this.axios = axios.create({
      baseURL: baseUrl,
      withCredentials: true, // VERY IMPORTANT for refresh token cookies
    });

    // Attach access token to every request
    this.axios.interceptors.request.use((config) => {
      return config;
    });

    // Response interceptor (auto refresh on 401)
    this.axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        const isRefreshRequest =
          typeof originalRequest?.url === 'string' &&
          originalRequest.url.includes('/auth/refresh-token');

        // If refresh token call itself fails, do NOT attempt another refresh.
        if (isRefreshRequest) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }

        // 1. Check if the error is 401 and we haven't retried this specific request yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              await this.axios.post('/auth/refresh-token', {}, { withCredentials: true });
              
              this.isRefreshing = false;
              this.onRefreshed(); 
            } catch (refreshError) {
              this.isRefreshing = false;
              this.refreshSubscribers = [];
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }

          // 3. Queue the original request until the refresh is complete
         return new Promise((resolve, reject) => {
  this.subscribeTokenRefresh(() => {
    // Force the retry to use the new cookies by creating a clean config
    // Sometimes originalRequest needs its headers explicitly cleaned if they were cached
    const retryConfig = {
      ...originalRequest,
      // Ensure we don't carry over any internal axios 'already retried' flags
      _retry: true 
    };

    // IMPORTANT: Use the instance (this.axios) but ensure you RETURN the result
    this.axios(retryConfig)
      .then(resolve)
      .catch(reject);
  });
});
        }
        return Promise.reject(error);
      }
    );
  }

  // helpers
  private subscribeTokenRefresh(cb: () => void) {
    this.refreshSubscribers.push(cb);
  }

  private onRefreshed() {
    this.refreshSubscribers.forEach((cb) => cb());
    this.refreshSubscribers = [];
  }

  get(url: string) {
    return this.axios.get(url);
  }

  post(url: string, body?: any) {
    return this.axios.post(url, body);
  }

  update(url:string, id:number, body?: any){
    return this.axios.patch(`${url}/${id}`, body)
  }
  delete(url:string, id:number){
    return this.axios.delete(`${url}/${id}`)
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("user");
  }
}

// Create a singleton instance
export const httpService = new HttpService();