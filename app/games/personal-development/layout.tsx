import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "آموزش توسعه فردی و رشد شخصی";
const description =
  "با مطالب توسعه فردی تکل، مهارت‌های فردی، هدف‌گذاری و رشد شخصی را دنبال کنید و با راهکارهای کاربردی برای بهبود عملکرد روزانه آشنا شوید.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/personal-development",
  },
  openGraph: {
    title: `${title} | تکل`,
    description,
    url: "https://tackl.ir/games/personal-development",
    type: "website",
    locale: "fa_IR",
    siteName: "تکل",
  },
};

export default function PersonalDevelopmentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
