import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "آموزش مدیریت، برنامه‌ریزی و رهبری";
const description =
  "با اصول برنامه‌ریزی، سازمان‌دهی، تصمیم‌گیری و رهبری آشنا شوید. مطالب کاربردی برای یادگیری مهارت‌های مدیریتی و توسعه توانمندی‌های فردی در تکل.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/management",
  },
  openGraph: {
    title: `${title} | تکل`,
    description,
    url: "https://tackl.ir/games/management",
    type: "website",
    locale: "fa_IR",
    siteName: "تکل",
  },
};

export default function ManagementLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
