"use client";
import { useAuthStore } from "@/models/auth-store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoadingScreen from "./loading-screen";

export const AuthProvider = (props: React.PropsWithChildren) => {
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return props.children;
};
