import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/Providers";
import { Suspense } from "react";
import Loader from "@/app/components/Loader";
import FloatingNav from "@/app/components/FloatingNav";
import { Session } from "next-auth";
import getAuthSession from "@/app/utils/getAuthSession";

export const metadata: Metadata = {
  title: "Anthony Umbriac's Blog",
  description: "Just another blog",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session: Session | null = await getAuthSession();

  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loader />}>
          <Providers>
            <FloatingNav session={session} />
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
