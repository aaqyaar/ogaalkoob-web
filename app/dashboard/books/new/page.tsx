"use client";

import React, { Suspense } from "react";
import { useGenreStore } from "@/models/genre.store";
import LoadingScreen from "@/components/loading-screen";
import { NewEditBookForm } from "@/components/new-edit-book-form";

export default function NewBookPage() {
  const { fetchGenres } = useGenreStore();

  React.useEffect(() => {
    (async () => {
      await fetchGenres();
    })();
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="container mx-auto py-10">
        <div className="h-full flex-1 flex-col space-y-8 p-2">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">New Book</h2>
              <p className="text-muted-foreground">
                Create a new book for filling out the form below.
              </p>
            </div>
          </div>

          <NewEditBookForm />
        </div>
      </main>
    </Suspense>
  );
}
