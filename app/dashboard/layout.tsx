import { AuthProvider } from "@/components/auth-provider";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div id="modal-root"></div>
      {children}
    </AuthProvider>
  );
}
