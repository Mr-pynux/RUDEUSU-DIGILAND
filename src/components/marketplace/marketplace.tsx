"use client";

import { useEffect } from "react";
import { useI18n, useLangStore } from "@/lib/i18n";
import { AdminPanel } from "@/components/admin/admin-panel";
import { Header } from "./header";
import { CatalogSection, FlashDeals, Hero, HowItWorks, TrustStrip } from "./home";
import { ProductDetail } from "./product-detail";
import {
  CartSheet,
  CheckoutDialog,
  OrdersDialog,
  SellerDialog,
  SuccessDialog,
} from "./dialogs";
import { Footer } from "./footer";
import { useMarketplace } from "./store";

export function Marketplace() {
  const loadCatalog = useMarketplace((s) => s.loadCatalog);
  const view = useMarketplace((s) => s.view);
  const { lang, dir } = useI18n();

  // hydrate persisted stores + fetch catalog on mount
  useEffect(() => {
    useMarketplace.persist.rehydrate();
    useLangStore.persist.rehydrate();
    loadCatalog();
  }, [loadCatalog]);

  // apply language + direction to <html>
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  // admin is a standalone full-screen view
  if (view.name === "admin") {
    return <AdminPanel />;
  }

  return (
    <div dir={dir} className="flex min-h-screen flex-col bg-[oklch(0.13_0.02_305)]">
      <Header />
      <main className="flex-1">
        {view.name === "home" ? (
          <>
            <Hero />
            <TrustStrip />
            <FlashDeals />
            <CatalogSection />
            <HowItWorks />
          </>
        ) : (
          <ProductDetail />
        )}
      </main>
      <Footer />

      {/* commerce overlays */}
      <CartSheet />
      <CheckoutDialog />
      <SuccessDialog />
      <OrdersDialog />
      <SellerDialog />
    </div>
  );
}
