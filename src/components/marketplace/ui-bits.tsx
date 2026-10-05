"use client";

import { useState } from "react";
import { Check, Copy, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { formatMoney } from "./store";

export function Stars({
  rating,
  size = "sm",
  className,
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { t } = useI18n();
  const px =
    size === "sm" ? "h-3.5 w-3.5" : size === "md" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={t("detail.starsAria", { n: rating })}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            px,
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

export function Price({
  price,
  oldPrice,
  size = "md",
}: {
  price: number;
  oldPrice?: number | null;
  size?: "md" | "lg";
}) {
  const discount =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : null;
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span
        className={cn(
          "font-bold tracking-tight text-emerald-300",
          size === "lg" ? "text-3xl" : "text-lg"
        )}
      >
        {formatMoney(price)}
      </span>
      {oldPrice && oldPrice > price ? (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {formatMoney(oldPrice)}
          </span>
          {discount ? (
            <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-bold text-rose-300">
              -{discount}%
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 gap-1.5 border-border/60 px-2.5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard unavailable */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      aria-label={label ?? t("copy.copy")}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      <span className="text-[11px]">{copied ? t("copy.copied") : t("copy.copy")}</span>
    </Button>
  );
}

/** Gradient cover tile with product emoji — used on cards & detail pages */
export function CoverTile({
  emoji,
  gradient,
  className,
  emojiClassName,
}: {
  emoji: string;
  gradient: string;
  className?: string;
  emojiClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-black/20 blur-2xl" />
      <span className={cn("relative text-6xl drop-shadow-lg", emojiClassName)}>{emoji}</span>
    </div>
  );
}

export function BadgePill({ badge }: { badge: string }) {
  const hot = badge.includes("HOT");
  const deal = badge.includes("DEAL") || badge.includes("%");
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow",
        hot
          ? "bg-rose-500 text-white"
          : deal
            ? "bg-amber-400 text-amber-950"
            : "bg-emerald-500 text-emerald-950"
      )}
    >
      {badge}
    </span>
  );
}
