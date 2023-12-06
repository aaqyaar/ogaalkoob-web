import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Status } from "./auth-store";
import api from "@/services/api";
import { PaginationResult } from "@/services/api.types";
import { Book, BookCreationDTO, UploadResult } from "@/types";

interface BookStore {
  books: PaginationResult<Book> | null;
  status: Status;
  setStatus: (status: Status) => void;
  fetchBooks: (params: {
    page?: number;
    limit?: number;
    query?: string;
  }) => Promise<PaginationResult<Book>>;
  createBook: (book: BookCreationDTO) => Promise<{
    message: string;
    data: Book;
  }>;

  editBook: (
    id: string,
    book: BookCreationDTO
  ) => Promise<{
    message: string;
    data: Book;
  }>;
  upload: (
    file: File,
    type: "document" | "audio" | "image"
  ) => Promise<UploadResult>;
  fetchBook: (id: string) => Promise<Book>;
}

export const useBookStore = create(
  persist<BookStore>(
    (set) => ({
      books: null,
      status: "idle",
      setStatus: (status: Status) => set({ status }),
      fetchBooks: async ({ page = 1, limit = 5, query = "" }) => {
        try {
          set({ status: "pending" });
          const response = await api.get<PaginationResult<Book>>(
            `/books?page=${page}&limit=${limit}&q=${query}`
          );
          set({ books: response, status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      upload: async (file: File, type: "document" | "audio" | "image") => {
        try {
          set({ status: "pending" });
          const formData = new FormData();
          formData.append("file", file);
          const response = await api.post<UploadResult>(
            `/upload?type=${type}`,
            formData,
            // @ts-ignore
            {
              "Content-Type": "multipart/form-data",
            }
          );
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      createBook: async (book: BookCreationDTO) => {
        try {
          set({ status: "pending" });
          const response = await api.post<{
            message: string;
            data: Book;
          }>(`/books`, book);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      editBook: async (id: string, book: BookCreationDTO) => {
        try {
          set({ status: "pending" });
          const response = await api.put<{
            message: string;
            data: Book;
          }>(`/books/${id}`, book);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
      fetchBook: async (id: string) => {
        try {
          set({ status: "pending" });
          const response = await api.get<Book>(`/books/${id}`);
          set({ status: "done" });
          return response;
        } catch (error) {
          set({ status: "fail" });
          throw error;
        }
      },
    }),
    {
      name: "bookStore",
    }
  )
);
