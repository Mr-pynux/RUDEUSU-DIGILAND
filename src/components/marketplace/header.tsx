"use client";

import { FormEvent } from "react";
import { Languages, Receipt, Search, ShieldCheck, ShoppingCart, Store, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { cartCount, useMarketplace } from "./store";

export function Header() {
  const cart = useMarketplace((s) => s.cart);
  const searchQuery = useMarketplace((s) => s.searchQuery);
  const setSearchQuery = useMarketplace((s) => s.setSearchQuery);
  const setCartOpen = useMarketplace((s) => s.setCartOpen);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const setSellerOpen = useMarketplace((s) => s.setSellerOpen);
  const goHome = useMarketplace((s) => s.goHome);
  const goAdmin = useMarketplace((s) => s.goAdmin);
  const view = useMarketplace((s) => s.view);
  const count = cartCount(cart);
  const { t, lang, setLang } = useI18n();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[oklch(0.13_0.02_305)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:gap-4 sm:px-4 lg:px-8">
        {/* Logo */}
        <button
          onClick={goHome}
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none"
          aria-label="RUDEUSU DIGILAND home"
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-fuchsia-400/40 shadow-lg shadow-fuchsia-500/25">
            { }
            <img
              src="/logo.jpg"
              alt="RUDEUSU DIGILAND logo"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-[15px] font-extrabold tracking-tight text-white">
              RUDEUSU
            </span>
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-[11px] font-bold tracking-[0.22em] text-transparent">
              DIGILAND
            </span>
          </span>
        </button>

        {/* Search */}
        <form onSubmit={onSubmit} className="relative mx-auto w-full max-w-xl flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("header.searchPlaceholder")}
            className="h-11 rounded-full border-white/10 bg-white/5 ps-10 pe-4 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-fuchsia-400/50"
            aria-label="Search products"
          />
        </form>

        {/* Actions */}
        <nav className="flex shrink-0 items-center gap-1 sm:gap-1.5 lg:gap-2" aria-label="Main actions">
          {/* language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="h-10 gap-1.5 rounded-full px-2.5 text-[13px] font-bold text-foreground/80 hover:bg-white/5"
            aria-label="Switch language"
            title="English / العربية"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{t("header.language")}</span>
          </Button>

          {/* admin */}
          <Button
            variant="ghost"
            size="sm"
            onClick={goAdmin}
            className={`h-10 w-10 rounded-full p-0 text-foreground/70 hover:bg-white/5 ${
              view.name === "admin" ? "bg-white/10 text-fuchsia-200" : ""
            }`}
            aria-label={t("header.admin")}
            title={t("header.admin")}
          >
            <ShieldCheck className="h-4.5 w-4.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdersOpen(true)}
            className="hidden h-10 gap-2 text-sm text-foreground/80 hover:bg-white/5 lg:flex"
          >
            <Receipt className="h-4 w-4" />
            {t("header.myOrders")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdersOpen(true)}
            className="flex h-10 w-10 p-0 text-foreground/80 hover:bg-white/5 lg:hidden"
            aria-label={t("header.openOrders")}
          >
            <Receipt className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => setSellerOpen(true)}
            className="hidden h-10 gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-sm font-semibold text-fuchsia-200 hover:bg-fuchsia-500/20 xl:flex"
          >
            <Store className="h-4 w-4" />
            {t("header.startSelling")}
          </Button>
          <Button
            size="sm"
            onClick={() => setSellerOpen(true)}
            className="hidden h-10 w-10 rounded-full p-0 xl:hidden md:flex"
            aria-label={t("header.startSelling")}
          >
            <Store className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => setCartOpen(true)}
            className="relative h-10 gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3.5 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:from-violet-400 hover:to-fuchsia-400"
            aria-label={t("header.openCart", { n: count })}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">{t("header.cart")}</span>
            {count > 0 ? (
              <Badge className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {count}
              </Badge>
            ) : null}
          </Button>
        </nav>
      </div>

      {/* secondary strip */}
      <div className="border-t border-white/5 bg-black/10">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 text-[12px] text-muted-foreground lg:px-8">
          <p className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-300" />
            {t("header.stripInstant")}
          </p>
          <p className="hidden items-center gap-4 sm:flex">
            <span>{t("header.stripProtection")}</span>
            <span>{t("header.stripSupport")}</span>
            <span>{view.name === "product" ? t("header.stripProduct") : t("header.stripHome")}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
