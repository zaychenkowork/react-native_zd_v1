import axios from 'axios';

import * as T from '@/types/api';

import { CONFIG } from '@/config';

// import { signOut, useAuthStore } from '@/store';

export const axiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptors (uncomment when auth is wired) ─────────────────────
//
// axiosInstance.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
//
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (axios.isAxiosError(error) && error.response?.status === 401) {
//       signOut();
//     }
//     return Promise.reject(error);
//   },
// );

// ── API methods ─────────────────────────────────────────────────────
// Group endpoints by domain. Import request/response types from @/types.
//
//
export const api = {
  login: (params: T.LoginRequest) =>
    axiosInstance.post<T.LoginResponse>('auth/login', params),
} as const;
