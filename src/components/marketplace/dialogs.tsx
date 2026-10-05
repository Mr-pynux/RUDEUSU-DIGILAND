"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ClipboardList,
  Clock,
  CreditCard,
  ExternalLink,
  Loader2,
  Mail,
  Minus,
  Nfc,
  PackageOpen,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Trash2,
  Wallet,
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
import { useI18n } from "@/lib/i18n";
import { cartSubtotal, formatMoney, serviceFee, useMarketplace } from "./store";
import { CopyButton } from "./ui-bits";

const PAYMENT_IDS = ["card", "paypal", "googlepay", "applepay"] as const;

/* Store payment destinations — PayPal / Google Pay orders are paid here */
const PAYPAL_HANDLE = "paypal.me/AyoubZiani959";
const PAYPAL_LINK = "https://paypal.me/AyoubZiani959";

/* ================= CART ================= */

export function CartSheet() {
  const open = useMarketplace((s) => s.cartOpen);
  const setOpen = useMarketplace((s) => s.setCartOpen);
  const cart = useMarketplace((s) => s.cart);
  const setQty = useMarketplace((s) => s.setQty);
  const removeFromCart = useMarketplace((s) => s.removeFromCart);
  const setCheckoutOpen = useMarketplace((s) => s.setCheckoutOpen);
  const { t } = useI18n();

  const subtotal = cartSubtotal(cart);
  const fee = serviceFee(subtotal);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-white/10 bg-[oklch(0.15_0.02_305)] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 px-5 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg text-white">
            <ShoppingCart className="h-5 w-5 text-fuchsia-300" />
            {t("cart.title")}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground">
            {t("cart.desc")}
          </SheetDescription>
        </SheetHeader>

        <div className="nice-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">🛒</span>
              <p className="font-semibold text-foreground">{t("cart.emptyTitle")}</p>
              <p className="max-w-60 text-sm text-muted-foreground">{t("cart.emptyText")}</p>
            </div>
          ) : (
            cart.map((line) => (
              <div
                key={line.slug}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3"
              >
                {line.imageUrl ? (
                  <img
                    src={line.imageUrl}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-xl object-cover"
                  />
                ) : (
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${line.gradient}`}
                  >
                    {line.emoji}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {line.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center rounded-full border border-white/10 bg-white/5">
                      <button
                        onClick={() => setQty(line.slug, line.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                        aria-label={t("cart.decrease")}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold">{line.quantity}</span>
                      <button
                        onClick={() => setQty(line.slug, line.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10"
                        aria-label={t("cart.increase")}
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
                  aria-label={t("cart.remove", { title: line.title })}
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
                <span>{t("cart.subtotal")}</span>
                <span className="text-foreground">{formatMoney(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("cart.fee")}</span>
                <span className="text-foreground">{formatMoney(fee)}</span>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex justify-between text-base font-bold text-white">
                <span>{t("cart.total")}</span>
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
              {t("cart.checkout", { total: formatMoney(subtotal + fee) })}
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
  const { t } = useI18n();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState<string>("card");
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
          name,
          phone,
          notes,
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
      toast({ title: t("checkout.failed"), description: msg, variant: "destructive" });
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
            {t("checkout.title")}
          </DialogTitle>
          <DialogDescription>{t("checkout.desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ---------- buyer information form ---------- */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="mb-3 flex items-center gap-2 text-[13px] font-bold text-fuchsia-300">
              <ClipboardList className="h-4 w-4" />
              {t("checkout.formTitle")}
            </p>
            <div className="space-y-3">
              <div className="grid gap-1.5">
                <Label htmlFor="buyer-name" className="text-sm text-foreground/90">
                  {t("checkout.name")} <span className="text-rose-300">*</span>
                </Label>
                <Input
                  id="buyer-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("checkout.namePlaceholder")}
                  className="h-11 border-white/10 bg-white/5"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="buyer-email" className="text-sm text-foreground/90">
                  {t("checkout.email")} <span className="text-rose-300">*</span>
                </Label>
                <Input
                  id="buyer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@gmail.com"
                  className="h-11 border-white/10 bg-white/5"
                  dir="ltr"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="buyer-phone" className="text-sm text-foreground/90">
                  {t("checkout.phone")}
                </Label>
                <Input
                  id="buyer-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("checkout.phonePlaceholder")}
                  className="h-11 border-white/10 bg-white/5"
                  dir="ltr"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="buyer-notes" className="text-sm text-foreground/90">
                  {t("checkout.notes")}
                </Label>
                <Textarea
                  id="buyer-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("checkout.notesPlaceholder")}
                  className="min-h-[64px] border-white/10 bg-white/5"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm text-foreground/90">{t("checkout.method")}</Label>
            <RadioGroup value={payment} onValueChange={setPayment} className="grid grid-cols-2 gap-2">
              {PAYMENT_IDS.map((id) => (
                <Label
                  key={id}
                  htmlFor={`pay-${id}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition ${
                    payment === id
                      ? "border-fuchsia-400/60 bg-fuchsia-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25"
                  }`}
                >
                  <RadioGroupItem id={`pay-${id}`} value={id} className="sr-only" />
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-fuchsia-200">
                    {id === "card" ? (
                      <CreditCard className="h-5 w-5" />
                    ) : id === "paypal" ? (
                      <Wallet className="h-5 w-5" />
                    ) : id === "googlepay" ? (
                      <Nfc className="h-5 w-5" />
                    ) : (
                      <Smartphone className="h-5 w-5" />
                    )}
                  </span>
                  <span>
                    <span className="block text-[13px] font-bold text-foreground">
                      {t(`checkout.${id}`)}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {t(`checkout.${id}Hint`)}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          {(payment === "paypal" || payment === "googlepay") && (
            <div className="rounded-2xl border border-sky-400/30 bg-sky-400/5 p-4">
              <p className="flex items-center gap-2 text-[13px] font-bold text-sky-200">
                <Wallet className="h-4 w-4" />
                {t("checkout.payLinkTitle")}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {t("checkout.payLinkText")}
              </p>
              <div
                className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-sky-400/25 bg-black/25 px-3 py-2.5"
                dir="ltr"
              >
                <code className="truncate font-mono text-sm font-bold text-sky-300">
                  {PAYPAL_HANDLE}
                </code>
                <CopyButton value={PAYPAL_HANDLE} label={t("checkout.payLinkCopy")} />
              </div>
              <a href={PAYPAL_LINK} target="_blank" rel="noopener noreferrer" className="mt-2.5 block">
                <Button
                  type="button"
                  className="h-10 w-full gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 font-bold text-white shadow-lg shadow-sky-500/20"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t("checkout.payLinkOpen")}
                </Button>
              </a>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            {cart.map((l) => (
              <div
                key={l.slug}
                className="flex items-center justify-between gap-2 py-1 text-sm"
              >
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
              <span>{t("checkout.serviceFee")}</span>
              <span>{formatMoney(fee)}</span>
            </div>
            <div className="flex justify-between pt-1 text-base font-bold text-white">
              <span>{t("cart.total")}</span>
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
                <Loader2 className="h-4 w-4 animate-spin" /> {t("checkout.paying")}
              </>
            ) : (
              t("checkout.pay", { total: formatMoney(subtotal + fee) })
            )}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">{t("checkout.demoNote")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= SUCCESS (order received / awaiting delivery) ================= */

export function SuccessDialog() {
  const order = useMarketplace((s) => s.successOrder);
  const setOrder = useMarketplace((s) => s.setSuccessOrder);
  const setOrdersOpen = useMarketplace((s) => s.setOrdersOpen);
  const { t } = useI18n();

  const awaiting = order?.status === "NEW";

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && setOrder(null)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-xl">
        {order ? (
          <>
            <DialogHeader>
              {awaiting ? (
                <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15">
                  <Clock className="h-9 w-9 text-amber-400" />
                </div>
              ) : (
                <div className="mx-auto mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <BadgeCheck className="h-9 w-9 text-emerald-400" />
                </div>
              )}
              <DialogTitle className="text-center text-2xl text-white">
                {awaiting ? t("success.awaitTitle") : t("success.title")}
              </DialogTitle>
              <DialogDescription className="text-center">
                {t("success.order")}{" "}
                <b className="font-mono text-emerald-300" dir="ltr">
                  {order.shortId}
                </b>{" "}
                · {t("success.copySent")} <b className="text-foreground/90">{order.buyerEmail}</b>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {awaiting ? (
                <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4 text-center">
                  <p className="text-sm font-bold text-amber-200">
                    <span className="me-1.5 inline-flex h-5 items-center rounded-full bg-amber-500/20 px-2 text-[10px] uppercase tracking-wide">
                      {t("success.statusAwaiting")}
                    </span>
                  </p>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground/85">
                    {t("success.awaitText", {
                      kind:
                        order.items.some((i) => i.kind === "ACCOUNT")
                          ? t("success.awaitKindAccount")
                          : t("success.awaitKindKey"),
                    })}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{t("success.awaitNote")}</p>
                </div>
              ) : null}

              {order.items.map((item) => (
                <div
                  key={item.slug}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${item.gradient}`}
                      >
                        {item.emoji}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("success.qty", {
                          n: item.quantity,
                          seller: item.sellerName,
                          price: formatMoney(item.unitPrice),
                        })}
                      </p>
                    </div>
                  </div>
                  {!awaiting ? (
                    <div className="mt-3 space-y-2">
                      {item.kind === "ACCOUNT" && item.accounts && item.accounts.length > 0 ? (
                        item.accounts.map((acc, i) => (
                          <div
                            key={`${acc.email}-${i}`}
                            className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-3 py-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <code className="truncate font-mono text-sm font-bold text-cyan-300" dir="ltr">
                                {acc.email}
                              </code>
                              <CopyButton
                                value={`${acc.email} / ${acc.password}`}
                                label={t("success.copyAccount", { n: i + 1 })}
                              />
                            </div>
                            <code className="mt-1 block truncate font-mono text-xs text-cyan-200/80" dir="ltr">
                              {acc.password}
                            </code>
                          </div>
                        ))
                      ) : (
                        item.codes.map((code, i) => (
                          <div
                            key={`${code}-${i}`}
                            className="flex items-center justify-between gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2"
                          >
                            <code
                              className="truncate font-mono text-sm font-bold tracking-wider text-emerald-300"
                              dir="ltr"
                            >
                              {code}
                            </code>
                            <CopyButton value={code} label={t("success.copyCode", { n: i + 1 })} />
                          </div>
                        ))
                      )}
                    </div>
                  ) : null}
                  {awaiting ? (
                    <p className="mt-2.5 text-[11px] font-medium text-amber-200/80">
                      {item.kind === "ACCOUNT"
                        ? `👤 ${t("success.awaitKindAccount")} × ${item.quantity}`
                        : `🔑 ${t("success.awaitKindKey")} × ${item.quantity}`}
                    </p>
                  ) : null}
                  {item.kind === "ACCOUNT" && !awaiting ? (
                    <p className="mt-2 rounded-lg border border-cyan-400/15 bg-cyan-400/5 px-3 py-2 text-xs text-cyan-200/90">
                      ℹ️ {t("success.accountNote")}
                    </p>
                  ) : null}
                  {item.instructions && !awaiting ? (
                    <details className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                      <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-fuchsia-300">
                        {t("success.howToActivate")}
                      </summary>
                      <p className="mt-2 whitespace-pre-line text-[13px] leading-relaxed text-muted-foreground">
                        {item.instructions}
                      </p>
                    </details>
                  ) : null}
                </div>
              ))}

              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  {t("success.paidVia")}{" "}
                  <b className="uppercase text-foreground/80">{order.paymentMethod}</b>
                </span>
                <span className="text-lg font-bold text-white">{formatMoney(order.total)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    setOrder(null);
                    setOrdersOpen(true);
                  }}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 font-semibold text-foreground hover:bg-white/10"
                >
                  <Mail className="h-4 w-4" />
                  {t("success.myPurchases")}
                </Button>
                <Button
                  onClick={() => setOrder(null)}
                  className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white"
                >
                  {t("success.continue")}
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

export function OrdersDialog() {
  const open = useMarketplace((s) => s.ordersOpen);
  const setOpen = useMarketplace((s) => s.setOrdersOpen);
  const lastEmail = useMarketplace((s) => s.lastEmail);
  const { toast } = useToast();
  const { t } = useI18n();

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
    if (loading || !email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Lookup failed");
      setOrders(data.orders ?? []);
      if ((data.orders ?? []).length === 0) {
        toast({
          title: t("orders.noneTitle"),
          description: t("orders.noneText", { email: email.trim() }),
        });
      }
    } catch (e) {
      toast({
        title: t("orders.failed"),
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
            {t("orders.title")}
          </DialogTitle>
          <DialogDescription>{t("orders.desc")}</DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="h-11 border-white/10 bg-white/5"
            dir="ltr"
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <Button
            onClick={lookup}
            disabled={loading}
            className="h-11 shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 font-bold text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("orders.find")}
          </Button>
        </div>

        <div className="nice-scroll max-h-[50vh] space-y-3 overflow-y-auto pe-1">
          {orders?.map((o) => (
            <div key={o.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-sm font-bold text-emerald-300" dir="ltr">
                    {o.shortId}
                  </p>
                  {o.status === "NEW" ? (
                    <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-300">
                      <Clock className="me-1 inline h-3 w-3" />
                      {t("success.statusAwaiting")}
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-300">
                      {t("orders.statusDelivered")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()} · {o.paymentMethod.toUpperCase()}
                </p>
              </div>
              {o.status === "NEW" ? (
                <p className="mt-2.5 rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 text-xs text-amber-200/90">
                  ⏳ {t("orders.statusAwaiting")} — <b dir="ltr">{o.buyerEmail}</b>
                </p>
              ) : null}
              {o.items.map((item) => (
                <div key={item.slug} className="mt-3 space-y-1.5">
                  <p className="text-[13px] font-semibold text-foreground/90">
                    {item.emoji} {item.title} ×{item.quantity}
                  </p>
                  {item.codes && item.codes.length > 0
                    ? item.codes.map((code, i) => (
                        <div
                          key={`${o.id}-${code}-${i}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-2.5 py-1.5"
                        >
                          <code
                            className="truncate font-mono text-xs font-bold text-emerald-300"
                            dir="ltr"
                          >
                            {code}
                          </code>
                          <CopyButton value={code} />
                        </div>
                      ))
                    : null}
                  {item.accounts && item.accounts.length > 0
                    ? item.accounts.map((acc, i) => (
                        <div
                          key={`${o.id}-${acc.email}-${i}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-cyan-400/15 bg-cyan-400/5 px-2.5 py-1.5"
                        >
                          <code
                            className="truncate font-mono text-xs font-bold text-cyan-300"
                            dir="ltr"
                          >
                            {acc.email} / {acc.password}
                          </code>
                          <CopyButton value={`${acc.email} / ${acc.password}`} />
                        </div>
                      ))
                    : null}
                </div>
              ))}
              <div className="mt-3 flex justify-end gap-1 border-t border-white/10 pt-2 text-sm">
                <span className="text-muted-foreground">{t("orders.total")}&nbsp;</span>
                <span className="font-bold text-white">{formatMoney(o.total)}</span>
              </div>
            </div>
          ))}
          {orders && orders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
              <p className="text-3xl">📭</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("orders.empty")}</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ================= SELLER CENTER ================= */

const EMOJI_CHOICES = ["📦", "✨", "🧠", "📺", "📡", "🎵", "🎮", "🔑", "🎨", "🎬", "💳", "🛒"];

export function SellerDialog() {
  const open = useMarketplace((s) => s.sellerOpen);
  const setOpen = useMarketplace((s) => s.setSellerOpen);
  const catalog = useMarketplace((s) => s.catalog);
  const loadCatalog = useMarketplace((s) => s.loadCatalog);
  const { toast } = useToast();
  const { t } = useI18n();

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
        title: t("seller.published"),
        description: t("seller.publishedDesc", { title: data.product.title }),
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
        title: t("seller.failed"),
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
            <ShoppingBag className="h-5 w-5 text-fuchsia-300" />
            {t("seller.title")}
          </DialogTitle>
          <DialogDescription>{t("seller.desc")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5">
          <div className="grid gap-1.5">
            <Label htmlFor="sp-title" className="text-sm">{t("seller.productTitle")}</Label>
            <Input
              id="sp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("seller.titlePlaceholder")}
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("seller.category")}</Label>
              <Select value={categorySlug} onValueChange={setCategorySlug}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5">
                  <SelectValue placeholder={t("seller.pickCategory")} />
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
              <Label className="text-sm">{t("seller.delivery")}</Label>
              <Select value={deliveryType} onValueChange={setDeliveryType}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INSTANT">{t("seller.instant")}</SelectItem>
                  <SelectItem value="MANUAL">{t("seller.manual")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="sp-price" className="text-sm">{t("seller.price")}</Label>
              <Input
                id="sp-price"
                type="number"
                min="0.5"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="9.99"
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="sp-stock" className="text-sm">{t("seller.stock")}</Label>
              <Input
                id="sp-stock"
                type="number"
                min="1"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">{t("seller.cover")}</Label>
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
            <Label htmlFor="sp-short" className="text-sm">{t("seller.short")}</Label>
            <Input
              id="sp-short"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder={t("seller.shortPlaceholder")}
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sp-desc" className="text-sm">{t("seller.full")}</Label>
            <Textarea
              id="sp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("seller.fullPlaceholder")}
              className="min-h-20 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="sp-features" className="text-sm">
              {t("seller.features")}
            </Label>
            <Textarea
              id="sp-features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder={t("seller.featuresPlaceholder")}
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
                <Loader2 className="h-4 w-4 animate-spin" /> {t("seller.publishing")}
              </>
            ) : (
              t("seller.publish")
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
