import { Genre, GenreCreationDTO } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Status } from "./auth.store";
import api from "@/services/api";
import { PaginationResult } from "@/services/api.types";

interface GenreStore {
  genres: Genre[] | null;
  genresPagination: PaginationResult<Genre> | null;
  fetchGenres: () => Promise<Genre[]>;
  status: Status;
  setStatus: (status: Status) => void;
  fetchGenre: (id: string) => Promise<Genre>;
  fetchGenreByPagination: (params: {
    page?: number;
    limit?: number;
    query?: string;
  }) => Promise<PaginationResult<Genre>>;
  createGenre: (genre: GenreCreationDTO) => Promise<{
    message: string;
    data: Genre;
  }>;
  updateGenre: (
    id: string,
    genre: GenreCreationDTO
  ) => Promise<{
    message: string;
    data: Genre;
  }>;
}

export const useGenreStore = create(
  persist<GenreStore>(
    (set) => ({
      genres: null,
      status: "idle",
      genresPagination: null,

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
      fetchGenreByPagination: async ({ page = 1, limit = 5, query = "" }) => {
        try {
          set({ status: "pending" });
          const response = await api.get<PaginationResult<Genre>>(
            `/genre?page=${page}&limit=${limit}&q=${query}`
          );
          set({ genresPagination: response, status: "done" });
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

      createGenre: async (genre: GenreCreationDTO) => {
        try {
          set({ status: "pending" });
          const response = await api.post<{ message: string; data: Genre }>(
            "/genre",
            genre
          );
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },

      updateGenre: async (id: string, genre: GenreCreationDTO) => {
        try {
          set({ status: "pending" });
          const response = await api.put<{ message: string; data: Genre }>(
            `/genre/${id}`,
            genre
          );
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
