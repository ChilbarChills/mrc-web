import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Manarat Robotics Club",
  description: "Build. Engineer. Innovate. Designed by students, driven by curiosity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} antialiased`}>
      <body className="flex flex-col font-sans bg-[#070E1A] text-white">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
