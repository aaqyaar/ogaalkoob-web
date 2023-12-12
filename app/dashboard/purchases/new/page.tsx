"use client";
import LoadingScreen from "@/components/loading-screen";
import { NewEditPurchaseForm } from "@/components/new-edit-purchase-form";
import { useBookStore } from "@/models/book.store";
import { useUserStore } from "@/models/users.store";
import { Book, User } from "@/types";
import React, { Suspense, useEffect, useState } from "react";

export interface PurchaseLocalStoreProps {
  users: { id: User["id"]; name: User["name"] }[];
  books: { id: Book["id"]; title: Book["title"]; price: Book["price"] }[];
}

export default function NewPurchasePage() {
  const { fetchAllUsers } = useUserStore();
  const { fetchAllBooks } = useBookStore();

  const [data, setData] = useState<PurchaseLocalStoreProps>({
    users: [],
    books: [],
  });

  useEffect(() => {
    (async () => {
      const [users, books] = await Promise.all([
        fetchAllUsers(),
        fetchAllBooks(),
      ]);

      const usersData = users.map((user) => ({ id: user.id, name: user.name }));
      const booksData = books.map((book) => ({
        id: book.id,
        title: book.title,
        price: book.price,
      }));

      setData({
        users: usersData,
        books: booksData,
      });
    })();
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <main className="container mx-auto py-10">
        <div className="h-full flex-1 flex-col space-y-8 p-2">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                New Purchase
              </h2>
              <p className="text-muted-foreground">
                Create a new purchase for filling out the form below.
              </p>
            </div>
          </div>

          <NewEditPurchaseForm _data={data} />
        </div>
      </main>
    </Suspense>
  );
}
