"use client";

import { useEffect } from "react";
import { useMarketplace } from "./store";
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

export function Marketplace() {
  const loadCatalog = useMarketplace((s) => s.loadCatalog);
  const view = useMarketplace((s) => s.view);

  // hydrate persisted cart + fetch catalog on mount
  useEffect(() => {
    useMarketplace.persist.rehydrate();
    loadCatalog();
  }, [loadCatalog]);

  return (
    <div className="flex min-h-screen flex-col bg-[oklch(0.13_0.02_305)]">
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
