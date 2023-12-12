"use client";
import React from "react";
import { INavbar } from "./navbar";
import { useAuthStore } from "@/models/auth.store";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("./navbar"), { ssr: false });

export default function NavbarLayout() {
  const navs: INavbar["navConfig"] = [
    { label: "Overview", href: "/dashboard", protected: true },
    { label: "Books", href: "/dashboard/books", protected: true },
    { label: "Genre's", href: "/dashboard/genres", protected: true },
    { label: "Purchases", href: "/dashboard/purchases", protected: true },
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
    <div className="border-b">
      <div className="container mx-auto p-2.5">
        <Navbar className="mx-6" navConfig={filteredNavs} />
      </div>
    </div>
  );
}
