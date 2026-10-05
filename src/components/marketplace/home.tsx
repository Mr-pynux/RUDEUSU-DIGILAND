"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronRight,
  CreditCard,
  Headphones,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ApiProduct } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { ProductGrid } from "./product-card";
import { useMarketplace } from "./store";
import { CoverTile, Price, Stars } from "./ui-bits";

/* ---------------- Hero ---------------- */

const SHOWCASE = [
  { emoji: "🧠", grad: "from-emerald-500 via-teal-500 to-cyan-500", code: "GPT-7HK2-9DQM-XT4A", title: "ChatGPT Plus — 1 Month" },
  { emoji: "✨", grad: "from-violet-500 via-fuchsia-500 to-rose-400", code: "GEM-2P9K-QW3N-88MJ", title: "Gemini Pro — 12 Months" },
  { emoji: "📡", grad: "from-lime-500 via-emerald-500 to-teal-500", code: "IPTV-91XQ-2LMW-TT5R", title: "IPTV Premium — 12 Months" },
];

export function Hero() {
  const setSearchQuery = useMarketplace((s) => s.setSearchQuery);
  const searchQuery = useMarketplace((s) => s.searchQuery);
  const stats = useMarketplace((s) => s.catalog?.stats);
  const { t } = useI18n();

  const scrollToCatalog = () =>
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-500/10 blur-[100px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-start gap-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3.5 py-1.5 text-xs font-semibold text-fuchsia-200">
            <Sparkles className="h-3.5 w-3.5" />
            {t("hero.badge")}
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[3.3rem]">
            {t("hero.titlePrefix")}{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              {t("hero.highlight")}
            </span>{" "}
            {t("hero.titleSuffix")}
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {t("hero.subtitle")}
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollToCatalog();
            }}
            className="mt-1 flex w-full max-w-xl items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={scrollToCatalog}
                placeholder={t("hero.searchPlaceholder")}
                className="h-12 rounded-2xl border-white/10 bg-white/5 ps-11 pe-4 text-[15px] shadow-lg shadow-black/20"
                aria-label="Search the marketplace"
              />
            </div>
            <button
              type="submit"
              className="h-12 shrink-0 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:from-violet-400 hover:to-fuchsia-400"
            >
              {t("hero.searchBtn")}
            </button>
          </form>

          <dl className="mt-3 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: t("hero.statProducts"), value: stats ? `${stats.totalProducts}+` : "—" },
              { label: t("hero.statSold"), value: stats ? stats.totalSales.toLocaleString() : "—" },
              { label: t("hero.statRating"), value: stats ? stats.avgRating.toFixed(1) : "—" },
              { label: t("hero.statOrders"), value: stats ? `${(stats.totalOrders / 1000).toFixed(0)}k` : "—" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </dt>
                <dd className="text-lg font-bold text-white">{s.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* floating showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto hidden w-full max-w-md lg:block"
          aria-hidden
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/15 to-transparent blur-2xl" />
          <div className="relative space-y-3 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-fuchsia-300">
              {t("hero.deliveredNow")}
            </p>
            {SHOWCASE.map((item, i) => (
              <motion.div
                key={item.code}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.18, duration: 0.4 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/90 p-3 shadow-lg"
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${item.grad}`}>
                  {item.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="font-mono text-xs text-emerald-300" dir="ltr">{item.code}</p>
                </div>
                <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-400" />
              </motion.div>
            ))}
            <p className="flex items-center gap-1.5 ps-1 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              {t("hero.avgDelivery")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Trust strip ---------------- */

export function TrustStrip() {
  const { t } = useI18n();
  const items = [
    { icon: Zap, title: t("trust.instantTitle"), text: t("trust.instantText") },
    { icon: ShieldCheck, title: t("trust.protectionTitle"), text: t("trust.protectionText") },
    { icon: BadgeCheck, title: t("trust.sellersTitle"), text: t("trust.sellersText") },
    { icon: Headphones, title: t("trust.supportTitle"), text: t("trust.supportText") },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8" aria-label="Marketplace guarantees">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {items.map((it) => (
          <div
            key={it.title}
            className="flex items-start gap-3 rounded-2xl border border-white/10 bg-card/60 p-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/25 to-fuchsia-500/25 text-fuchsia-200">
              <it.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">{it.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Flash deals ---------------- */

export function FlashDeals() {
  const catalog = useMarketplace((s) => s.catalog);
  const openProduct = useMarketplace((s) => s.openProduct);
  const { t } = useI18n();

  const deals = useMemo(
    () =>
      (catalog?.products ?? [])
        .filter((p) => p.oldPrice && p.oldPrice > p.price)
        .sort(
          (a, b) =>
            (b.oldPrice! - b.price) / b.oldPrice! - (a.oldPrice! - a.price) / a.oldPrice!
        )
        .slice(0, 8),
    [catalog]
  );

  if (deals.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8" aria-label="Flash deals">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
          <span className="rounded-lg bg-rose-500/15 px-2 py-0.5 text-sm font-bold uppercase text-rose-300">
            {t("deals.title")}
          </span>
          {t("deals.subtitle")}
        </h2>
      </div>
      <div className="nice-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {deals.map((p: ApiProduct) => (
          <button
            key={p.id}
            onClick={() => openProduct(p.slug)}
            className="group w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-card text-start transition-all hover:-translate-y-1 hover:border-amber-300/40 hover:shadow-xl hover:shadow-amber-400/10 focus-visible:outline-none"
          >
            <CoverTile
              emoji={p.emoji}
              gradient={p.gradient}
              imageUrl={p.imageUrl}
              className="h-24 w-full"
              emojiClassName="text-4xl"
            />
            <div className="space-y-2 p-3.5">
              <p className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-amber-200">
                {p.title}
              </p>
              <Stars rating={p.rating} />
              <Price price={p.price} oldPrice={p.oldPrice} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Catalog (categories + filters + grid) ---------------- */

export function CatalogSection() {
  const catalog = useMarketplace((s) => s.catalog);
  const categoryFilter = useMarketplace((s) => s.categoryFilter);
  const setCategoryFilter = useMarketplace((s) => s.setCategoryFilter);
  const searchQuery = useMarketplace((s) => s.searchQuery);
  const setSearchQuery = useMarketplace((s) => s.setSearchQuery);
  const sortOption = useMarketplace((s) => s.sortOption);
  const setSortOption = useMarketplace((s) => s.setSortOption);
  const stockOnly = useMarketplace((s) => s.stockOnly);
  const setStockOnly = useMarketplace((s) => s.setStockOnly);
  const { t, cat } = useI18n();

  const filtered = useMemo(() => {
    let list: ApiProduct[] = [...(catalog?.products ?? [])];
    if (categoryFilter) list = list.filter((p) => p.categorySlug === categoryFilter);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) =>
        [p.title, p.brand, p.shortDescription, p.categoryName, p.sellerName]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (stockOnly) list = list.filter((p) => p.stock > 0);
    switch (sortOption) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      default:
        list.sort((a, b) => b.sold - a.sold);
    }
    return list;
  }, [catalog, categoryFilter, searchQuery, sortOption, stockOnly]);

  const activeCategory = catalog?.categories.find((c) => c.slug === categoryFilter);

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          {t("catalog.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("catalog.count", { n: filtered.length })}
          {activeCategory ? ` ${t("catalog.in", { name: cat(activeCategory.slug, activeCategory.name) })}` : ""}
          {searchQuery ? ` ${t("catalog.matching", { q: searchQuery })}` : ""}
        </p>
      </div>

      {/* categories */}
      <div className="nice-scroll -mx-4 mb-5 flex gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
            categoryFilter === null
              ? "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100"
              : "border-white/10 bg-card text-foreground/80 hover:border-white/25"
          }`}
        >
          <Layers className="h-4 w-4" />
          {t("catalog.allGoods")}
        </button>
        {(catalog?.categories ?? []).map((c) => (
          <button
            key={c.slug}
            onClick={() => setCategoryFilter(categoryFilter === c.slug ? null : c.slug)}
            className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
              categoryFilter === c.slug
                ? "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100"
                : "border-white/10 bg-card text-foreground/80 hover:border-white/25"
            }`}
            title={c.tagline}
          >
            <span className="text-lg">{c.emoji}</span>
            {cat(c.slug, c.name)}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-muted-foreground">
              {c.productCount}
            </span>
          </button>
        ))}
      </div>

      {/* filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-card/60 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("catalog.filterPlaceholder")}
            className="h-9 border-white/10 bg-white/5"
            aria-label="Filter products"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="shrink-0 text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200"
            >
              {t("catalog.clear")}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Switch
            id="stock-only"
            checked={stockOnly}
            onCheckedChange={setStockOnly}
          />
          <Label htmlFor="stock-only" className="cursor-pointer text-[13px] text-muted-foreground">
            {t("catalog.inStockOnly")}
          </Label>
        </div>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="h-9 w-[200px] border-white/10 bg-white/5 text-[13px]" aria-label={t("catalog.sort")}>
            <SelectValue placeholder={t("catalog.sort")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">{t("catalog.sortPopular")}</SelectItem>
            <SelectItem value="price-asc">{t("catalog.sortPriceAsc")}</SelectItem>
            <SelectItem value="price-desc">{t("catalog.sortPriceDesc")}</SelectItem>
            <SelectItem value="rating">{t("catalog.sortRating")}</SelectItem>
            <SelectItem value="newest">{t("catalog.sortNewest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ProductGrid products={filtered} />
    </section>
  );
}

/* ---------------- How it works ---------------- */

export function HowItWorks() {
  const setSellerOpen = useMarketplace((s) => s.setSellerOpen);
  const { t } = useI18n();
  const steps = [
    { n: "01", title: t("how.s1Title"), text: t("how.s1Text"), icon: Layers },
    { n: "02", title: t("how.s2Title"), text: t("how.s2Text"), icon: CreditCard },
    { n: "03", title: t("how.s3Title"), text: t("how.s3Text"), icon: Zap },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8" aria-label="How it works">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          {t("how.title")}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          {t("how.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.1, duration: 0.35 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-6"
          >
            <span className="absolute -right-2 -top-4 text-6xl font-black text-white/[0.05]">
              {s.n}
            </span>
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/30 to-fuchsia-500/30 text-fuchsia-200">
              <s.icon className="h-6 w-6" />
            </span>
            <h3 className="mb-2 text-lg font-bold text-foreground">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-fuchsia-400/20 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-transparent p-6 sm:flex-row">
        <div>
          <h3 className="text-lg font-bold text-white">{t("how.ctaTitle")}</h3>
          <p className="text-sm text-muted-foreground">{t("how.ctaText")}</p>
        </div>
        <button
          onClick={() => setSellerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition hover:from-violet-400 hover:to-fuchsia-400"
        >
          {t("how.ctaBtn")}
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
    </section>
  );
}
