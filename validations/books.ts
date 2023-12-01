import * as zod from "zod";

export const bookSchema = zod.object({
  title: zod
    .string()
    .min(2, "Title is required and must be at least 2 characters"),
  author: zod
    .string()
    .min(2, "Author is required and must be at least 2 characters"),
  publishedDate: zod.date(),
  isbn: zod
    .string()
    .min(2, "ISBN is required and must be at least 2 characters"),
  photos: zod.array(zod.string()),
  price: zod.number().min(0, "Price is required and must be at least 0"),
  description: zod
    .string()
    .min(20, "Description is required and must be at least 20 characters"),

  genre: zod.array(zod.string()).min(1, "Genre is required"),
});

export const genreSchema = zod.object({
  name: zod
    .string()
    .min(2, "Name is required and must be at least 2 characters"),
});
