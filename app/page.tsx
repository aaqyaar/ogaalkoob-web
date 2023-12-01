"use client";
import { useAuthStore } from "@/models/auth-store";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useLayoutEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  });

  return <main>hello world</main>;
}
