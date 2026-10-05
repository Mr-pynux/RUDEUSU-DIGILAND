"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  BadgeCheck,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Headphones,
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
import { ProductGrid } from "./product-card";
import { useMarketplace } from "./store";
import { CoverTile, Price, Stars } from "./ui-bits";

/* ---------------- Hero ---------------- */

export function Hero() {
  const setSearchQuery = useMarketplace((s) => s.setSearchQuery);
  const searchQuery = useMarketplace((s) => s.searchQuery);
  const stats = useMarketplace((s) => s.catalog?.stats);

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
            The digital goods marketplace — plati-style, reinvented
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
            Buy{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent">
              Gemini Pro, GPT&nbsp;Plus, IPTV
            </span>{" "}
            & 500+ digital goods with instant delivery
          </h1>

          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            RUDEUSU DIGILAND connects verified sellers with buyers worldwide.
            Pay by card, PayPal or crypto — your activation codes, accounts and
            subscriptions land in your inbox within seconds, protected by our
            money-back guarantee.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              scrollToCatalog();
            }}
            className="mt-1 flex w-full max-w-xl items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={scrollToCatalog}
                placeholder="What are you looking for today?"
                className="h-12 rounded-2xl border-white/10 bg-white/5 pl-11 pr-4 text-[15px] shadow-lg shadow-black/20"
                aria-label="Search the marketplace"
              />
            </div>
            <button
              type="submit"
              className="h-12 shrink-0 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/30 transition hover:from-violet-400 hover:to-fuchsia-400"
            >
              Search
            </button>
          </form>

          <dl className="mt-3 grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Products", value: stats ? `${stats.totalProducts}+` : "—" },
              { label: "Goods sold", value: stats ? stats.totalSales.toLocaleString() : "—" },
              { label: "Avg. rating", value: stats ? stats.avgRating.toFixed(1) : "—" },
              { label: "Orders", value: stats ? `${(stats.totalOrders / 1000).toFixed(0)}k` : "—" },
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
              ⚡ Delivered just now
            </p>
            {[
              { emoji: "🧠", title: "ChatGPT Plus — 1 Month", code: "GPT-7HK2-9DQM-XT4A", grad: "from-emerald-500 via-teal-500 to-cyan-500" },
              { emoji: "✨", title: "Gemini Pro — 12 Months", code: "GEM-2P9K-QW3N-88MJ", grad: "from-violet-500 via-fuchsia-500 to-rose-400" },
              { emoji: "📡", title: "IPTV Premium — 12 Months", code: "IPTV-91XQ-2LMW-TT5R", grad: "from-emerald-500 via-lime-500 to-yellow-400" },
            ].map((item, i) => (
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
                  <p className="font-mono text-xs text-emerald-300">{item.code}</p>
                </div>
                <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-400" />
              </motion.div>
            ))}
            <p className="flex items-center gap-1.5 pl-1 text-xs text-muted-foreground">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Average delivery time: 9 seconds
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------- Trust strip ---------------- */

export function TrustStrip() {
  const items = [
    { icon: Zap, title: "Instant delivery", text: "Automated goods arrive in seconds — 24/7" },
    { icon: ShieldCheck, title: "Buyer protection", text: "Money-back guarantee on every order" },
    { icon: BadgeCheck, title: "Verified sellers", text: "Ratings & reviews from real buyers" },
    { icon: Headphones, title: "Live support", text: "Real humans in chat, any time" },
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
            🔥 Flash deals
          </span>
          biggest discounts today
        </h2>
      </div>
      <div className="nice-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {deals.map((p: ApiProduct) => (
          <button
            key={p.id}
            onClick={() => openProduct(p.slug)}
            className="group w-64 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-card text-left transition-all hover:-translate-y-1 hover:border-amber-300/40 hover:shadow-xl hover:shadow-amber-400/10 focus-visible:outline-none"
          >
            <CoverTile
              emoji={p.emoji}
              gradient={p.gradient}
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

  return (
    <section id="catalog" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-8 lg:px-8">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Browse the catalog
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} product{filtered.length === 1 ? "" : "s"}
          {categoryFilter
            ? ` in ${catalog?.categories.find((c) => c.slug === categoryFilter)?.name ?? ""}`
            : ""}
          {searchQuery ? ` matching “${searchQuery}”` : ""}
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
          All goods
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
            {c.name}
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
            placeholder="Filter results..."
            className="h-9 border-white/10 bg-white/5"
            aria-label="Filter products"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-fuchsia-300 hover:text-fuchsia-200"
            >
              Clear
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
            In stock only
          </Label>
        </div>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="h-9 w-[190px] border-white/10 bg-white/5 text-[13px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">🔥 Most popular</SelectItem>
            <SelectItem value="price-asc">💵 Price: low → high</SelectItem>
            <SelectItem value="price-desc">💰 Price: high → low</SelectItem>
            <SelectItem value="rating">⭐ Highest rated</SelectItem>
            <SelectItem value="newest">🆕 Newest</SelectItem>
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
  const steps = [
    {
      n: "01",
      title: "Choose your goods",
      text: "Browse verified sellers across AI subscriptions, IPTV, music, gaming and software keys. Every listing shows real ratings, stock and delivery speed.",
      icon: Layers,
    },
    {
      n: "02",
      title: "Pay your way",
      text: "Checkout with card, PayPal, crypto or Apple Pay. Funds are held by escrow until the order is confirmed — sellers never see your card details.",
      icon: CreditCard,
    },
    {
      n: "03",
      title: "Receive in seconds",
      text: "Activation codes and accounts are delivered instantly to your screen and email. Something wrong? The warranty covers free replacement or refund.",
      icon: Zap,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 lg:px-8" aria-label="How it works">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          How RUDEUSU DIGILAND works
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          From click to activation in under a minute — the plati-marketplace
          experience, modernized.
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
          <h3 className="text-lg font-bold text-white">Got digital goods to sell?</h3>
          <p className="text-sm text-muted-foreground">
            List your first product in 2 minutes — no listing fee, 5% only when sold.
          </p>
        </div>
        <button
          onClick={() => setSellerOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 transition hover:from-violet-400 hover:to-fuchsia-400"
        >
          Open seller center
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
