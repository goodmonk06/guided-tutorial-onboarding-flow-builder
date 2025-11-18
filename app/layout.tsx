import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Guided Onboarding Flow Builder",
  description: "A production-ready system for creating and managing interactive guided onboarding experiences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
