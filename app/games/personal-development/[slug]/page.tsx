import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Lalezar, Vazirmatn } from "next/font/google";
import type { ReactNode } from "react";

export const dynamic = "force-dynamic";

const displayFont = Lalezar({
  subsets: ["arabic", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-body",
  display: "swap",
});

const CONTENT_FILE = path.join(
  process.cwd(),
  "content",
  "personal-development.md"
);

/* ترتیب و اسلاگ‌ها باید دقیقاً با صفحه اصلی یکی باشد */
const PRINCIPLES = [
  { slug: "mez-ra-bichin", title: "میز را بچین" },
  { slug: "barname-rizi-roozane", title: "برای هر روز از روز قبل برنامه‌ریزی کن" },
  { slug: "ghanoon-80-20", title: "قانون ۸۰/۲۰ را اجرا کن" },
  { slug: "natayej-va-avaqeb", title: "پیامدها را در نظر بگیر" },
  { slug: "abcde", title: "روش ABCDE را به کار ببر" },
  { slug: "natayej-kelidi", title: "روی حوزه‌های کلیدی تمرکز کن" },
  { slug: "ghanoon-zoroorat", title: "قانون بهره‌وری اجباری" },
  { slug: "amadegi", title: "قبل از شروع کاملاً آماده شو" },
  { slug: "moqaddamat-kar", title: "تکلیف اصلی را بشناس" },
  { slug: "estehdad-haye-khas", title: "یک بشکه را هر بار خالی کن" },
  { slug: "mahdoodiat-asli", title: "مهارت‌های کلیدی خودت را ارتقا بده" },
  { slug: "ghadam-be-ghadam", title: "محدودیت اصلی را پیدا کن" },
  { slug: "feshar-bar-khod", title: "به خودت فشار مثبت وارد کن" },
  { slug: "niro-va-tavan", title: "قدرت شخصی‌ات را افزایش بده" },
  { slug: "angizeh", title: "خودت را به اقدام فوری عادت بده" },
  { slug: "tanbali-khalagh", title: "تعلل سازنده داشته باش" },
  { slug: "sakht-tarin-kar", title: "اول از سخت‌ترین کارها شروع کن" },
  { slug: "taghsim-kar", title: "کار را به بخش‌های کوچک‌تر تقسیم کن" },
  { slug: "zaman-bi-vaghfe", title: "زمان‌های بزرگ و بدون وقفه ایجاد کن" },
  { slug: "hes-foriyat", title: "حس فوریت ایجاد کن" },
  { slug: "tamarkoz-yek-kar", title: "یک کار را تا پایان انجام بده" },
] as const;

const TOTAL = PRINCIPLES.length;

const FA_TO_EN: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

const EN_TO_FA: Record<string, string> = {
  "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
  "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
};

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Chapter = {
  number: number;
  lines: string[];
};

function normalizeDigits(value: string) {
  return value.replace(/[۰-۹]/g, (d) => FA_TO_EN[d] ?? d);
}

function toFa(value: number | string) {
  return String(value).replace(/[0-9]/g, (d) => EN_TO_FA[d]);
}

function normalizeText(value: string) {
  return value
    .replace(/[\u200c\u200f\u200e]/g, " ")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readMarkdown() {
  if (!fs.existsSync(CONTENT_FILE)) {
    return "";
  }

  return fs
    .readFileSync(CONTENT_FILE, "utf8")
    .replace(/^\uFEFF/, "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

/* «فصل ۳» / «بخش ۲» / «**فصل ۱۰ **» → عدد
   نکته: قبلاً از \b استفاده شده بود که با ارقام فارسی کار نمی‌کند */
function getChapterNumber(line: string) {
  const value = normalizeText(line)
    .replace(/^#{1,6}\s+/, "")
    .replace(/^\*\*\s*/, "")
    .replace(/\s*\*\*$/, "")
    .trim();

  const match = value.match(/^(?:فصل|بخش)\s*([0-9۰-۹]+)\s*[:：.\-–]?\s*$/u);
  if (!match) return null;

  const number = Number(normalizeDigits(match[1]));
  return Number.isInteger(number) ? number : null;
}

function isConclusion(line: string) {
  return normalizeText(line).replace(/\*/g, "").trim() === "نتیجه گیری";
}

function parseChapters(markdown: string): Chapter[] {
  const buckets: string[][] = Array.from({ length: TOTAL }, () => []);
  let current = 1;
  let ended = false;

  for (const line of markdown.split("\n")) {
    const number = getChapterNumber(line);

    if (number !== null && number >= 1 && number <= TOTAL) {
      current = number;
      ended = false;
      continue;
    }

    // «نتیجه‌گیری» پایان کتاب است و جزو فصل ۲۱ نیست
    if (isConclusion(line)) {
      ended = true;
      continue;
    }

    if (ended) continue;
    buckets[current - 1].push(line);
  }

  return buckets.map((lines, index) => {
    const copy = [...lines];

    // حذف خط عنوانِ خود فایل (چون عنوان در هدر صفحه نمایش داده می‌شود)
    const firstIndex = copy.findIndex((l) => l.trim());
    if (firstIndex !== -1) {
      const first = copy[firstIndex].trim();
      if (first.length < 80 && !first.startsWith("**")) {
        copy.splice(firstIndex, 1);
      }
    }

    while (copy.length && !copy[0].trim()) copy.shift();

    return { number: index + 1, lines: copy };
  });
}

function findChapter(chapters: Chapter[], rawSlug: string) {
  let slug = rawSlug;
  try {
    slug = decodeURIComponent(rawSlug);
  } catch {
    /* ignore */
  }
  slug = slug.trim().toLowerCase();

  const index = PRINCIPLES.findIndex((item) => item.slug === slug);
  if (index !== -1) return chapters[index];

  const asNumber = Number(normalizeDigits(slug));
  if (Number.isInteger(asNumber) && asNumber >= 1 && asNumber <= TOTAL) {
    return chapters[asNumber - 1];
  }

  return null;
}

/* ---------- Markdown rendering ---------- */

const SUMMARY_RE = /^خلاصه(?:\s+(?:فصل|بخش))?(?:\s*[0-9۰-۹]+)?\s*[:：]?$/u;
const STEP_RE = /^مرحله(?:\s*ی)?\s+[^\s:：]+\s*[:：]/u;
const RULE_RE = /^قانون(?:\s+این\s+است)?\s*[:：]\s*/u;
const BULLET_RE = /^(?:[-•]|\*(?!\*))\s+/u;
const NUMBERED_RE = /^[0-9۰-۹]+\s*[-–.)]\s*/u;

const isBoldLine = (line: string) => /^\*\*[\s\S]+\*\*$/.test(line);
const stripBold = (line: string) =>
  line.replace(/^\*\*\s*/, "").replace(/\s*\*\*$/, "").trim();
const isAuthorLike = (text: string) =>
  text.length <= 40 && !/[.:؟?!؛،«»]/.test(text);

function inlineParts(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);

  return parts.map((part, index) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={`strong-${index}`} className="font-black text-slate-950">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (/^`[^`]+`$/.test(part)) {
      return (
        <code
          key={`code-${index}`}
          className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[0.9em] font-bold text-violet-700"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

const displayStyle = {
  fontFamily: "var(--font-display), var(--font-body), Tahoma, sans-serif",
} as const;

function MarkdownContent({ lines }: { lines: string[] }) {
  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let lastKind = "";

  const push = (kind: string, node: ReactNode) => {
    nodes.push(node);
    lastKind = kind;
  };

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const value = paragraph.join(" ").trim();
    if (value) {
      push(
        "p",
        <p
          key={`p-${nodes.length}`}
          className="mb-6 text-[1.05rem] leading-9 text-slate-700 sm:text-[1.12rem]"
        >
          {inlineParts(value)}
        </p>
      );
    }
    paragraph = [];
  };

  const flushBullets = () => {
    if (!bullets.length) return;
    push(
      "ul",
      <ul
        key={`ul-${nodes.length}`}
        className="mb-7 space-y-3 pr-5 text-[1.02rem] leading-8 text-slate-700 sm:text-[1.1rem]"
      >
        {bullets.map((item, index) => (
          <li key={`${index}-${item}`} className="relative pr-2">
            <span className="absolute right-[-1.15rem] top-[0.72rem] h-2.5 w-2.5 rounded-full bg-violet-500" />
            {inlineParts(item)}
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  const flushAll = () => {
    flushParagraph();
    flushBullets();
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();

    if (!line) {
      flushAll();
      return;
    }

    const bold = isBoldLine(line);
    const text = bold ? stripBold(line) : line;

    // «خلاصه فصل»
    if (SUMMARY_RE.test(text)) {
      flushAll();
      push(
        "h2",
        <div
          key={`sum-${index}`}
          className="mb-5 mt-12 flex items-center gap-3 border-t border-slate-100 pt-8"
        >
          <span className="h-8 w-1.5 rounded-full bg-gradient-to-b from-violet-600 via-fuchsia-500 to-cyan-400" />
          <h2
            className="text-[1.55rem] leading-tight text-slate-950 sm:text-[2rem]"
            style={displayStyle}
          >
            {text}
          </h2>
        </div>
      );
      return;
    }

    // «مرحله اول: ...»
    if (STEP_RE.test(text)) {
      flushAll();
      push(
        "h3",
        <h3
          key={`step-${index}`}
          className="mb-4 mt-9 text-[1.25rem] leading-9 text-violet-700 sm:text-[1.45rem]"
          style={displayStyle}
        >
          {text}
        </h3>
      );
      return;
    }

    // نام گوینده‌ی نقل‌قول (مثلاً «ناپلئون هیل»)
    if (
      paragraph.length === 0 &&
      bullets.length === 0 &&
      nodes.length <= 2 &&
      (lastKind === "quote" || lastKind === "p") &&
      isAuthorLike(text)
    ) {
      push(
        "author",
        <div
          key={`author-${index}`}
          className="-mt-3 mb-8 text-sm font-black text-violet-600"
        >
          — {text}
        </div>
      );
      return;
    }

    // خط کاملاً بولد = نقل‌قول
    if (bold) {
      flushAll();
      push(
        "quote",
        <blockquote
          key={`quote-${index}`}
          className="mb-5 rounded-2xl border-r-4 border-violet-500 bg-violet-50/80 px-5 py-4 text-[1.02rem] font-bold leading-8 text-violet-950 sm:px-7"
        >
          {inlineParts(text)}
        </blockquote>
      );
      return;
    }

    // «قانون: ...»
    const ruleMatch = line.match(RULE_RE);
    if (ruleMatch) {
      flushAll();
      push(
        "rule",
        <div
          key={`rule-${index}`}
          className="mb-7 rounded-2xl border border-fuchsia-100 bg-fuchsia-50/70 px-5 py-4"
        >
          <div className="text-[11px] font-black tracking-[0.18em] text-fuchsia-600">
            قانون
          </div>
          <p className="mt-1 text-[1.05rem] font-bold leading-8 text-slate-800">
            {inlineParts(line.replace(RULE_RE, ""))}
          </p>
        </div>
      );
      return;
    }

    // تیتر مارک‌داون (#)
    if (/^#{1,6}\s+/u.test(line)) {
      flushAll();
      push(
        "h2",
        <h2
          key={`h-${index}`}
          className="mb-5 mt-10 text-[1.55rem] leading-tight text-slate-950 sm:text-[2rem]"
          style={displayStyle}
        >
          {inlineParts(line.replace(/^#{1,6}\s+/u, ""))}
        </h2>
      );
      return;
    }

    // لیست
    if (BULLET_RE.test(line) || NUMBERED_RE.test(line)) {
      flushParagraph();
      bullets.push(line.replace(BULLET_RE, "").replace(NUMBERED_RE, ""));
      return;
    }

    // نقل‌قول با >
    if (/^>\s?/u.test(line)) {
      flushAll();
      push(
        "quote",
        <blockquote
          key={`bq-${index}`}
          className="mb-7 rounded-2xl border-r-4 border-violet-500 bg-violet-50/80 px-5 py-4 text-[1.02rem] font-bold leading-8 text-violet-950 sm:px-7"
        >
          {inlineParts(line.replace(/^>\s?/u, ""))}
        </blockquote>
      );
      return;
    }

    flushBullets();
    paragraph.push(line);
  });

  flushAll();

  return <div>{nodes}</div>;
}

function countWords(lines: string[]) {
  return lines
    .join(" ")
    .replace(/[*#`>_]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/* ---------- Page ---------- */

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const chapter = findChapter(parseChapters(readMarkdown()), slug);

  if (!chapter) {
    return { title: "رشد و توسعه فردی | تکل" };
  }

  const title = PRINCIPLES[chapter.number - 1].title;

  return {
    title: `${title} | تکل`,
    description: `محتوای کامل اصل ${toFa(chapter.number)} توسعه فردی: ${title}`,
  };
}

export default async function PrinciplePage({ params }: PageProps) {
  const { slug } = await params;
  const chapters = parseChapters(readMarkdown());
  const chapter = findChapter(chapters, slug);

  if (!chapter) notFound();

  const number = chapter.number;
  const principleTitle = PRINCIPLES[number - 1].title;
  const contentLines = chapter.lines;
  const wordCount = countWords(contentLines);
  const prev = number > 1 ? PRINCIPLES[number - 2] : null;
  const next = number < TOTAL ? PRINCIPLES[number] : null;

  return (
    <main
      dir="rtl"
      className={`${displayFont.variable} ${bodyFont.variable} min-h-[100dvh] bg-[#F8F7FB] text-slate-900`}
      style={{ fontFamily: "var(--font-body), Tahoma, sans-serif" }}
    >
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-violet-200/35 blur-3xl" />
        <div className="absolute -left-32 bottom-10 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.025)_1px,transparent_1px)] bg-[size:34px_34px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-20 pt-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-2">
          <Link
            href="/games/personal-development"
            className="rounded-full border border-slate-200 bg-white/85 px-4 py-2 text-xs font-black text-slate-600 shadow-sm backdrop-blur transition hover:border-violet-300 hover:text-violet-700"
          >
            ← بازگشت به توسعه فردی
          </Link>

          <div className="rounded-full border border-violet-100 bg-violet-50/90 px-3 py-2 text-[11px] font-black text-violet-700">
            تکل / PERSONAL GROWTH
          </div>
        </header>

        <section className="relative py-12 sm:py-16">
          <div className="absolute right-[8%] top-20 hidden h-28 w-28 rotate-12 rounded-[2rem] border border-violet-200 bg-white/60 lg:block" />
          <div className="absolute left-[6%] top-10 hidden h-20 w-20 -rotate-6 rounded-full border border-cyan-200 bg-cyan-50/70 lg:block" />

          <div className="relative max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-2 text-[11px] font-black text-violet-700">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              اصل {toFa(number)} از {toFa(TOTAL)}
            </div>

            <h1
              className="max-w-4xl text-[3rem] leading-[1.05] tracking-tight text-slate-950 sm:text-[4.7rem]"
              style={displayStyle}
            >
              {principleTitle}
            </h1>

            <div className="mt-7 flex max-w-3xl items-start gap-4">
              <div className="mt-2 h-16 w-1.5 shrink-0 rounded-full bg-gradient-to-b from-violet-600 via-fuchsia-500 to-cyan-400" />
              <p className="text-base font-bold leading-8 text-slate-600 sm:text-lg">
                شرح کامل این اصل از کتاب «قورباغه‌تان را قورت دهید» در ادامه آمده است.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <aside className="lg:sticky lg:top-6">
            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_24px_70px_rgba(15,23,42,0.14)] sm:p-7">
              <div className="text-xs font-black tracking-[0.18em] text-violet-300">
                PERSONAL GROWTH
              </div>

              <div className="mt-5 text-5xl" aria-hidden="true">
                🐸
              </div>

              <div className="mt-6 h-px bg-white/10" />

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-[11px] font-bold text-slate-400">
                    کلمات
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    {toFa(wordCount)}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 p-4">
                  <div className="text-[11px] font-bold text-slate-400">
                    اصل
                  </div>
                  <div className="mt-1 text-2xl font-black">
                    {toFa(number)} / {toFa(TOTAL)}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-bold leading-7 text-slate-300">
                یک ایده را انتخاب کن، امروز اجراش کن و نتیجه را یادداشت کن.
              </div>
            </div>
          </aside>

          <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-9 lg:p-11">
            {contentLines.length > 0 ? (
              <MarkdownContent lines={contentLines} />
            ) : (
              <p className="text-base font-bold leading-8 text-slate-600">
                محتوای این بخش در فایل توسعه فردی پیدا نشد.
              </p>
            )}

            <div className="mt-10 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
              {prev ? (
                <Link
                  href={`/games/personal-development/${prev.slug}`}
                  className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700"
                >
                  → اصل قبلی
                </Link>
              ) : null}

              {next ? (
                <Link
                  href={`/games/personal-development/${next.slug}`}
                  className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
                >
                  اصل بعدی ←
                </Link>
              ) : null}

              <Link
                href="/games/personal-development"
                className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-600 transition hover:border-violet-300 hover:text-violet-700"
              >
                بازگشت به مسیر توسعه فردی
              </Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}