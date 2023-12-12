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
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<ILoginResponse>;

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
      login: async (username: string, password: string) => {
        set({ status: "pending" });
        const { token } = await api.post<ILoginResponse>("/auth/login", {
          username,
          password,
        });

        set({ token, isAuthenticated: true, status: "done" });
        return { token };
      },
      register: async (
        name: string,
        email: string,
        phone: string,
        password: string
      ) => {
        try {
          set({ status: "pending" });
          const { token } = await api.post<ILoginResponse>("/auth/register", {
            name,
            email,
            phone,
            password,
          });

          set({ status: "done" });
          return { token };
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      setStatus: (status: Status) => set({ status }),
      getMe: async () => {
        try {
          set({ status: "pending" });
          const data = await api.get<IUser>("/auth/me");
          set({ profile: data, status: "done" });
          return data;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
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
