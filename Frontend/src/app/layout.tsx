import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CodeState from "@/Data";
import ToastProvider from "../../toast.provider";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeBrim",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CodeState>
        <body className={inter.className}>
          <ToastProvider>{children}</ToastProvider>
        </body>
      </CodeState>
    </html>
  );
}