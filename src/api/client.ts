import axios from 'axios';

import * as T from '@/types/api';

import { CONFIG } from '@/config/config';

export const axiosInstance = axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Interceptors ────────────────────────────────────────────────────
// See src/docs/api.md for a full JWT refresh token implementation
// guide with request/response interceptors.

// ── API methods ─────────────────────────────────────────────────────
export const api = {
  login: (params: T.LoginRequest) =>
    axiosInstance.post<T.LoginResponse>('auth/login', params),
  getUser: (id: number) => axiosInstance.get<T.UserResponse>(`users/${id}`),
  updateUser: ({ id, ...body }: T.UpdateUserRequest) =>
    axiosInstance.patch<T.UserResponse>(`users/${id}`, body),
} as const;
