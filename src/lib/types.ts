export type ApiCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  emoji: string;
  productCount: number;
};

export type ApiReview = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
};

export type ApiProduct = {
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
  rating: number;
  ratingCount: number;
  sellerName: string;
  sellerRating: number;
  sellerSales: number;
  codePrefix: string;
  instructions: string;
  deliveryType: string;
  categorySlug: string;
  categoryName: string;
  createdAt: string;
  reviews?: ApiReview[];
};

export type CatalogResponse = {
  categories: ApiCategory[];
  products: ApiProduct[];
  stats: {
    totalProducts: number;
    totalSales: number;
    avgRating: number;
    totalOrders: number;
  };
};

export type DeliveredAccount = {
  email: string;
  password: string;
  extra?: string;
};

export type DeliveredItem = {
  slug: string;
  title: string;
  emoji: string;
  gradient: string;
  quantity: number;
  unitPrice: number;
  kind: "KEY" | "ACCOUNT";
  codes: string[];
  accounts?: DeliveredAccount[];
  instructions: string;
  sellerName: string;
};

export type ApiOrder = {
  id: string;
  shortId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  buyerNotes: string;
  items: DeliveredItem[];
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  emailStatus: string;
  deliveredAt: string | null;
  createdAt: string;
};

export type CartLine = {
  slug: string;
  title: string;
  emoji: string;
  gradient: string;
  price: number;
  oldPrice: number | null;
  stock: number;
  quantity: number;
};
