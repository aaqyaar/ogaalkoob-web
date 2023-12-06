import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Ogaalkoob | Auth",
  description: "Ogaalkoob is online store for books that sells books.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] bg-background">
      {children}
    </div>
  );
}
