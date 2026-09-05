import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_NAME = "تکل";

const SITE_DESCRIPTION =
  "تکل، وب‌اپلیکیشن ارزیابی ذهنی و روان‌شناسی ورزشی برای سنجش تمرکز، حافظه، واکنش و عملکرد شناختی ورزشکاران.";

export const metadata: Metadata = {
  title: {
    default: "تکل | روان‌شناسی ورزشی و ارزیابی ذهنی ورزشکاران",
    template: "%s | تکل",
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  authors: [
    {
      name: "دکتر سعید",
    },
  ],

  creator: "دکتر سعید",
  publisher: "دکتر سعید",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "تکل | روان‌شناسی ورزشی و ارزیابی ذهنی ورزشکاران",
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "fa_IR",
    siteName: SITE_NAME,
  },

  twitter: {
    card: "summary_large_image",
    title: "تکل | روان‌شناسی ورزشی و ارزیابی ذهنی ورزشکاران",
    description:
      "پلتفرم ارزیابی ذهنی و روان‌شناسی ورزشی برای سنجش عملکرد شناختی ورزشکاران.",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}