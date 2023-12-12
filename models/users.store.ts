import { Role, User } from "@/types";
import { create } from "zustand";
import api from "@/services/api";
import { persist } from "zustand/middleware";
import { Status } from "./auth-store";
import { PaginationResult } from "@/services/api.types";

interface UserStore {
  users: PaginationResult<User> | null;
  status: Status;
  setStatus: (status: Status) => void;
  fetchUsers: (params: {
    page?: number;
    limit?: number;
    query?: string;
  }) => Promise<PaginationResult<User>>;
  fetchAllUsers: () => Promise<User[]>;
  updateUser: (
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      status?: string;
      role?: string;
    }
  ) => Promise<User>;
  fetchRoles: () => Promise<{
    status: "success" | "error";
    data: Role[];
  }>;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      users: null,
      status: "idle",
      setStatus: (status: Status) => set({ status }),
      fetchUsers: async ({ page = 1, limit = 5, query = "" }) => {
        try {
          set({ status: "pending" });
          const response = await api.get<PaginationResult<User>>(
            `/users?page=${page}&limit=${limit}&q=${query}`
          );
          set({ users: response, status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      fetchAllUsers: async () => {
        try {
          set({ status: "pending" });
          const response = await api.get<User[]>("/users/all");
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      fetchRoles: async () => {
        try {
          set({ status: "pending" });
          const response = await api.get<{
            status: "success" | "error";
            data: Role[];
          }>("/auth/roles");
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      updateUser: async (id, data) => {
        try {
          set({ status: "pending" });
          const response = await api.put<User>(`/users/${id}`, data);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
    }),
    {
      name: "usersStore",
    }
  )
);
