"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { galleryItems, type GalleryItem } from "./gallery-data";

/* =========================================================
   DEVICE MODE
   mobile  : عرض کمتر از 768
   desktop : بقیه
   tv      : تشخیص از User-Agent تلویزیون‌ها
   برای تست:  /games/gallery?mode=tv   (یا mobile / desktop)
========================================================= */

type Mode = "mobile" | "desktop" | "tv";

const TV_UA = /SMART-TV|SmartTV|Tizen|Web0S|WebOS|HbbTV|BRAVIA|AFTM|Android TV|GoogleTV|NetCast|CrKey/i;

function useDeviceMode(): Mode | null {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("mode");
    const isTvUa = TV_UA.test(navigator.userAgent);

    const calc = () => {
      if (forced === "tv" || forced === "desktop" || forced === "mobile") {
        setMode(forced);
        return;
      }
      if (isTvUa) {
        setMode("tv");
        return;
      }
      setMode(window.innerWidth < 768 ? "mobile" : "desktop");
    };

    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  return mode;
}

/* =========================================================
   FILTERS
========================================================= */

type Filter = "all" | "image" | "video";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "image", label: "عکس‌ها" },
  { id: "video", label: "ویدیوها" },
];

const SLIDE_MS = 7000; // مدت نمایش هر عکس در اسلایدشوی تلویزیون

/* =========================================================
   ICONS (SVG داخلی، بدون import)
========================================================= */

type IconName = "play" | "close" | "next" | "prev" | "image" | "video";

const iconPaths: Record<IconName, ReactNode> = {
  play: <path d="M8 5v14l11-7z" fill="currentColor" stroke="none" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  next: <path d="M15 5l-7 7 7 7" />,
  prev: <path d="M9 5l7 7-7 7" />,
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 16l-5-5-8 8" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="3" />
      <path d="M16 10l5-3v10l-5-3z" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

/* =========================================================
   THUMB  (عکس / فریم ویدیو؛ اگر فایل نبود، جایگزین زیبا نشان می‌دهد)
========================================================= */

function Thumb({ item, className = "" }: { item: GalleryItem; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-600 ${className}`}
      >
        <Icon name={item.type === "video" ? "video" : "image"} className="h-8 w-8" />
      </div>
    );
  }

  if (item.type === "video" && !item.poster) {
    return (
      <video
        src={`${item.src}#t=0.5`}
        muted
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        className={`pointer-events-none bg-slate-900 object-cover ${className}`}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.type === "video" ? item.poster : item.src}
      alt={item.title}
      loading="lazy"
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

function PlayBadge({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl backdrop-blur ${
        large ? "h-24 w-24" : "h-12 w-12"
      }`}
    >
      <Icon name="play" className={large ? "h-10 w-10" : "h-5 w-5"} />
    </span>
  );
}

/* =========================================================
   TABS
========================================================= */

function Tabs({
  filter,
  onChange,
  counts,
  large = false,
}: {
  filter: Filter;
  onChange: (f: Filter) => void;
  counts: Record<Filter, number>;
  large?: boolean;
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white/80 shadow-sm backdrop-blur-xl ${
        large ? "gap-2 p-2" : "gap-1 p-1"
      }`}
    >
      {FILTERS.map((f) => {
        const active = f.id === filter;
        return (
          <button
            key={f.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(f.id)}
            className={`flex items-center gap-2 rounded-full font-black transition ${
              large ? "px-8 py-4 text-xl" : "px-4 py-2 text-xs"
            } ${active ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900"}`}
          >
            {f.label}
            <span
              className={`rounded-full font-black ${large ? "px-3 py-0.5 text-base" : "px-2 py-0.5 text-[10px]"} ${
                active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"
              }`}
            >
              {counts[f.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   VIEWER  (نمایش تمام‌صفحه؛ رفتار بسته به دستگاه)
   mobile  : کشیدن انگشت برای ورق زدن
   desktop : فلش‌ها + کیبورد + نوار بندانگشتی
   tv      : فقط ریموت (جهت‌ها/OK/Back)، اسلایدشوی خودکار
========================================================= */

function Viewer({
  items,
  index,
  mode,
  onClose,
  onChange,
}: {
  items: GalleryItem[];
  index: number;
  mode: Mode;
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const item = items[index];
  const tv = mode === "tv";

  const next = useCallback(() => onChange((index + 1) % items.length), [index, items.length, onChange]);
  const prev = useCallback(
    () => onChange((index - 1 + items.length) % items.length),
    [index, items.length, onChange]
  );

  // کیبورد و ریموت (صفحه RTL است: چپ = بعدی، راست = قبلی)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        prev();
      } else if (e.key === "Escape" || e.key === "Backspace" || e.keyCode === 10009 || e.keyCode === 461) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // قفل اسکرول صفحه‌ی پشت
  useEffect(() => {
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
    };
  }, []);

  // اسلایدشوی خودکار تلویزیون برای عکس‌ها
  useEffect(() => {
    if (!tv || item.type !== "image") return;
    const t = setTimeout(next, SLIDE_MS);
    return () => clearTimeout(t);
  }, [tv, item, next]);

  return (
    <motion.div
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-950/95 text-white backdrop-blur-xl"
    >
      {/* TOP BAR */}
      <div className={`flex items-center justify-between ${tv ? "px-14 py-8" : "px-4 py-3 sm:px-8 sm:py-5"}`}>
        <span className={`font-black text-white/60 ${tv ? "text-2xl" : "text-xs"}`}>
          {index + 1} / {items.length}
        </span>
        {!tv && (
          <button
            onClick={onClose}
            aria-label="بستن"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <Icon name="close" />
          </button>
        )}
      </div>

      {/* MEDIA */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            drag={mode === "mobile" && item.type === "image" ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={(_, info) => {
              // در RTL کشیدن به راست = بعدی
              if (info.offset.x > 80) next();
              else if (info.offset.x < -80) prev();
            }}
            className={`flex h-full w-full items-center justify-center ${tv ? "px-14" : "px-2 sm:px-20"}`}
          >
            {item.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.title}
                draggable={false}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              />
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                controls={!tv}
                autoPlay
                playsInline
                onEnded={tv ? next : undefined}
                className="max-h-full max-w-full rounded-2xl bg-black shadow-2xl"
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* دکمه‌های کناری فقط دسکتاپ */}
        {mode === "desktop" && items.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="قبلی"
              className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
            >
              <Icon name="prev" className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              aria-label="بعدی"
              className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/25"
            >
              <Icon name="next" className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {/* CAPTION */}
      <div className={`text-center ${tv ? "px-14 py-6" : "px-4 py-3"}`}>
        <p className={`font-black ${tv ? "text-4xl" : "text-sm"}`}>{item.title}</p>
        {item.caption && (
          <p className={`mt-1 font-medium text-white/60 ${tv ? "text-2xl" : "text-xs"}`}>{item.caption}</p>
        )}
      </div>

      {/* DESKTOP: بندانگشتی */}
      {mode === "desktop" && items.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-8 pb-6">
          {items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => onChange(i)}
              aria-label={it.title}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl transition ${
                i === index ? "opacity-100 ring-2 ring-amber-400" : "opacity-50 hover:opacity-90"
              }`}
            >
              <Thumb item={it} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}

      {/* TV: نوار پیشرفت اسلایدشو + راهنما */}
      {tv && (
        <div className="px-14 pb-8">
          {item.type === "image" && (
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                key={item.id}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_MS / 1000, ease: "linear" }}
                className="h-full origin-right bg-amber-400"
              />
            </div>
          )}
          <p className="text-center text-lg font-bold text-white/40">← → حرکت • Back بستن</p>
        </div>
      )}
    </motion.div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function GalleryPage() {
  const mode = useDeviceMode();
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [focus, setFocus] = useState(0); // فقط برای تلویزیون
  const railRef = useRef<HTMLDivElement>(null);

  // ترتیب: اول عکس‌ها بعد ویدیوها (با چیدمان موبایل هماهنگ است)
  const images = useMemo(() => galleryItems.filter((i) => i.type === "image"), []);
  const videos = useMemo(() => galleryItems.filter((i) => i.type === "video"), []);
  const counts: Record<Filter, number> = {
    all: galleryItems.length,
    image: images.length,
    video: videos.length,
  };
  const items = useMemo(
    () => (filter === "all" ? [...images, ...videos] : filter === "image" ? images : videos),
    [filter, images, videos]
  );

  useEffect(() => {
    setFocus(0);
    setOpenIndex(null);
  }, [filter]);

  const indexOf = (item: GalleryItem) => items.findIndex((i) => i.id === item.id);
  const closeViewer = useCallback(() => setOpenIndex(null), []);

  // کنترل با ریموت تلویزیون (وقتی نمایشگر بسته است)
  useEffect(() => {
    if (mode !== "tv" || openIndex !== null) return;

    const onKey = (e: KeyboardEvent) => {
      const fi = FILTERS.findIndex((f) => f.id === filter);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setFocus((f) => Math.min(f + 1, items.length - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setFocus((f) => Math.max(f - 1, 0));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setFilter(FILTERS[(fi + 1) % FILTERS.length].id);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFilter(FILTERS[(fi - 1 + FILTERS.length) % FILTERS.length].id);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items.length) setOpenIndex(focus);
      } else if (e.key === "Escape" || e.key === "Backspace" || e.keyCode === 10009 || e.keyCode === 461) {
        e.preventDefault();
        router.back();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, openIndex, filter, items.length, focus, router]);

  // کارت فوکوس‌شده در ریل تلویزیون همیشه وسط بماند
  useEffect(() => {
    if (mode !== "tv") return;
    const el = railRef.current?.children[focus] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [focus, mode, filter]);

  if (!mode) return <main dir="rtl" className="min-h-screen bg-[#f5f7fa]" />;

  const tv = mode === "tv";
  const current = items[Math.min(focus, Math.max(items.length - 1, 0))];

  return (
    <main
      dir="rtl"
      className={`relative overflow-hidden bg-[#f5f7fa] text-slate-900 ${tv ? "h-screen" : "min-h-screen"}`}
    >
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute -left-48 top-[40%] h-[480px] w-[480px] rounded-full bg-violet-200/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(#0f172a 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      <div
        className={`relative z-10 mx-auto flex flex-col ${
          tv ? "h-full max-w-none px-14 py-8" : "max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10"
        }`}
      >
        {/* HEADER */}
        <header
          className={`flex items-center justify-between gap-3 ${tv ? "mb-6" : "mb-6 sm:mb-8"} ${
            mode === "mobile" ? "sticky top-0 z-20 -mx-4 bg-[#f5f7fa]/85 px-4 py-2 backdrop-blur-xl" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className={`flex items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm backdrop-blur-xl transition hover:text-slate-900 ${
                tv ? "h-14 w-14 text-2xl" : "h-10 w-10 text-sm"
              }`}
              aria-label="بازگشت"
            >
              →
            </Link>
            <h1 className={`font-black tracking-tight text-slate-900 ${tv ? "text-5xl" : "text-xl sm:text-2xl"}`}>
              گالری
            </h1>
          </div>

          <Tabs filter={filter} onChange={setFilter} counts={counts} large={tv} />
        </header>

        {items.length === 0 && (
          <p className="py-24 text-center text-sm font-bold text-slate-400">هنوز آیتمی در این بخش نیست.</p>
        )}

        {/* ================= MOBILE ================= */}
        {mode === "mobile" && items.length > 0 && (
          <div className="space-y-8 pb-10">
            {(filter === "all" || filter === "image") && images.length > 0 && (
              <section>
                {filter === "all" && <h2 className="mb-3 text-xs font-black text-slate-400">عکس‌ها</h2>}
                <div className="grid grid-cols-2 gap-2">
                  {images.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 8) * 0.04 }}
                      onClick={() => setOpenIndex(indexOf(item))}
                      className="relative aspect-square overflow-hidden rounded-2xl bg-slate-200 shadow-sm active:scale-[0.98]"
                    >
                      <Thumb item={item} className="h-full w-full" />
                    </motion.button>
                  ))}
                </div>
              </section>
            )}

            {(filter === "all" || filter === "video") && videos.length > 0 && (
              <section>
                {filter === "all" && <h2 className="mb-3 text-xs font-black text-slate-400">ویدیوها</h2>}
                <div className="space-y-3">
                  {videos.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i, 8) * 0.05 }}
                      onClick={() => setOpenIndex(indexOf(item))}
                      className="relative block aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 shadow-md active:scale-[0.99]"
                    >
                      <Thumb item={item} className="h-full w-full" />
                      <PlayBadge />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-right text-sm font-black text-white">
                        {item.title}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* ================= DESKTOP ================= */}
        {mode === "desktop" && items.length > 0 && (
          <div className="columns-2 gap-4 pb-10 md:columns-3 xl:columns-4">
            {items.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i, 12) * 0.04, duration: 0.5 }}
                onClick={() => setOpenIndex(i)}
                className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-slate-200 shadow-[0_8px_35px_rgba(15,23,42,0.06)] transition-shadow duration-500 hover:shadow-[0_24px_60px_rgba(15,23,42,0.15)]"
              >
                <Thumb
                  item={item}
                  className={`w-full transition-transform duration-700 group-hover:scale-105 ${
                    item.type === "video" ? "aspect-video" : "h-auto min-h-[140px]"
                  }`}
                />
                {item.type === "video" && <PlayBadge />}
                <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 text-right text-sm font-black text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.title}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* ================= TV ================= */}
        {tv && items.length > 0 && current && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* HERO */}
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[40px] bg-slate-900 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Thumb item={current} className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              {current.type === "video" && <PlayBadge large />}
              <div className="absolute inset-x-0 bottom-0 p-10">
                <p className="text-5xl font-black text-white">{current.title}</p>
                {current.caption && <p className="mt-3 text-2xl font-medium text-white/70">{current.caption}</p>}
              </div>
            </div>

            {/* RAIL */}
            <div ref={railRef} className="flex gap-6 overflow-x-hidden px-6 py-8">
              {items.map((item, i) => {
                const active = i === focus;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setFocus(i);
                      setOpenIndex(i);
                    }}
                    className={`relative aspect-video w-64 shrink-0 overflow-hidden rounded-3xl bg-slate-200 transition duration-300 ${
                      active ? "scale-110 shadow-2xl ring-4 ring-amber-400" : "opacity-60"
                    }`}
                  >
                    <Thumb item={item} className="h-full w-full" />
                    {item.type === "video" && <PlayBadge />}
                  </button>
                );
              })}
            </div>

            {/* HINT */}
            <p className="pb-1 text-center text-lg font-bold text-slate-400">
              ← → حرکت • ↑ ↓ تغییر بخش • OK باز کردن • Back بازگشت
            </p>
          </div>
        )}
      </div>

      {/* VIEWER */}
      <AnimatePresence>
        {openIndex !== null && items[openIndex] && (
          <Viewer
            items={items}
            index={openIndex}
            mode={mode}
            onClose={closeViewer}
            onChange={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </main>
  );
}