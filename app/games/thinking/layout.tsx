import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "بازی فکری آنلاین بدون نصب | تمرین حافظه و تمرکز";
const description =
  "بازی فکری آنلاین را بدون نصب در تکل تجربه کنید. با بازی‌های ذهنی و سرگرم‌کننده، حافظه، تمرکز و دقت خود را تمرین کنید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/thinking",
  },
  openGraph: {
    title,
    description,
    url: "https://tackl.ir/games/thinking",
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

export default function ThinkingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
