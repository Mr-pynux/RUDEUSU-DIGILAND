"use client";

import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useMarketplace } from "./store";

export function Footer() {
  const catalog = useMarketplace((s) => s.catalog);
  const goHome = useMarketplace((s) => s.goHome);
  const setCategoryFilter = useMarketplace((s) => s.setCategoryFilter);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const setSellerOpen = useMarketplace((s) => s.setSellerOpen);
  const goAdmin = useMarketplace((s) => s.goAdmin);
  const { t, cat } = useI18n();

  const categories = catalog?.categories ?? [];
  const year = new Date().getFullYear();

  const soon = () => {
    /* demo placeholder */
  };

  const openCategory = (slug: string) => {
    setCategoryFilter(slug);
    goHome();
    setTimeout(() => {
      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

  return (
    <footer className="mt-auto border-t border-white/10 bg-black/25">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl ring-2 ring-fuchsia-400/40">
              { }
              <img src="/logo.jpg" alt="RUDEUSU DIGILAND logo" className="h-full w-full object-cover" />
            </span>
            <p className="text-lg font-extrabold tracking-tight text-white">
              RUDEUSU{" "}
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">
                DIGILAND
              </span>
            </p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("footer.about")}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
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
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">
            {t("footer.categories")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <button
                  onClick={() => openCategory(c.slug)}
                  className="transition hover:text-fuchsia-200"
                >
                  {c.emoji} {cat(c.slug, c.name)}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="For buyers">
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">
            {t("footer.buyers")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <button onClick={() => setOrdersOpen(true)} className="transition hover:text-fuchsia-200">
                {t("footer.purchases")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.protection")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.refund")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.faq")}
              </button>
            </li>
          </ul>
        </nav>

        <nav aria-label="For sellers">
          <p className="text-sm font-bold uppercase tracking-wide text-foreground/80">
            {t("footer.sellers")}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <button onClick={() => setSellerOpen(true)} className="transition hover:text-fuchsia-200">
                {t("footer.startSelling")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.rules")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.payouts")}
              </button>
            </li>
            <li>
              <button onClick={soon} className="transition hover:text-fuchsia-200">
                {t("footer.support")}
              </button>
            </li>
            <li>
              <button
                onClick={goAdmin}
                className="flex items-center gap-1.5 font-semibold text-fuchsia-300 transition hover:text-fuchsia-200"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("footer.admin")}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row lg:px-8">
          <p>{t("footer.copyright", { year })}</p>
          <p>{t("footer.badges")}</p>
        </div>
      </div>
    </footer>
  );
}
