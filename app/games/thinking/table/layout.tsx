import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "بازی کلمات آنلاین بدون نصب | کَلَمَک";
const description =
  "بازی کلمات آنلاین کَلَمَک را بدون نصب برنامه اجرا کنید. کلمات را پیدا کنید، مراحل بازی را پیش ببرید و تمرکز و سرعت پردازش ذهنی خود را تمرین کنید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/thinking/table",
  },
  openGraph: {
    title,
    description,
    url: "https://tackl.ir/games/thinking/table",
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

export default function TableLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
