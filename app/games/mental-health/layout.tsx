import type { Metadata } from "next";
import type { ReactNode } from "react";

const title = "سلامت روان و مدیریت استرس";
const description =
  "با راهکارهای شناخت احساسات، مدیریت استرس، تقویت اعتمادبه‌نفس و تمرکز آشنا شوید. مطالب کاربردی سلامت روان و آمادگی ذهنی در تکل.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://tackl.ir/games/mental-health",
  },
  openGraph: {
    title: `${title} | تکل`,
    description,
    url: "https://tackl.ir/games/mental-health",
    type: "website",
    locale: "fa_IR",
    siteName: "تکل",
  },
};

export default function MentalHealthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
