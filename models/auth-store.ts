"use client";
import { ILoginResponse, IUser } from "@/types/auth";
import { create } from "zustand";
import api from "@/services/api";
import { persist } from "zustand/middleware";

export type Status = "idle" | "pending" | "fail" | "done";

type AuthStore = {
  token: string;
  profile: IUser;
  isAuthenticated: boolean;
  status: Status;
  setStatus: (status: Status) => void;
  login: (email: string, password: string) => Promise<ILoginResponse>;
  logout: () => void;
  getMe: () => Promise<IUser>;
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: "",
      status: "idle",
      isAuthenticated: false,
      profile: {} as IUser,
      login: async (email: string, password: string) => {
        set({ status: "pending" });
        const { token } = await api.post<ILoginResponse>("/auth/login", {
          email,
          password,
        });

        set({ token, isAuthenticated: true, status: "done" });
        return { token };
      },
      setStatus: (status: Status) => set({ status }),
      getMe: async () => {
        set({ status: "pending" });
        const data = await api.get<IUser>("/auth/me");
        set({ profile: data, status: "done" });
        return data;
      },
      logout: () =>
        set({
          token: "",
          profile: {} as IUser,
          isAuthenticated: false,
          status: "idle",
        }),
    }),
    {
      name: "authStore",
    }
  )
);
