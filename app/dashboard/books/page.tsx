"use client";
import React, { Suspense } from "react";
import { DataTable } from "./data-table";
import { useBookStore } from "@/models/book.store";
import LoadingScreen from "@/components/loading-screen";
import { columns } from "./columns";

export default function BooksPage() {
  const { fetchBooks, books } = useBookStore();

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      // Update fetchBooks call to include page
      const response = await fetchBooks({
        page: page,
        limit: 10,
      });
      // Set totalPages based on response
      setTotalPages(response.numberOfPages);
    })();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <Suspense fallback={<LoadingScreen />}>
      <div className="container mx-auto py-10">
        <div className="h-full flex-1 flex-col space-y-8 p-2">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Welcome back!
              </h2>
              <p className="text-muted-foreground">
                Here&apos;s a list of books you have added.
              </p>
            </div>
          </div>
          <DataTable
            data={books && books.data ? books.data : []}
            columns={columns}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </Suspense>
  );
}
