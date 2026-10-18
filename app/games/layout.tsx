import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "بازی آنلاین بدون نصب | بازی فکری و تمرین ذهنی";
const description =
  "در تکل بازی‌های آنلاین را بدون نصب برنامه تجربه کنید. بازی فکری آنلاین، تمرین‌های حافظه و تمرکز و سرگرمی‌های ذهنی را مستقیم در مرورگر اجرا کنید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games",
  },
  openGraph: {
    title,
    description,
    url: "https://tackl.ir/games",
    type: "website",
    locale: "fa_IR",
    siteName: "تکل",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function GamesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
