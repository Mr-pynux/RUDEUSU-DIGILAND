"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { ApiProduct } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { useMarketplace } from "./store";
import { BadgePill, CoverTile, Price, Stars } from "./ui-bits";

export function ProductCard({ product }: { product: ApiProduct }) {
  const addToCart = useMarketplace((s) => s.addToCart);
  const openProduct = useMarketplace((s) => s.openProduct);
  const { toast } = useToast();
  const { t } = useI18n();

  const out = product.stock <= 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-fuchsia-400/40 hover:shadow-xl hover:shadow-fuchsia-500/10"
    >
      <button
        onClick={() => openProduct(product.slug)}
        className="relative block text-start focus-visible:outline-none"
        aria-label={t("card.view", { title: product.title })}
      >
        <CoverTile
          emoji={product.emoji}
          gradient={product.gradient}
          imageUrl={product.imageUrl}
          className="h-36 w-full"
          emojiClassName="text-6xl transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute start-3 top-3 flex flex-col gap-1.5">
          {product.badge ? <BadgePill badge={product.badge} /> : null}
        </div>
        {out ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]">
            <span className="rounded-full bg-rose-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              {t("card.soldOut")}
            </span>
          </div>
        ) : null}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-fuchsia-300/90">
          {product.brand}
          <span className="text-muted-foreground/60">· {product.categoryName}</span>
        </div>

        <button
          onClick={() => openProduct(product.slug)}
          className="line-clamp-2 text-start text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-fuchsia-200 focus-visible:outline-none"
        >
          {product.title}
        </button>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Stars rating={product.rating} />
          <span className="font-semibold text-foreground">{product.rating.toFixed(1)}</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {t("card.sold", { n: product.sold.toLocaleString() })}
          </span>
        </div>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {product.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <Price price={product.price} oldPrice={product.oldPrice} />
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {out ? t("card.restocking") : t("card.inStock", { n: product.stock })}
            </p>
          </div>
          <Button
            size="sm"
            disabled={out}
            onClick={() => {
              const ok = addToCart(product);
              toast({
                title: ok ? t("card.addedTitle") : t("card.outTitle"),
                description: ok ? product.title : t("card.outText"),
              });
            }}
            className="h-9 shrink-0 gap-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3.5 text-[13px] font-semibold text-white shadow-md shadow-fuchsia-500/20 hover:from-violet-400 hover:to-fuchsia-400"
          >
            <ShoppingCart className="h-4 w-4" />
            {t("card.add")}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card">
      <div className="h-36 w-full animate-pulse bg-muted/60" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
        <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted/60" />
        <div className="flex justify-between pt-2">
          <div className="h-6 w-16 animate-pulse rounded bg-muted/60" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-muted/60" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: ApiProduct[] }) {
  const catalogLoading = useMarketplace((s) => s.catalogLoading);
  const { t } = useI18n();

  if (catalogLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-card/50 py-16 text-center">
        <span className="text-4xl">🧭</span>
        <p className="font-semibold text-foreground">{t("catalog.emptyTitle")}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{t("catalog.emptyText")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
