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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500&family=Rubik:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="container mx-auto p-5 w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
