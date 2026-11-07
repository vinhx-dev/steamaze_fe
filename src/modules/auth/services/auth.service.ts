import { api } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  User,
} from "../types";

async function login(payload: LoginPayload) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", payload);
  return res.data.data;
}

async function register(payload: RegisterPayload) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", payload);
  return res.data.data;
}

// Server component không có document nên interceptor không gắn được token, phải truyền tay
async function getMe(accessToken?: string) {
  const res = await api.get<ApiResponse<User>>("/auth/me", {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });
  return res.data.data;
}

async function updateProfile(userId: string, payload: UpdateProfilePayload) {
  const res = await api.put<ApiResponse<User>>(`/users/${userId}`, payload);
  return res.data.data;
}

async function refreshAuth(refreshToken: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/refresh", { refreshToken });
  return res.data.data;
}

async function loginWithGoogle(credential: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/google", { credential });
  return res.data.data;
}

async function loginWithFacebook(accessToken: string) {
  const res = await api.post<ApiResponse<AuthResponse>>("/auth/facebook", { accessToken });
  return res.data.data;
}

export { login, register, loginWithGoogle, loginWithFacebook, getMe, updateProfile, refreshAuth };
