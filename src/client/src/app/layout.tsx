import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Image Retrieval System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container mx-auto p-5 w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
