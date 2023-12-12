import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Status } from "./auth.store";
import api from "@/services/api";
import { PaginationResult } from "@/services/api.types";
import { Purchase, PurchaseStatus, PurchaseCreationDTO } from "@/types";

interface PurchaseStore {
  purchases: PaginationResult<Purchase> | null;
  status: Status;
  setStatus: (status: Status) => void;

  fetchPurchases: (params: {
    page?: number;
    limit?: number;
    query?: string;
  }) => Promise<PaginationResult<Purchase>>;

  createPurchase: (purchase: PurchaseCreationDTO) => Promise<{
    message: string;
    data: Purchase;
  }>;

  updatePurchaseStatus: (
    userId: string,
    purchaseId: string,
    status: PurchaseStatus
  ) => Promise<{
    message: string;
    data: Purchase;
  }>;
}

export const usePurchaseStore = create(
  persist<PurchaseStore>(
    (set) => ({
      status: "idle",
      purchases: null,

      setStatus: (status: Status) => set({ status }),

      fetchPurchases: async ({ page = 1, limit = 5, query = "" }) => {
        try {
          set({ status: "pending" });
          const response = await api.get<PaginationResult<Purchase>>(
            `/purchases?page=${page}&limit=${limit}&q=${query}`
          );
          set({ purchases: response, status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },

      createPurchase: async (purchase: PurchaseCreationDTO) => {
        try {
          set({ status: "pending" });
          const response = await api.post<{
            message: string;
            data: Purchase;
          }>("/purchases", purchase);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },

      updatePurchaseStatus: async (
        userId: string,
        purchaseId: string,
        status: PurchaseStatus
      ) => {
        try {
          set({ status: "pending" });
          const response = await api.put<{
            message: string;
            data: Purchase;
          }>(`/purchases/status`, {
            userId,
            purchaseId,
            status,
          });
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
    }),
    {
      name: "purchaseStore",
    }
  )
);
