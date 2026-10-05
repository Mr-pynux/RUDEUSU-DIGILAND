"use client";

import { FormEvent } from "react";
import { Search, ShoppingCart, Store, Zap, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  cartCount,
  useMarketplace,
} from "./store";

export function Header() {
  const cart = useMarketplace((s) => s.cart);
  const searchQuery = useMarketplace((s) => s.searchQuery);
  const setSearchQuery = useMarketplace((s) => s.setSearchQuery);
  const setCartOpen = useMarketplace((s) => s.setCartOpen);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const setSellerOpen = useMarketplace((s) => s.setSellerOpen);
  const goHome = useMarketplace((s) => s.goHome);
  const view = useMarketplace((s) => s.view);
  const count = cartCount(cart);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[oklch(0.13_0.02_305)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 lg:px-8">
        {/* Logo */}
        <button
          onClick={goHome}
          className="flex shrink-0 items-center gap-2.5 focus-visible:outline-none"
          aria-label="RUDEUSU DIGILAND home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400 shadow-lg shadow-fuchsia-500/25">
            <Zap className="h-5 w-5 fill-white text-white" />
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
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Gemini Pro, IPTV, Spotify, Windows keys..."
            className="h-11 rounded-full border-white/10 bg-white/5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus-visible:ring-fuchsia-400/50"
            aria-label="Search products"
          />
        </form>

        {/* Actions */}
        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-2" aria-label="Main actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdersOpen(true)}
            className="hidden h-10 gap-2 text-sm text-foreground/80 hover:bg-white/5 md:flex"
          >
            <Receipt className="h-4 w-4" />
            My orders
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOrdersOpen(true)}
            className="flex h-10 w-10 p-0 text-foreground/80 hover:bg-white/5 md:hidden"
            aria-label="My orders"
          >
            <Receipt className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => setSellerOpen(true)}
            className="hidden h-10 gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 text-sm font-semibold text-fuchsia-200 hover:bg-fuchsia-500/20 sm:flex"
          >
            <Store className="h-4 w-4" />
            Start selling
          </Button>
          <Button
            size="sm"
            onClick={() => setSellerOpen(true)}
            className="flex h-10 w-10 rounded-full p-0 sm:hidden"
            aria-label="Start selling"
          >
            <Store className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            onClick={() => setCartOpen(true)}
            className="relative h-10 gap-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 hover:from-violet-400 hover:to-fuchsia-400"
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
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
            Instant automatic delivery — goods arrive in seconds
          </p>
          <p className="hidden items-center gap-4 sm:flex">
            <span>🛡️ Buyer protection</span>
            <span>💬 24/7 support</span>
            <span>{view.name === "home" ? "🏠 Marketplace" : "🔎 Product"}</span>
          </p>
        </div>
      </div>
    </header>
  );
}
