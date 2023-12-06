import { Genre } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Status } from "./auth-store";
import api from "@/services/api";

interface GenreStore {
  genres: Genre[] | null;
  fetchGenres: () => Promise<Genre[]>;
  status: Status;
  setStatus: (status: Status) => void;
  fetchGenre: (id: string) => Promise<Genre>;
}

export const useGenreStore = create(
  persist<GenreStore>(
    (set) => ({
      genres: null,
      status: "idle",

      setStatus: (status: Status) => set({ status }),

      fetchGenres: async () => {
        try {
          set({ status: "pending" });
          const response = await api.get<Genre[]>("/genre/all");
          set({ genres: response, status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      fetchGenre: async (id: string) => {
        try {
          set({ status: "pending" });
          const response = await api.get<Genre>(`/genre/${id}`);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
    }),
    {
      name: "genreStore",
    }
  )
);
