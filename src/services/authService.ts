import { api } from "@/lib/axios";
import { ApiSuccess, PublicUser } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponseData {
  user: PublicUser;
  accessToken: string;
}

export const authService = {
  async register(payload: RegisterPayload) {
    const res = await api.post<ApiSuccess<AuthResponseData>>(
      "/auth/register",
      payload,
    );
    console.log("Registering user", res.data.data);
    return res.data.data;
  },

  async login(payload: LoginPayload) {
    const res = await api.post<ApiSuccess<AuthResponseData>>(
      "/auth/login",
      payload,
    );

    console.log("logging user", res.data.data.accessToken);
    return res.data.data;
  },

  async logout() {
    await api.post("/auth/logout");
  },

  async refresh() {
    const res =
      await api.post<ApiSuccess<{ accessToken: string }>>("/auth/refresh");
    console.log("refreshing access token", res);
    return res.data.data;
  },

  async getProfile() {
    const res = await api.get<ApiSuccess<PublicUser>>("/auth/profile");
    console.log("Fetching user profile", res.data.data);

    return res.data.data;
  },
};
