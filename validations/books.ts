import * as zod from "zod";

export const bookSchema = zod.object({
  title: zod
    .string({
      required_error: "Title is required and must be at least 2 characters",
    })
    .min(2, "Title is required and must be at least 2 characters"),
  author: zod
    .string({
      required_error: "Author is required and must be at least 2 characters",
    })
    .min(2, "Author is required and must be at least 2 characters"),
  publishedDate: zod.string({
    required_error: "Published date is required and must be a valid date",
  }),
  isbn: zod
    .string({
      required_error: "ISBN is required and must be at least 2 characters",
    })
    .min(2, "ISBN is required and must be at least 2 characters"),
  photos: zod
    .array(
      zod.string({
        required_error: "Photos is required",
      })
    )
    .refine((val) => val.length > 0, {
      message: "Photos is required",
    }),

  price: zod
    .number({
      required_error: "Price is required and must be at least 0",
    })
    .min(0, "Price is required and must be at least 0"),
  description: zod
    .string({
      required_error:
        "Description is required and must be at least 20 characters",
    })
    .min(20, "Description is required and must be at least 20 characters"),

  genre: zod
    .array(
      zod.string({
        required_error: "Genre is required",
      })
    )
    .min(1, "Genre is required")
    .refine((val) => val.length > 0, {
      message: "Genre is required",
    }),

  // make required
  pdfUrl: zod
    .string({
      required_error: "PDF is required",
    })
    .refine((val) => val !== "", {
      message: "PDF is required",
    }),
  audioUrl: zod
    .string({
      required_error: "Audio is required",
    })
    .refine((val) => val !== "", {
      message: "Audio is required",
    }),
});

export const genreSchema = zod.object({
  name: zod
    .string({
      required_error: "Name is required and must be at least 2 characters",
    })
    .min(2, "Name is required and must be at least 2 characters"),
});
