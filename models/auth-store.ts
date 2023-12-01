"use client";
import { ILoginResponse, IUser } from "@/types/auth";
import { create } from "zustand";
import api from "@/services/api";
import { persist } from "zustand/middleware";

type AuthStore = {
  token: string;
  profile: IUser;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ILoginResponse>;
  logout: () => void;
  getMe: () => Promise<IUser>;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: "",
      isAuthenticated: false,
      profile: {} as IUser,
      login: async (email: string, password: string) => {
        const { token } = await api.post<ILoginResponse>("/auth/login", {
          email,
          password,
        });

        set({ token, isAuthenticated: true });
        return { token };
      },
      getMe: async () => {
        const data = await api.get<IUser>("/auth/me");
        set({ profile: data });
        return data;
      },
      logout: () =>
        set({ token: "", profile: {} as IUser, isAuthenticated: false }),
    }),
    {
      name: "authStore",
    }
  )
);
