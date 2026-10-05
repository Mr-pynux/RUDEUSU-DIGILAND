"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMarketplace } from "./store";

export function Footer() {
  const setCategoryFilter = useMarketplace((s) => s.setCategoryFilter);
  const setSellerOpen = useMarketplace((s) => s.setSellerOpen);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const goHome = useMarketplace((s) => s.goHome);
  const catalog = useMarketplace((s) => s.catalog);
  const categories = catalog?.categories ?? [];
  const { toast } = useToast();
  const [year] = useState(() => new Date().getFullYear());

  const soon = (what: string) =>
    toast({ title: `${what} — coming soon`, description: "This demo marketplace keeps growing." });

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/25">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-lg font-extrabold tracking-tight text-white">
            RUDEUSU <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">DIGILAND</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            The instant-delivery marketplace for AI subscriptions, IPTV, streaming,
            gaming and software keys. Buyers are protected, sellers get paid.
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {["VISA", "MC", "PayPal", "₿", "Pay"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold tracking-wide text-muted-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <nav aria-label="Categories">
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">Categories</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => {
                    setCategoryFilter(c.slug);
                    goHome();
                    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="transition hover:text-fuchsia-200"
                >
                  {c.emoji} {c.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="For buyers">
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">For buyers</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <button onClick={() => setOrdersOpen(true)} className="transition hover:text-fuchsia-200">
                My purchases & codes
              </button>
            </li>
            <li>
              <button onClick={() => soon("Buyer protection")} className="transition hover:text-fuchsia-200">
                Buyer protection
              </button>
            </li>
            <li>
              <button onClick={() => soon("Refund policy")} className="transition hover:text-fuchsia-200">
                Refund policy
              </button>
            </li>
            <li>
              <button onClick={() => soon("FAQ")} className="transition hover:text-fuchsia-200">
                FAQ
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="For sellers">
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">For sellers</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <button onClick={() => setSellerOpen(true)} className="transition hover:text-fuchsia-200">
                Start selling
              </button>
            </li>
            <li>
              <button onClick={() => soon("Seller rules")} className="transition hover:text-fuchsia-200">
                Seller rules
              </button>
            </li>
            <li>
              <button onClick={() => soon("Payouts")} className="transition hover:text-fuchsia-200">
                Payouts
              </button>
            </li>
            <li>
              <button onClick={() => soon("Support")} className="transition hover:text-fuchsia-200">
                24/7 support
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>© {year} RUDEUSU DIGILAND — all digital goods are demo listings.</p>
          <p>⚡ Instant delivery · 🛡️ Escrow protected · 🌍 Serving 140+ countries</p>
        </div>
      </div>
    </footer>
  );
}
