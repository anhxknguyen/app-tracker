import type { Metadata } from "next";
import "./styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "@/app/trpc/Provider";
import Navbar from "./_components/navbar";
import { ThemeProvider } from "./_components/theme-provider";

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
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <Navbar />
            <Provider>{children}</Provider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
