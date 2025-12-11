import { httpClient } from "./httpClient";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  orgId: string;
  roles: string[];
}

export async function login(email: string, password: string) {
  const res = await httpClient.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  return res.data;
}
