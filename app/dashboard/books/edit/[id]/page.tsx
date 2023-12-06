"use client";

import React, { Suspense } from "react";
import { useGenreStore } from "@/models/genre.store";
import LoadingScreen from "@/components/loading-screen";
import { NewEditBookForm } from "@/components/new-edit-book-form";
import { useParams, usePathname } from "next/navigation";
import { useBookStore } from "@/models/book.store";
import { BookCreationDTO } from "@/types";

export default function EditBookPage() {
  const { fetchGenres } = useGenreStore();
  const pathname = usePathname();
  const params = useParams();
  const { books } = useBookStore();

  React.useEffect(() => {
    (async () => {
      await fetchGenres();
    })();
  }, []);

  const isEdit = pathname.includes("edit");

  const book = books?.data?.find((book) => book.id == params.id);

  const currentBook = {
    ...book,
    genre: (book?.genre?.map(({ id }) => id) as string[]) ?? [],
  } as BookCreationDTO;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="container mx-auto py-10">
        <div className="h-full flex-1 flex-col space-y-8 p-2">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Edit Book</h2>
              <p className="text-muted-foreground">
                Edit a book by filling out the form below.
              </p>
            </div>
          </div>

          <NewEditBookForm isEdit={isEdit} currentBook={currentBook} />
        </div>
      </main>
    </Suspense>
  );
}
