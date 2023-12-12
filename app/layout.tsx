import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Layout } from "@/components/app-layout";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ogaalkoob | Home",
  description: "Ogaalkoob is online store for books that sells books.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <Layout>{children}</Layout>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
