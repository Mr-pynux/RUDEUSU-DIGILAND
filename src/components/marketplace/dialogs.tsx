"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bitcoin,
  CreditCard,
  Loader2,
  Mail,
  Minus,
  PackageOpen,
  Plus,
  Smartphone,
  ShoppingCart,
  Trash2,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ApiOrder } from "@/lib/types";
import {
  cartSubtotal,
  formatMoney,
  serviceFee,
  useMarketplace,
} from "./store";
import { CopyButton } from "./ui-bits";

const PAYMENTS = [
  { id: "card", label: "Credit / Debit Card", hint: "Visa · Mastercard", icon: CreditCard },
  { id: "paypal", label: "PayPal", hint: "Buyer protection", icon: Wallet },
  { id: "crypto", label: "Crypto", hint: "BTC · USDT · TON", icon: Bitcoin },
  { id: "applepay", label: "Apple Pay", hint: "One-tap checkout", icon: Smartphone },
];

/* ================= CART ================= */

export function CartSheet() {
  const open = useMarketplace((s) => s.cartOpen);
  const setOpen = useMarketplace((s) => s.setCartOpen);
  const cart = useMarketplace((s) => s.cart);
  const setQty = useMarketplace((s) => s.setQty);
  const removeFromCart = useMarketplace((s) => s.removeFromCart);
  const setCheckoutOpen = useMarketplace((s) => s.setCheckoutOpen);

  const subtotal = cartSubtotal(cart);
  const fee = serviceFee(subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-white/10 bg-[oklch(0.15_0.02_305)] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-white/10 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg text-white">
            <ShoppingCart className="h-5 w-5 text-fuchsia-300" />
            Your cart
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            Digital goods — delivered to your email right after payment.
          </SheetDescription>
        </SheetHeader>

        <div className="nice-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">🛒</span>
              <p className="font-semibold text-foreground">Your cart is empty</p>
              <p className="max-w-60 text-sm text-muted-foreground">
                Add AI subscriptions, IPTV or keys and check out in seconds.
              </p>
            </div>
          ) : (
            cart.map((line) => (
              <div
                key={line.slug}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
              >
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${line.gradient}`}
                >
                  {line.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {line.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                      <button
                        onClick={() => setQty(line.slug, line.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{line.quantity}</span>
                      <button
                        onClick={() => setQty(line.slug, line.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-emerald-300">
                      {formatMoney(line.price * line.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(line.slug)}
                  className="h-fit rounded-full p-1.5 text-muted-foreground transition hover:bg-rose-500/15 hover:text-rose-300"
                  aria-label={`Remove ${line.title} from cart`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 ? (
          <div className="space-y-3 border-t border-white/10 px-5 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Service fee (5% + $0.30)</span>
                <span className="text-foreground">{formatMoney(fee)}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-base font-bold text-white">
                <span>Total</span>
                <span>{formatMoney(subtotal + fee)}</span>
              </div>
            </div>
            <Button
              onClick={() => {
                setOpen(false);
                setCheckoutOpen(true);
              }}
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[15px] font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:from-violet-400 hover:to-fuchsia-400"
            >
              <Zap className="h-4 w-4" />
              Checkout — {formatMoney(subtotal + fee)}
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

/* ================= CHECKOUT ================= */

export function CheckoutDialog() {
  const open = useMarketplace((s) => s.checkoutOpen);
  const setOpen = useMarketplace((s) => s.setCheckoutOpen);
  const cart = useMarketplace((s) => s.cart);
  const clearCart = useMarketplace((s) => s.clearCart);
  const setSuccessOrder = useMarketplace((s) => s.setSuccessOrder);
  const lastEmail = useMarketplace((s) => s.lastEmail);
  const setLastEmail = useMarketplace((s) => s.setLastEmail);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail(lastEmail);
      setError(null);
    }
  }, [open, lastEmail]);

  const subtotal = cartSubtotal(cart);
  const fee = serviceFee(subtotal);

  const pay = async () => {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          paymentMethod: payment,
          items: cart.map((l) => ({ slug: l.slug, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Payment failed");
      setOpen(false);
      setSuccessOrder(data.order as ApiOrder);
      setLastEmail(email);
      clearCart();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Payment failed";
      setError(msg);
      toast({ title: "Payment failed", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <Zap className="h-5 w-5 text-amber-300" />
            Secure checkout
          </DialogTitle>
          <DialogDescription>
            Goods are delivered to your email + on screen immediately after payment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="buyer-email" className="text-sm text-foreground/90">
              Delivery email
            </Label>
            <Input
              id="buyer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-foreground/90">Payment method</Label>
            <RadioGroup
              value={payment}
              onValueChange={setPayment}
              className="grid grid-cols-2 gap-2"
            >
              {PAYMENTS.map((p) => (
                <Label
                  key={p.id}
                  htmlFor={`pay-${p.id}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                    payment === p.id
                      ? "border-fuchsia-400/60 bg-fuchsia-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <RadioGroupItem id={`pay-${p.id}`} value={p.id} className="sr-only" />
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-fuchsia-200">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold text-foreground">{p.label}</span>
                    <span className="block text-[11px] text-muted-foreground">{p.hint}</span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            {cart.map((l) => (
              <div key={l.slug} className="flex items-center justify-between gap-2 py-1 text-sm">
                <span className="min-w-0 flex-1 truncate text-foreground/85">
                  {l.emoji} {l.title} <span className="text-muted-foreground">×{l.quantity}</span>
                </span>
                <span className="font-semibold text-foreground/85">
                  {formatMoney(l.price * l.quantity)}
                </span>
              </div>
            ))}
            <Separator className="my-2 bg-white/10" />
            <div className="flex justify-between py-0.5 text-xs text-muted-foreground">
              <span>Service fee</span>
              <span>{formatMoney(fee)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-bold text-white">
              <span>Total</span>
              <span>{formatMoney(subtotal + fee)}</span>
            </div>
          </div>

          {error ? (
            <p className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          <Button
            onClick={pay}
            disabled={submitting || cart.length === 0}
            className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-[15px] font-bold text-white shadow-lg shadow-fuchsia-500/25 hover:from-violet-400 hover:to-fuchsia-400"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Processing payment...
              </>
            ) : (
              <>🔒 Pay {formatMoney(subtotal + fee)}</>
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Demo checkout — no real money is charged. escrow protected · SSL secured
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= ORDER SUCCESS / DELIVERY ================= */

export function SuccessDialog() {
  const order = useMarketplace((s) => s.successOrder);
  const setOrder = useMarketplace((s) => s.setSuccessOrder);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const setCartOpen = useMarketplace((s) => s.setCartOpen);

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && setOrder(null)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-xl">
        {order ? (
          <>
            <DialogHeader>
              <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                <BadgeCheck className="h-9 w-9 text-emerald-400" />
              </div>
              <DialogTitle className="text-center text-2xl text-white">
                Payment successful — goods delivered! 🎉
              </DialogTitle>
              <DialogDescription className="text-center">
                Order <b className="font-mono text-emerald-300">{order.shortId}</b> · a copy was
                sent to <b className="text-foreground/90">{order.buyerEmail}</b>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${item.gradient}`}
                    >
                      {item.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty {item.quantity} · {item.sellerName} · {formatMoney(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {item.codes.map((code, i) => (
                      <div
                        key={`${code}-${i}`}
                        className="flex items-center justify-between gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2"
                      >
                        <code className="truncate font-mono text-sm font-bold tracking-wider text-emerald-300">
                          {code}
                        </code>
                        <CopyButton value={code} label={`Copy code ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                  <details className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-fuchsia-300">
                      How to activate
                    </summary>
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                      {item.instructions}
                    </p>
                  </details>
                </div>
              ))}

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  Paid via <b className="uppercase text-foreground/80">{order.paymentMethod}</b>
                </span>
                <span className="text-lg font-bold text-white">{formatMoney(order.total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  onClick={() => {
                    setOrder(null);
                    setOrdersOpen(true);
                  }}
                  variant="outline"
                  className="h-11 rounded-2xl border-white/15 bg-white/5 font-semibold"
                >
                  <Mail className="h-4 w-4" />
                  My purchases
                </Button>
                <Button
                  onClick={() => {
                    setOrder(null);
                    setCartOpen(false);
                  }}
                  className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white"
                >
                  Continue shopping
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

/* ================= MY ORDERS ================= */

type FetchedOrders = { orders: ApiOrder[]; error?: string };

export function OrdersDialog() {
  const open = useMarketplace((s) => s.ordersOpen);
  const setOpen = useMarketplace((s) => s.setOrdersOpen);
  const lastEmail = useMarketplace((s) => s.lastEmail);
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail(lastEmail);
      setOrders(null);
    }
  }, [open, lastEmail]);

  const lookup = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      const data = (await res.json()) as FetchedOrders;
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setOrders(data.orders);
      if (data.orders.length === 0) {
        toast({ title: "No orders yet", description: `Nothing found for ${email}` });
      }
    } catch (e) {
      toast({
        title: "Lookup failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <PackageOpen className="h-5 w-5 text-fuchsia-300" />
            My purchases
          </DialogTitle>
          <DialogDescription>
            Enter the email you used at checkout to re-open your codes anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 border-white/10 bg-white/5"
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <Button
            onClick={lookup}
            disabled={loading}
            className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find orders"}
          </Button>
        </div>

        <div className="nice-scroll max-h-[50vh] space-y-3 overflow-y-auto pr-1">
          {orders?.map((o) => (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-sm font-bold text-emerald-300">{o.shortId}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()} · {o.paymentMethod.toUpperCase()}
                </p>
              </div>
              {o.items.map((item) => (
                <div key={item.slug} className="mt-3 space-y-1.5">
                  <p className="text-[13px] font-semibold text-foreground/90">
                    {item.emoji} {item.title} ×{item.quantity}
                  </p>
                  {item.codes.map((code, i) => (
                    <div
                      key={`${o.id}-${code}-${i}`}
                      className="flex items-center justify-between gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1.5"
                    >
                      <code className="truncate font-mono text-xs font-bold text-emerald-300">
                        {code}
                      </code>
                      <CopyButton value={code} />
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-3 flex justify-end border-t border-white/10 pt-2 text-sm">
                <span className="text-muted-foreground">Total&nbsp;</span>
                <span className="font-bold text-white">{formatMoney(o.total)}</span>
              </div>
            </div>
          ))}
          {orders && orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
              <p className="text-3xl">📭</p>
              <p className="mt-2 text-sm text-muted-foreground">
                No orders for this email yet.
              </p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= SELLER CENTER ================= */

const EMOJI_CHOICES = ["🛒", "✨", "🧠", "📺", "📡", "🎵", "🎮", "🔑", "🎨", "🎬", "💳", "📦"];

export function SellerDialog() {
  const open = useMarketplace((s) => s.sellerOpen);
  const setOpen = useMarketplace((s) => s.setSellerOpen);
  const catalog = useMarketplace((s) => s.catalog);
  const loadCatalog = useMarketplace((s) => s.loadCatalog);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("25");
  const [emoji, setEmoji] = useState("📦");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [deliveryType, setDeliveryType] = useState("INSTANT");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && !categorySlug && catalog && catalog.categories.length > 0) {
      setCategorySlug(catalog.categories[0].slug);
    }
  }, [open, catalog, categorySlug]);

  const publish = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categorySlug,
          price: Number(price),
          stock: Number(stock),
          emoji,
          shortDescription,
          description,
          features,
          deliveryType,
          sellerName: "Rudeusu",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not publish");
      toast({
        title: "Product published 🎉",
        description: `${data.product.title} is now live in the catalog.`,
      });
      await loadCatalog();
      setOpen(false);
      setTitle("");
      setPrice("");
      setShortDescription("");
      setDescription("");
      setFeatures("");
    } catch (e) {
      toast({
        title: "Publish failed",
        description: e instanceof Error ? e.message : "Try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            🏪 Seller Center
          </DialogTitle>
          <DialogDescription>
            List a digital product — it appears in the catalog instantly. Zero listing
            fee, 5% commission when sold.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5">
          <div className="grid gap-1.5">
            <Label htmlFor="sp-title" className="text-sm">Product title</Label>
            <Input
              id="sp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Adobe Creative Cloud — 6 Months"
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">Category</Label>
              <Select value={categorySlug} onValueChange={setCategorySlug}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5">
                  <SelectValue placeholder="Pick category" />
                </SelectTrigger>
                <SelectContent>
                  {(catalog?.categories ?? []).map((c) => (
                    <SelectItem key={c.slug} value={c.slug}>
                      {c.emoji} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">Delivery</Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTANT">⚡ Instant (automatic)</SelectItem>
                  <SelectItem value="MANUAL">🕐 Manual (≤ 12h)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sp-price" className="text-sm">Price (USD)</Label>
              <Input
                id="sp-price"
                type="number"
                min="0.5"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                className="h-10 border-white/10 bg-white/5"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sp-stock" className="text-sm">Quantity available</Label>
              <Input
                id="sp-stock"
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="h-10 border-white/10 bg-white/5"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">Cover icon</Label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_CHOICES.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`h-9 w-9 rounded-xl text-lg transition ${
                    emoji === e
                      ? "bg-fuchsia-500/25 ring-2 ring-fuchsia-400/60"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sp-short" className="text-sm">Short description (card teaser)</Label>
            <Input
              id="sp-short"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="One sentence buyers see on the card"
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sp-desc" className="text-sm">Full description</Label>
            <Textarea
              id="sp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain exactly what the buyer receives, how activation works and warranty terms..."
              className="min-h-20 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sp-features" className="text-sm">
              What the buyer gets (one per line)
            </Label>
            <Textarea
              id="sp-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={"License key\nStep-by-step activation guide\nLifetime warranty"}
              className="min-h-16 border-white/10 bg-white/5"
            />
          </div>

          <Button
            onClick={publish}
            disabled={submitting}
            className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white shadow-lg shadow-fuchsia-500/25"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Publishing...
              </>
            ) : (
              "Publish product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Footer X-close helper retained for a11y tests */
export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="Close">
      <X className="h-4 w-4" />
    </Button>
  );
}
