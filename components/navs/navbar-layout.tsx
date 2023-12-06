"use client";
import React from "react";
import { IMainNav, MainNav } from "./navbar";
import { useAuthStore } from "@/models/auth-store";

export default function NavbarLayout() {
  const navs: IMainNav["navConfig"] = [
    { label: "Overview", href: "/dashboard", protected: true },
    { label: "Books", href: "/dashboard/books", protected: true },
    { label: "Genre's", href: "/dashboard/genre", protected: true },
    { label: "Users", href: "/dashboard/users", protected: true },
  ];
  const { isAuthenticated } = useAuthStore();

  const filteredNavs = navs.filter((item) => {
    if (isAuthenticated) {
      return item.protected;
    } else {
      return !item.protected;
    }
  });
  return (
    <header className="border-b">
      <div className="container mx-auto p-2.5">
        <MainNav className="mx-6" navConfig={filteredNavs} />
      </div>
    </header>
  );
}
