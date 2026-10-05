"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  ChevronLeft,
  Clock,
  Lock,
  MessageSquare,
  Minus,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Store,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ApiReview } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useMarketplace } from "./store";
import { BadgePill, CoverTile, Price, Stars } from "./ui-bits";

export function ProductDetail() {
  const view = useMarketplace((s) => s.view);
  const catalog = useMarketplace((s) => s.catalog);
  const goHome = useMarketplace((s) => s.goHome);
  const addToCart = useMarketplace((s) => s.addToCart);
  const setCartOpen = useMarketplace((s) => s.setCartOpen);
  const { toast } = useToast();
  const { t } = useI18n();

  const slug = view.name === "product" ? view.slug : null;
  const product = catalog?.products.find((p) => p.slug === slug) ?? null;

  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [qty, setQty] = useState(1);

  // review form state
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setQty(1);
    if (!slug) return;
    setReviewsLoading(true);
    setReviews([]);
    fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setReviewsLoading(false));
  }, [slug]);

  if (view.name !== "product") return null;

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Skeleton className="h-64 w-full rounded-3xl bg-white/5" />
        <Skeleton className="mt-5 h-8 w-2/3 rounded-xl bg-white/5" />
        <Skeleton className="mt-3 h-40 w-full rounded-2xl bg-white/5" />
      </div>
    );
  }

  const out = product.stock <= 0;

  const submitReview = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: product.slug, author, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save review");
      setReviews((prev) => [data.review as ApiReview, ...prev]);
      toast({ title: t("detail.reviewPublished"), description: t("detail.reviewThanks") });
      setAuthor("");
      setComment("");
      setRating(5);
    } catch (e) {
      toast({
        title: t("detail.reviewFailed"),
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-7xl px-4 py-6 lg:px-8"
    >
      <button
        onClick={goHome}
        className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-fuchsia-200"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        {t("detail.back")}
      </button>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
        {/* ---- left column ---- */}
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-3xl">
            <CoverTile
              emoji={product.emoji}
              gradient={product.gradient}
              imageUrl={product.imageUrl}
              className="h-56 w-full sm:h-64"
              emojiClassName="text-8xl"
            />
            <div className="absolute start-4 top-4 flex gap-2">
              {product.badge ? <BadgePill badge={product.badge} /> : null}
              <span className="rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur">
                {product.categoryName}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-fuchsia-300">
              {product.brand}
            </p>
            <h1 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
              {product.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Stars rating={product.rating} />
                <b className="text-foreground">{product.rating.toFixed(1)}</b>
                {t("detail.ratings", { n: product.ratingCount })}
              </span>
              <span>· {t("card.sold", { n: product.sold.toLocaleString() })}</span>
              <span className="flex items-center gap-1 text-emerald-300">
                <Zap className="h-3.5 w-3.5" />
                {product.deliveryType === "INSTANT" ? t("detail.instant") : t("detail.manual")}
              </span>
            </div>
          </div>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList className="h-11 justify-start gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              <TabsTrigger value="about" className="rounded-xl px-4 data-[state=active]:bg-white/10">
                {t("detail.tabAbout")}
              </TabsTrigger>
              <TabsTrigger value="included" className="rounded-xl px-4 data-[state=active]:bg-white/10">
                {t("detail.tabIncluded")}
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-xl px-4 data-[state=active]:bg-white/10">
                <MessageSquare className="me-1.5 inline h-3.5 w-3.5" />
                {t("detail.tabReviews", { n: reviews.length })}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-4">
              <div className="rounded-2xl border border-white/10 bg-card/70 p-5">
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                  {product.description}
                </p>
                {product.requirements ? (
                  <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-400/10 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-300">
                      {t("detail.requirements")}
                    </p>
                    <p className="mt-1 text-sm text-foreground/85">{product.requirements}</p>
                  </div>
                ) : null}
              </div>
            </TabsContent>

            <TabsContent value="included" className="mt-4">
              <div className="rounded-2xl border border-white/10 bg-card/70 p-5">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {product.features.split("\n").filter(Boolean).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/90">
                      <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="grid gap-5 md:grid-cols-[240px_1fr]">
                <div className="h-fit rounded-2xl border border-white/10 bg-card/70 p-5 text-center">
                  <p className="text-5xl font-black text-white">{product.rating.toFixed(1)}</p>
                  <Stars rating={product.rating} size="lg" className="mt-2 justify-center" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t("detail.ratingsVerified", { n: product.ratingCount.toLocaleString() })}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* review list */}
                  <div className="nice-scroll max-h-80 space-y-3 overflow-y-auto pe-1">
                    {reviewsLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-20 rounded-2xl bg-white/5" />
                        ))
                      : reviews.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-2xl border border-white/10 bg-card/70 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="flex items-center gap-2 text-sm font-bold text-foreground">
                                {r.author}
                                {r.verified ? (
                                  <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                                    <BadgeCheck className="h-3 w-3" />
                                    {t("detail.verifiedPurchase")}
                                  </span>
                                ) : null}
                              </p>
                              <Stars rating={r.rating} />
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                              {r.comment}
                            </p>
                          </div>
                        ))}
                    {!reviewsLoading && reviews.length === 0 ? (
                      <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-muted-foreground">
                        {t("detail.noReviews")}
                      </p>
                    ) : null}
                  </div>

                  {/* review form */}
                  <div className="rounded-2xl border border-white/10 bg-card/70 p-4">
                    <p className="mb-3 text-sm font-bold text-foreground">{t("detail.leaveReview")}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setRating(v)}
                          aria-label={`${v} star${v > 1 ? "s" : ""}`}
                          className={`rounded-full px-2.5 py-1 text-lg transition ${
                            v <= rating ? "grayscale-0" : "opacity-40 grayscale"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 grid gap-2.5">
                      <Input
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder={t("detail.yourName")}
                        className="h-10 border-white/10 bg-white/5"
                      />
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder={t("detail.reviewPlaceholder")}
                        className="min-h-20 border-white/10 bg-white/5"
                      />
                      <Button
                        onClick={submitReview}
                        disabled={submitting}
                        className="h-10 w-fit rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                      >
                        {submitting ? t("detail.publishing") : t("detail.publishReview")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* ---- right buy box ---- */}
        <aside className="lg:sticky lg:top-32">
          <div className="rounded-3xl border border-white/10 bg-card/80 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <Price price={product.price} oldPrice={product.oldPrice} size="lg" />
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  out ? "bg-rose-400" : product.stock < 20 ? "bg-amber-400" : "bg-emerald-400"
                }`}
              />
              {out
                ? t("detail.soldOutRestock")
                : t("detail.inStockN", { n: product.stock })}{" "}
              · {product.deliveryType === "INSTANT" ? t("detail.autoDelivery") : t("detail.upTo12h")}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground">{t("detail.qty")}</span>
              <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-40"
                  aria-label={t("cart.decrease")}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-foreground">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), 10, q + 1))}
                  disabled={out || qty >= Math.min(product.stock, 10)}
                  className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10 disabled:opacity-40"
                  aria-label={t("cart.increase")}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5">
              <Button
                disabled={out}
                onClick={() => {
                  if (addToCart(product, qty)) {
                    toast({ title: t("card.addedTitle"), description: product.title });
                    setCartOpen(true);
                  }
                }}
                className="h-11 gap-2 rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 text-sm font-bold text-fuchsia-100 hover:bg-fuchsia-500/20"
              >
                <ShoppingCart className="h-4 w-4" />
                {t("detail.addToCart")}
              </Button>
              <Button
                disabled={out}
                onClick={() => {
                  if (addToCart(product, qty)) {
                    setCartOpen(true);
                  }
                }}
                className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:from-violet-400 hover:to-fuchsia-400"
              >
                <Zap className="h-4 w-4" />
                {t("detail.buyNow")}
              </Button>
            </div>

            <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[13px] text-muted-foreground">
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
                {t("detail.guarantee")}
              </li>
              <li className="flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 shrink-0 text-emerald-400" />
                {t("detail.warranty")}
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0 text-emerald-400" />
                {t("detail.escrow")}
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-emerald-400" />
                {t("detail.support")}
              </li>
            </ul>

            {/* seller card */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-lg">
                🛍️
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
                  <Store className="h-3.5 w-3.5 text-fuchsia-300" />
                  {product.sellerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  ⭐ {product.sellerRating.toFixed(1)} · {product.sellerSales.toLocaleString()} {t("detail.sold")}
                </p>
              </div>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-bold uppercase text-emerald-300">
                <BadgeCheck className="h-3 w-3" /> {t("detail.verified")}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}
