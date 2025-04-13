import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/app/trpc/Provider";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
  title: "Application Tracker",
  description: "Bon and Mandy's Application Tracker App for the Unemployed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
