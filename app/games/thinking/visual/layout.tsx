import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "بازی تصویری آنلاین بدون نصب | تمرین تمرکز و دقت";
const description =
  "بازی تصویری آنلاین تکل را بدون نصب اجرا کنید. با تصاویر و مراحل سرگرم‌کننده، توجه دیداری، دقت و تمرکز خود را تمرین کنید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/thinking/visual",
  },
  openGraph: {
    title,
    description,
    url: "https://tackl.ir/games/thinking/visual",
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

export default function VisualLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
