"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  LightBulbIcon,
  GoalIcon,
  GraphIcon,
  HeartIcon,
  HomeIcon,
  PeopleIcon,
  PlayIcon,
  RocketIcon,
  SearchIcon,
  ShieldCheckIcon,
  ThreeBarsIcon,
  XIcon,
} from "@primer/octicons-react";
import { Button, Heading as PrimerHeading, Stack, Text as PrimerText } from "@primer/react";

const Box = Stack;
const Text = PrimerText as unknown as React.ComponentType<any>;
const Heading = PrimerHeading as unknown as React.ComponentType<any>;

const quickLinks = [
  { href: "/games", title: "بازی‌های ذهنی", text: "تمرکز، حافظه و واکنش", icon: LightBulbIcon, tone: "accent" },
  { href: "/mental-health-form", title: "ارزیابی ذهنی", text: "شناخت بهتر وضعیت فعلی", icon: GraphIcon, tone: "success" },
  { href: "/games/management", title: "مدیریت ورزشی", text: "یادگیری و تصمیم‌گیری", icon: GoalIcon, tone: "attention" },
  { href: "/games/mental-health", title: "سلامت روان", text: "آرامش و عملکرد پایدار", icon: HeartIcon, tone: "severe" },
];

const features = [
  [ShieldCheckIcon, "امن و محرمانه", "نتایج شما فقط برای خودتان است."],
  [RocketIcon, "ساده و کاربردی", "از همین امروز شروع کنید."],
  [PeopleIcon, "برای همه", "ورزشکار، مربی و علاقه‌مند."],
] as const;

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main dir="rtl" style={{ minHeight: "100svh", background: "var(--bgColor-muted)" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 20, background: "color-mix(in srgb, var(--bgColor-default) 88%, transparent)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--borderColor-muted)" }}>
        <Box sx={{ maxWidth: "1200px", mx: "auto", px: [3, 4, 5], py: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" aria-label="صفحه اصلی تکل" style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, display: "grid", placeItems: "center", bg: "accent.emphasis", color: "fg.onEmphasis" }}><LightBulbIcon size={22} /></Box>
              <Box><Text sx={{ display: "block", fontSize: 2, fontWeight: "bold" }}>تکل</Text><Text sx={{ color: "fg.muted", fontSize: 0 }}>سلامت روان و عملکرد</Text></Box>
            </Box>
          </Link>
          <Box sx={{ display: ["none", "flex"], alignItems: "center", gap: 2 }}>
            <Button as={Link} href="/games" leadingVisual={PlayIcon} variant="primary">شروع ارزیابی</Button>
            <Button as={Link} href="/mental-health-form" variant="invisible">ورود / ثبت‌نام</Button>
          </Box>
          <Button aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} onClick={() => setMenuOpen(!menuOpen)} style={{ minWidth: 40, paddingInline: 8 }} variant="invisible">{menuOpen ? <XIcon /> : <ThreeBarsIcon />}</Button>
        </Box>
        {menuOpen && <Box sx={{ display: ["block", "none"], px: 3, pb: 3 }}><Box sx={{ display: "grid", gap: 2 }}><Button as={Link} href="/games" variant="primary" leadingVisual={PlayIcon} onClick={() => setMenuOpen(false)}>شروع ارزیابی</Button><Button as={Link} href="/mental-health-form" variant="default" onClick={() => setMenuOpen(false)}>ورود / ثبت‌نام</Button></Box></Box>}
      </header>

      <Box sx={{ maxWidth: "1200px", mx: "auto", px: [3, 4, 5], py: [5, 6, 8] }}>
        <Box sx={{ display: "grid", gridTemplateColumns: ["1fr", "1fr", "1.05fr .95fr"], gap: [5, 6, 8], alignItems: "center" }}>
          <Box>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, px: 2, py: 1, borderRadius: 999, bg: "accent.muted", color: "accent.fg", fontSize: 0, fontWeight: "bold" }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "currentColor" }} /> مسیر بهتر از ذهن شروع می‌شود</Box>
            <Heading as="h1" sx={{ fontSize: [5, 6, 8], lineHeight: "condensed", letterSpacing: "tight", mt: 3, mb: 3 }}>ذهن قوی‌تر،<br /><Box as="span" sx={{ color: "accent.fg" }}>عملکرد بهتر</Box></Heading>
            <Text sx={{ display: "block", color: "fg.muted", fontSize: [2, 3], lineHeight: "condensed", maxWidth: "620px", mb: 4 }}>با تکل، سلامت روان و مهارت‌های شناختی خود را بهتر بشناسید؛ تمرکز کنید، تمرین کنید و با آگاهی بیشتری تصمیم بگیرید.</Text>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}><Button as={Link} href="/games" size="large" variant="primary" leadingVisual={PlayIcon}>شروع کنید</Button><Button as={Link} href="/mental-health-form" size="large" variant="default" trailingVisual={ArrowRightIcon}>ارزیابی رایگان</Button></Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "fg.muted", fontSize: 0 }}><ShieldCheckIcon size={16} /> بدون نیاز به نصب، در چند دقیقه</Box>
          </Box>

          <Box sx={{ position: "relative", minHeight: ["320px", "400px"], borderRadius: 4, overflow: "hidden", bg: "canvas.inset", border: "1px solid", borderColor: "border.default", boxShadow: "shadow.large" }}>
            <Box sx={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(145deg, color-mix(in srgb, var(--bgColor-default) 5%, transparent), transparent), url('/pic/hero.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
            <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,.65), transparent 60%)" }} />
            <Box sx={{ position: "absolute", bottom: 4, right: 4, left: 4, color: "fg.onEmphasis" }}><Text sx={{ display: "block", fontSize: 0, opacity: .8, mb: 1 }}>با همراهی دکتر سعید</Text><Heading as="h2" sx={{ color: "fg.onEmphasis", fontSize: [3, 4] }}>هر روز، یک قدم به ذهن آرام‌تر</Heading></Box>
          </Box>
        </Box>

        <Box sx={{ mt: [6, 7], display: "flex", justifyContent: "space-between", alignItems: "end" }}><Box><Text sx={{ color: "accent.fg", fontSize: 0, fontWeight: "bold" }}>دسترسی سریع</Text><Heading as="h2" sx={{ fontSize: [4, 5], mt: 1 }}>از کجا شروع کنیم؟</Heading></Box><Button as={Link} href="/games" variant="invisible" trailingVisual={ChevronLeftIcon}>مشاهده همه</Button></Box>
        <Box sx={{ display: "grid", gridTemplateColumns: ["repeat(2, 1fr)", "repeat(4, 1fr)"], gap: [2, 3], mt: 3 }}>
          {quickLinks.map(({ href, title, text, icon: Icon, tone }) => <Link key={href} href={href} style={{ textDecoration: "none", color: "inherit" }}><Box sx={{ height: "100%", p: [3, 4], border: "1px solid", borderColor: "border.muted", borderRadius: 3, bg: "bg.default", transition: "transform .2s ease, box-shadow .2s ease", ":hover": { transform: "translateY(-3px)", boxShadow: "shadow.medium" } }}><Box sx={{ width: 36, height: 36, display: "grid", placeItems: "center", borderRadius: 2, bg: `${tone}.muted`, color: `${tone}.fg`, mb: 3 }}><Icon size={18} /></Box><Text sx={{ display: "block", fontWeight: "bold", fontSize: [1, 2] }}>{title}</Text><Text sx={{ display: "block", color: "fg.muted", fontSize: 0, mt: 1, lineHeight: "condensed" }}>{text}</Text><Box sx={{ mt: 3, color: "accent.fg" }}><ChevronLeftIcon size={16} /></Box></Box></Link>)}
        </Box>

        <Box sx={{ mt: [6, 7], p: [4, 5], borderRadius: 3, bg: "canvas.subtle", border: "1px solid", borderColor: "border.muted", display: "grid", gridTemplateColumns: ["1fr", "repeat(3, 1fr)"], gap: [4, 5] }}>
          {features.map(([Icon, title, text]) => <Box key={title} sx={{ display: "flex", gap: 3, alignItems: "start" }}><Box sx={{ color: "success.fg", mt: 1 }}><Icon size={20} /></Box><Box><Text sx={{ display: "block", fontWeight: "bold", fontSize: 1 }}>{title}</Text><Text sx={{ display: "block", color: "fg.muted", fontSize: 0, mt: 1 }}>{text}</Text></Box></Box>)}
        </Box>

        <Box sx={{ mt: [6, 7], display: "flex", justifyContent: "space-between", alignItems: "center", color: "fg.muted", fontSize: 0 }}><Box sx={{ display: "flex", alignItems: "center", gap: 2 }}><HomeIcon size={15} /> تکل؛ برای شناخت بهتر ذهن</Box><Box sx={{ display: ["none", "flex"], alignItems: "center", gap: 2 }}><SearchIcon size={15} /> طراحی شده برای زندگی واقعی</Box></Box>
      </Box>
    </main>
  );
}
