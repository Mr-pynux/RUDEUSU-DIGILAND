"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeDollarSign,
  Boxes,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { DeliveredItem } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { formatMoney, useMarketplace } from "@/components/marketplace/store";

/* ------------------------------------------------------------------ */
/* types + helpers                                                     */
/* ------------------------------------------------------------------ */

const TOKEN_KEY = "rudeusu-admin-token";

export type AdminProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  shortDescription: string;
  description: string;
  features: string;
  requirements: string;
  price: number;
  oldPrice: number | null;
  emoji: string;
  gradient: string;
  badge: string | null;
  stock: number;
  sold: number;
  deliveryType: string;
  codePrefix: string;
  instructions: string;
  categorySlug: string;
  categoryName: string;
  isActive: boolean;
  codesAvailable: number;
  codesSold: number;
};

export type AdminOrder = {
  id: string;
  shortId: string;
  buyerEmail: string;
  items: DeliveredItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
};

type AdminData = {
  stats: {
    totalProducts: number;
    totalOrders: number;
    revenue: number;
    codesAvailable: number;
    codesSold: number;
  };
  products: AdminProduct[];
  orders: AdminOrder[];
};

export const ADMIN_GRADIENTS = [
  { id: "from-violet-500 via-fuchsia-500 to-rose-400", cls: "from-violet-500 via-fuchsia-500 to-rose-400" },
  { id: "from-emerald-500 via-teal-500 to-cyan-500", cls: "from-emerald-500 via-teal-500 to-cyan-500" },
  { id: "from-orange-400 via-amber-500 to-yellow-400", cls: "from-orange-400 via-amber-500 to-yellow-400" },
  { id: "from-rose-400 via-pink-500 to-fuchsia-500", cls: "from-rose-400 via-pink-500 to-fuchsia-500" },
  { id: "from-lime-500 via-emerald-500 to-teal-500", cls: "from-lime-500 via-emerald-500 to-teal-500" },
  { id: "from-purple-500 via-violet-500 to-indigo-400", cls: "from-purple-500 via-violet-500 to-indigo-400" },
];

export const ADMIN_EMOJIS = ["📦", "✨", "🧠", "📺", "📡", "🎵", "🎮", "🔑", "🎨", "🎬", "💳", "🛒"];

export async function adminFetch(url: string, init?: RequestInit): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) ?? "" : "";
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": token,
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

/* ------------------------------------------------------------------ */
/* Admin panel                                                         */
/* ------------------------------------------------------------------ */

export function AdminPanel() {
  const { t } = useI18n();
  const { toast } = useToast();
  const goHome = useMarketplace((s) => s.goHome);
  const catalog = useMarketplace((s) => s.catalog);
  const loadCatalog = useMarketplace((s) => s.loadCatalog);

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const [data, setData] = useState<AdminData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [tab, setTab] = useState("products");
  const [productDialog, setProductDialog] = useState<{ open: boolean; edit: AdminProduct | null }>({
    open: false,
    edit: null,
  });

  // check saved token
  useEffect(() => {
    setAuthed(!!localStorage.getItem(TOKEN_KEY));
  }, []);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    try {
      const res = await adminFetch("/api/admin/data");
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setAuthed(false);
        return;
      }
      if (!res.ok) throw new Error("Failed to load admin data");
      setData((await res.json()) as AdminData);
    } catch {
      toast({
        title: "Could not load data",
        description: "Check the connection and retry.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    if (authed) {
      loadData();
      if (!catalog) loadCatalog();
    }
  }, [authed, loadData, catalog, loadCatalog]);

  const signIn = async () => {
    if (signingIn || !password) return;
    setSigningIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Wrong password");
      localStorage.setItem(TOKEN_KEY, data.token);
      setAuthed(true);
      setPassword("");
    } catch (e) {
      toast({
        title: t("admin.wrongPassword"),
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setData(null);
  };

  /* ---------------- login gate ---------------- */
  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.13_0.02_305)]">
        <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.13_0.02_305)] px-4">
        <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-fuchsia-500/15 blur-[110px]" />
        <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-card/80 p-7 shadow-2xl backdrop-blur">
          <div className="mb-5 flex flex-col items-center gap-3 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400 shadow-lg shadow-fuchsia-500/25">
              <ShieldCheck className="h-7 w-7 text-white" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold text-white">{t("admin.loginTitle")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("admin.loginDesc")}</p>
            </div>
          </div>

          <div className="grid gap-3.5">
            <div className="grid gap-1.5">
              <Label htmlFor="admin-pass" className="text-sm">{t("admin.password")}</Label>
              <Input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && signIn()}
                placeholder="••••••••••"
                className="h-11 border-white/10 bg-white/5"
                dir="ltr"
                autoFocus
              />
            </div>
            <Button
              onClick={signIn}
              disabled={signingIn}
              className="h-11 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-white shadow-lg shadow-fuchsia-500/25"
            >
              {signingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> {t("admin.signingIn")}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> {t("admin.signIn")}
                </>
              )}
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">{t("admin.loginHint")}</p>
            <Button variant="ghost" onClick={goHome} className="h-9 text-muted-foreground">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("admin.backToStore")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- dashboard ---------------- */
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-[oklch(0.13_0.02_305)]">
      {/* admin header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[oklch(0.13_0.02_305)]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-400">
            <ShieldCheck className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-extrabold leading-none text-white">
              {t("admin.title")}
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-fuchsia-300">
              RUDEUSU DIGILAND
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setProductDialog({ open: true, edit: null })}
            className="hidden h-10 gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 text-sm font-semibold text-emerald-200 hover:bg-emerald-500/20 sm:flex"
          >
            <PackagePlus className="h-4 w-4" />
            {t("admin.addProductWithCodes")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            className="h-10 w-10 rounded-full p-0 text-foreground/70 hover:bg-white/5"
            aria-label="Refresh"
          >
            <RefreshCcw className={`h-4 w-4 ${loadingData ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={goHome}
            className="hidden h-10 gap-2 text-sm text-foreground/80 hover:bg-white/5 md:flex"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("admin.backToStore")}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="h-10 w-10 rounded-full p-0 text-rose-300 hover:bg-rose-500/10 md:hidden"
            aria-label={t("admin.signOut")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {[
            { icon: Boxes, label: t("admin.statProducts"), value: stats ? `${stats.totalProducts}` : "—", tint: "text-violet-300" },
            { icon: BadgeDollarSign, label: t("admin.statRevenue"), value: stats ? formatMoney(stats.revenue) : "—", tint: "text-emerald-300" },
            { icon: KeyRound, label: t("admin.statCodesAvailable"), value: stats ? `${stats.codesAvailable}` : "—", tint: "text-fuchsia-300" },
            { icon: KeyRound, label: t("admin.statCodesSold"), value: stats ? `${stats.codesSold}` : "—", tint: "text-amber-300" },
            { icon: ShoppingBagIcon, label: t("admin.statOrders"), value: stats ? `${stats.totalOrders}` : "—", tint: "text-rose-300" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-card/60 p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${s.tint}`}>
                <s.icon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-2.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
              <p className="text-lg font-extrabold text-white" dir="ltr">{s.value}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mt-6">
          <TabsList className="h-11 justify-start gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
            <TabsTrigger value="products" className="rounded-xl px-4 data-[state=active]:bg-white/10">
              <Boxes className="me-1.5 inline h-3.5 w-3.5" />
              {t("admin.tabProducts")}
            </TabsTrigger>
            <TabsTrigger value="codes" className="rounded-xl px-4 data-[state=active]:bg-white/10">
              <KeyRound className="me-1.5 inline h-3.5 w-3.5" />
              {t("admin.tabCodes")}
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-xl px-4 data-[state=active]:bg-white/10">
              <ShoppingBagIcon className="me-1.5 inline h-3.5 w-3.5" />
              {t("admin.tabOrders")}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {tab === "products" ? (
          <ProductsTab
            data={data}
            loading={loadingData && !data}
            onEdit={(p) => setProductDialog({ open: true, edit: p })}
            onDeleted={async () => {
              await loadData();
              await loadCatalog();
            }}
            onOpenAdd={() => setProductDialog({ open: true, edit: null })}
          />
        ) : null}
        {tab === "codes" ? (
          <CodesTab data={data} onChanged={async () => { await loadData(); }} />
        ) : null}
        {tab === "orders" ? <OrdersTab data={data} /> : null}
      </main>

      {/* create / edit product dialog */}
      {productDialog.open ? (
        <ProductDialog
          edit={productDialog.edit}
          categories={(catalog?.categories ?? []).map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }))}
          onClose={() => setProductDialog({ open: false, edit: null })}
          onSaved={async () => {
            setProductDialog({ open: false, edit: null });
            await loadData();
            await loadCatalog();
          }}
        />
      ) : null}
    </div>
  );
}

/* small inline icon reuse to avoid extra imports */
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Products tab                                                        */
/* ------------------------------------------------------------------ */

function ProductsTab({
  data,
  loading,
  onEdit,
  onDeleted,
  onOpenAdd,
}: {
  data: AdminData | null;
  loading: boolean;
  onEdit: (p: AdminProduct) => void;
  onDeleted: () => Promise<void>;
  onOpenAdd: () => void;
}) {
  const { toast } = useToast();
  const { t, cat } = useI18n();
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const products = useMemo(() => {
    const list = data?.products ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => `${p.title} ${p.brand} ${p.categoryName}`.toLowerCase().includes(q));
  }, [data, query]);

  const toggleActive = async (p: AdminProduct) => {
    try {
      const res = await adminFetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      if (!res.ok) throw new Error();
      await onDeleted();
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const remove = async (p: AdminProduct) => {
    if (deleting) return;
    if (!window.confirm(t("admin.deleteConfirm"))) return;
    setDeleting(p.id);
    try {
      const res = await adminFetch(`/api/admin/products/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast({ title: t("admin.productDeleted"), description: p.title });
      await onDeleted();
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <section className="mt-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("admin.searchPlaceholder")}
            className="h-10 rounded-xl border-white/10 bg-white/5 ps-10"
          />
        </div>
        <Button
          onClick={onOpenAdd}
          className="h-10 gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-lg shadow-emerald-500/20 sm:hidden"
        >
          <Plus className="h-4 w-4" />
          {t("admin.addProduct")}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-card/50 py-16">
          <Loader2 className="h-6 w-6 animate-spin text-fuchsia-300" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-16 text-center">
          <p className="text-3xl">📦</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("admin.noProducts")}</p>
        </div>
      ) : (
        <div className="nice-scroll max-h-[62vh] overflow-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="sticky top-0 bg-[oklch(0.18_0.02_305)] text-start text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableProduct")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableCategory")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tablePrice")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableStock")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableSold")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableCodes")}</th>
                <th className="px-4 py-3 text-start font-semibold">{t("admin.tableStatus")}</th>
                <th className="px-4 py-3 text-end font-semibold">{t("admin.tableActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${p.gradient}`}
                      >
                        {p.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="max-w-64 truncate font-semibold text-foreground">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {cat(p.categorySlug, p.categoryName)}
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-300" dir="ltr">
                    {formatMoney(p.price)}
                  </td>
                  <td className="px-4 py-3" dir="ltr">{p.stock}</td>
                  <td className="px-4 py-3 text-muted-foreground" dir="ltr">{p.sold}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-fuchsia-500/10 px-2 py-1 text-xs font-bold text-fuchsia-200" dir="ltr">
                      {p.codesAvailable}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={() => toggleActive(p)}
                      aria-label={p.isActive ? t("admin.active") : t("admin.hidden")}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEdit(p)}
                        className="rounded-lg p-2 text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                        aria-label={t("admin.edit")}
                        title={t("admin.edit")}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => remove(p)}
                        disabled={deleting === p.id}
                        className="rounded-lg p-2 text-rose-300 transition hover:bg-rose-500/15 disabled:opacity-40"
                        aria-label={t("admin.delete")}
                        title={t("admin.delete")}
                      >
                        {deleting === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Create / edit product dialog                                        */
/* ------------------------------------------------------------------ */

function ProductDialog({
  edit,
  categories,
  onClose,
  onSaved,
}: {
  edit: AdminProduct | null;
  categories: { slug: string; name: string; emoji: string }[];
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { toast } = useToast();
  const { t } = useI18n();

  const [title, setTitle] = useState(edit?.title ?? "");
  const [brand, setBrand] = useState(edit?.brand ?? "RUDEUSU DIGILAND");
  const [categorySlug, setCategorySlug] = useState(edit?.categorySlug ?? categories[0]?.slug ?? "");
  const [price, setPrice] = useState(edit ? String(edit.price) : "");
  const [oldPrice, setOldPrice] = useState(edit?.oldPrice ? String(edit.oldPrice) : "");
  const [stock, setStock] = useState(edit ? String(edit.stock) : "50");
  const [emoji, setEmoji] = useState(edit?.emoji ?? "📦");
  const [gradient, setGradient] = useState(edit?.gradient ?? ADMIN_GRADIENTS[0].id);
  const [badge, setBadge] = useState(edit?.badge ?? "");
  const [shortDescription, setShortDescription] = useState(edit?.shortDescription ?? "");
  const [description, setDescription] = useState(edit?.description ?? "");
  const [features, setFeatures] = useState(edit?.features ?? "");
  const [requirements, setRequirements] = useState(edit?.requirements ?? "");
  const [instructions, setInstructions] = useState(edit?.instructions ?? "");
  const [codePrefix, setCodePrefix] = useState(edit?.codePrefix ?? "DIGI");
  const [deliveryType, setDeliveryType] = useState(edit?.deliveryType ?? "INSTANT");
  const [codes, setCodes] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (edit) {
        const res = await adminFetch(`/api/admin/products/${edit.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title,
            brand,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : null,
            stock: Number(stock),
            emoji,
            badge,
            shortDescription,
            description,
            features,
            requirements,
            instructions,
            codePrefix,
            deliveryType,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Save failed");
        toast({ title: t("admin.productUpdated"), description: title });
      } else {
        const res = await adminFetch("/api/admin/products", {
          method: "POST",
          body: JSON.stringify({
            title,
            brand,
            categorySlug,
            price: Number(price),
            oldPrice: oldPrice ? Number(oldPrice) : null,
            stock: Number(stock),
            emoji,
            gradient,
            badge,
            shortDescription,
            description,
            features,
            requirements,
            instructions,
            codePrefix,
            deliveryType,
            codes,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Create failed");
        toast({
          title: t("admin.productCreated"),
          description: t("admin.productCreatedDesc", { n: data.codesAdded ?? 0 }),
        });
      }
      await onSaved();
    } catch (e) {
      toast({
        title: edit ? t("admin.saveFailed") : t("admin.createFailed"),
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[oklch(0.16_0.02_305)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-white">
            <PackagePlus className="h-5 w-5 text-emerald-300" />
            {edit ? t("admin.editProduct") : t("admin.addProductWithCodes")}
          </DialogTitle>
          <DialogDescription>
            {edit
              ? t("admin.editHint")
              : t("admin.createHint")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3.5">
          <div className="grid gap-1.5">
            <Label className="text-sm">{t("admin.productTitle")}</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Google Gemini Pro — 12 Months"
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.brand")}</Label>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-10 border-white/10 bg-white/5"
              />
            </div>
            {!edit ? (
              <div className="grid gap-1.5">
                <Label className="text-sm">{t("admin.category")}</Label>
                <Select value={categorySlug} onValueChange={setCategorySlug}>
                  <SelectTrigger className="h-10 border-white/10 bg-white/5">
                    <SelectValue placeholder={t("seller.pickCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.emoji} {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
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
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.price")}</Label>
              <Input
                type="number"
                min="0.5"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="19.99"
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.oldPrice")}</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                placeholder="29.99"
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.stock")}</Label>
              <Input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.codePrefix")}</Label>
              <Input
                value={codePrefix}
                onChange={(e) => setCodePrefix(e.target.value)}
                className="h-10 border-white/10 bg-white/5"
                dir="ltr"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.badge")}</Label>
              <Input
                value={badge ?? ""}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="HOT / NEW / DEAL 30%"
                className="h-10 border-white/10 bg-white/5"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("seller.cover")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {ADMIN_EMOJIS.map((e) => (
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
              <Label className="text-sm">{t("admin.gradient")}</Label>
              <div className="flex flex-wrap gap-1.5">
                {ADMIN_GRADIENTS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGradient(g.id)}
                    className={`h-9 w-9 rounded-xl bg-gradient-to-br ${g.cls} transition ${
                      gradient === g.id ? "ring-2 ring-white/70" : "opacity-70 hover:opacity-100"
                    }`}
                    aria-label={g.id}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">{t("admin.short")}</Label>
            <Input
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder={t("seller.shortPlaceholder")}
              className="h-10 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">{t("admin.fullDesc")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("seller.fullPlaceholder")}
              className="min-h-20 border-white/10 bg-white/5"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("seller.features")}</Label>
              <Textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder={t("seller.featuresPlaceholder")}
                className="min-h-16 border-white/10 bg-white/5"
              />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-sm">{t("admin.requirements")}</Label>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="min-h-16 border-white/10 bg-white/5"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">{t("admin.instructions")}</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="min-h-16 border-white/10 bg-white/5"
            />
          </div>

          {!edit ? (
            <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-4">
              <Label htmlFor="admin-codes" className="text-sm text-emerald-200">
                {t("admin.uploadedCodes")}
              </Label>
              <p className="mb-2 mt-1 text-xs text-muted-foreground">
                {t("admin.uploadedCodesHint")}
              </p>
              <Textarea
                id="admin-codes"
                value={codes}
                onChange={(e) => setCodes(e.target.value)}
                placeholder={t("admin.codesPlaceholder")}
                className="min-h-32 border-emerald-400/20 bg-black/20 font-mono text-xs"
                dir="ltr"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={onClose} className="h-10 px-5 text-muted-foreground">
              {t("admin.cancel")}
            </Button>
            <Button
              onClick={save}
              disabled={saving}
              className="h-10 gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 font-bold text-white shadow-lg shadow-fuchsia-500/25"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {edit ? t("admin.saving") : t("admin.creating")}
                </>
              ) : edit ? (
                t("admin.updateProduct")
              ) : (
                t("admin.createProduct")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Codes tab                                                           */
/* ------------------------------------------------------------------ */

type CodeRow = {
  id: string;
  value: string;
  sold: boolean;
  orderShortId: string | null;
  createdAt: string;
};

function CodesTab({ data, onChanged }: { data: AdminData | null; onChanged: () => Promise<void> }) {
  const { toast } = useToast();
  const { t } = useI18n();

  const products = data?.products ?? [];
  const [productId, setProductId] = useState<string>("");
  const [codes, setCodes] = useState<CodeRow[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [bulk, setBulk] = useState("");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const selected = products.find((p) => p.id === productId) ?? null;

  useEffect(() => {
    if (!productId && products.length > 0) {
      setProductId(products[0].id);
    }
  }, [products, productId]);

  useEffect(() => {
    if (!productId) return;
    setLoadingCodes(true);
    setCodes([]);
    adminFetch(`/api/admin/products/${productId}/codes`)
      .then((r) => r.json())
      .then((d) => setCodes(d.codes ?? []))
      .catch(() => setCodes([]))
      .finally(() => setLoadingCodes(false));
  }, [productId, data]);

  const addCodes = async () => {
    if (adding || !productId || !bulk.trim()) return;
    setAdding(true);
    try {
      const res = await adminFetch(`/api/admin/products/${productId}/codes`, {
        method: "POST",
        body: JSON.stringify({ codes: bulk }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "Could not add codes");
      toast({
        title: t("admin.codesAdded", { n: d.added ?? 0 }),
        description: d.skipped > 0 ? t("admin.codesDuplicate", { n: d.skipped }) : undefined,
      });
      setBulk("");
      const listRes = await adminFetch(`/api/admin/products/${productId}/codes`);
      const listData = await listRes.json();
      setCodes(listData.codes ?? []);
      await onChanged();
    } catch (e) {
      toast({
        title: "Failed to add codes",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setAdding(false);
    }
  };

  const deleteCode = async (code: CodeRow) => {
    if (deletingId) return;
    setDeletingId(code.id);
    try {
      const res = await adminFetch(`/api/admin/codes/${code.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Delete failed");
      }
      setCodes((prev) => prev.filter((c) => c.id !== code.id));
      await onChanged();
    } catch (e) {
      toast({
        title: "Delete failed",
        description: e instanceof Error ? e.message : "",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="mt-4 grid gap-4 lg:grid-cols-[380px_1fr]">
      {/* left: picker + bulk add */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-4">
          <Label className="text-sm font-bold">{t("admin.codesFor")}</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="mt-2 h-11 border-white/10 bg-white/5">
              <SelectValue placeholder={t("admin.pickProduct")} />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.emoji} {p.title.slice(0, 40)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected ? (
            <div className="mt-3 flex gap-2 text-center">
              <div className="flex-1 rounded-xl border border-fuchsia-400/20 bg-fuchsia-500/10 p-2.5">
                <p className="text-lg font-extrabold text-fuchsia-200" dir="ltr">
                  {selected.codesAvailable}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("admin.available")}
                </p>
              </div>
              <div className="flex-1 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-2.5">
                <p className="text-lg font-extrabold text-emerald-200" dir="ltr">
                  {selected.codesSold}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {t("admin.soldCode")}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-emerald-400/25 bg-emerald-400/5 p-4">
          <Label htmlFor="bulk-codes" className="text-sm text-emerald-200">
            {t("admin.addCodes")}
          </Label>
          <p className="mb-2 mt-1 text-xs text-muted-foreground">{t("admin.uploadedCodesHint")}</p>
          <Textarea
            id="bulk-codes"
            value={bulk}
            onChange={(e) => setBulk(e.target.value)}
            placeholder={t("admin.codesPlaceholder")}
            className="min-h-36 border-emerald-400/20 bg-black/20 font-mono text-xs"
            dir="ltr"
          />
          <Button
            onClick={addCodes}
            disabled={adding || !productId}
            className="mt-3 h-10 w-full gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white"
          >
            {adding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("admin.adding")}
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> {t("admin.addCodes")}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* right: codes list */}
      <div className="rounded-2xl border border-white/10 bg-card/60">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-sm font-bold text-foreground">
            {selected ? selected.title : t("admin.pickProduct")}
          </p>
          {selected ? (
            <p className="text-xs text-muted-foreground">
              {t("admin.availableCodes")}: {selected.codesAvailable} · {t("admin.soldCodes")}:{" "}
              {selected.codesSold}
            </p>
          ) : null}
        </div>
        <div className="nice-scroll max-h-[56vh] overflow-y-auto p-3">
          {loadingCodes ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-fuchsia-300" />
            </div>
          ) : codes.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/15 p-8 text-center">
              <p className="text-2xl">🔑</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("admin.noCodes")}</p>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {codes.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <code className="truncate font-mono text-[13px] font-semibold text-foreground" dir="ltr">
                    {c.value}
                  </code>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        c.sold
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-amber-500/15 text-amber-300"
                      }`}
                    >
                      {c.sold ? t("admin.soldCode") : t("admin.available")}
                    </span>
                    {!c.sold ? (
                      <button
                        onClick={() => deleteCode(c)}
                        disabled={deletingId === c.id}
                        className="rounded-lg p-1.5 text-rose-300 transition hover:bg-rose-500/15 disabled:opacity-40"
                        aria-label={t("admin.deleteCode")}
                        title={t("admin.deleteCode")}
                      >
                        {deletingId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Orders tab                                                          */
/* ------------------------------------------------------------------ */

function OrdersTab({ data }: { data: AdminData | null }) {
  const { t } = useI18n();
  const orders = data?.orders ?? [];

  if (orders.length === 0) {
    return (
      <div className="mt-4 rounded-2xl border border-dashed border-white/15 py-16 text-center">
        <p className="text-3xl">🧾</p>
        <p className="mt-2 text-sm text-muted-foreground">{t("admin.noOrders")}</p>
      </div>
    );
  }

  return (
    <section className="nice-scroll mt-4 max-h-[68vh] space-y-3 overflow-y-auto pe-1">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-white/10 bg-card/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-white/5 px-2.5 py-1 font-mono text-sm font-bold text-emerald-300" dir="ltr">
                {o.shortId}
              </span>
              <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-200">
                {o.buyerEmail}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="rounded-md bg-white/5 px-2 py-0.5 font-bold uppercase">
                {o.paymentMethod}
              </span>
              <span>{new Date(o.createdAt).toLocaleString()}</span>
              <span className="text-sm font-extrabold text-white">{formatMoney(o.total)}</span>
            </div>
          </div>

          <div className="mt-3 space-y-2 border-t border-white/5 pt-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              {t("admin.orderItems")}
            </p>
            {o.items.map((item) => (
              <div
                key={item.slug}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <p className="text-[13px] font-semibold text-foreground/90">
                  {item.emoji} {item.title} ×{item.quantity}
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {item.codes.map((code, i) => (
                    <code
                      key={`${code}-${i}`}
                      className="rounded-md border border-emerald-400/15 bg-emerald-400/5 px-2 py-1 font-mono text-[11px] font-bold text-emerald-300"
                      dir="ltr"
                    >
                      {code}
                    </code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
