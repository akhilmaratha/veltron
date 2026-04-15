import type {
  CartItemData,
  CouponData,
  OrderRowData,
  ProfilePurchaseData,
  Product,
  ShippingOptionData,
  StatCardData,
  WishlistItemData,
} from "@/types/commerce";

// TODO: Replace with API call.
export const topNavigationItems = [
  { label: "Curated", href: "/" },
  { label: "Archive", href: "/product-listing" },
  { label: "Journal", href: "/user-profile" },
] as const;

// TODO: Replace with API call.
export const bottomNavigationItems = [
  { label: "Curated", href: "/" },
  { label: "Archive", href: "/product-listing" },
  { label: "Cart", href: "/shopping-cart" },
  { label: "Profile", href: "/user-profile" },
] as const;

// TODO: Replace with API call.
export const homepageProducts: Product[] = [
  {
    id: "vessel-01",
    name: "Serene Vessel No. 01",
    category: "Ceramic / Matte White",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
    description: "Balanced silhouette with a soft matte finish and tactile rim.",
  },
  {
    id: "tray-01",
    name: "Archive Serving Tray",
    category: "Solid Walnut",
    price: 210,
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
    description: "Warm grain pattern and low-profile edges for daily ritual use.",
  },
  {
    id: "snuffer-01",
    name: "Elemental Snuffer",
    category: "Aged Brass",
    price: 85,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    description: "Slim brass form designed for long, graceful motion.",
  },
  {
    id: "throw-01",
    name: "Origin Wool Throw",
    category: "Merino / Oatmeal",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=80",
    description: "Dense weave with a dry hand feel and quiet drape.",
  },
];

// TODO: Replace with API call.
export const featureImages = {
  hero:
    "https://images.unsplash.com/photo-1486754735734-325b5831c3ad?auto=format&fit=crop&w=1600&q=80",
  philosophyOne:
    "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1200&q=80",
  philosophyTwo:
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  productDetailHero:
    "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1600&q=80",
};

// TODO: Replace with API call.
export const statCards: StatCardData[] = [
  { label: "Total Revenue", value: "$42,890", trend: "+12%", direction: "up" },
  { label: "Curation Velocity", value: "8.4", trend: "+4%", direction: "up" },
  { label: "Active Collectors", value: "1,204", trend: "-2%", direction: "down" },
  { label: "Archive Requests", value: "156", trend: "+28%", direction: "up" },
] as const;

// TODO: Replace with API call.
export const adminOrders: OrderRowData[] = [
  {
    id: "ord-01",
    customer: "Julian Thorne",
    product: "The Brutalist Vase",
    price: "$1,240",
    status: "Delivered",
    date: "Apr 12",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "ord-02",
    customer: "Elena Rossi",
    product: "Midnight Linocut #4",
    price: "$850",
    status: "Processing",
    date: "Apr 11",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "ord-03",
    customer: "Marcus Chen",
    product: "Hand-turned Walnut Stool",
    price: "$2,100",
    status: "Shipped",
    date: "Apr 10",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
  },
] as const;

// TODO: Replace with API call.
export const coupons: CouponData[] = [
  {
    id: "summer-atelier",
    title: "The Summer Atelier 20%",
    description: "Applicable on all ceramic lighting and hand-woven textiles.",
    code: "ATELIER20",
    expiresAt: "Expires Oct 12, 2024",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "priority",
    title: "Free Expedited Curation",
    description: "Complimentary priority shipping on orders exceeding $300.",
    code: "PRIORITY",
    expiresAt: "Expires Oct 12, 2024",
    image:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "archive-credit",
    title: "$50 Archive Credit",
    description: "Valid on all items within the permanent collection archive.",
    code: "ARCHIVE50",
    expiresAt: "Expires Oct 12, 2024",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

// TODO: Replace with API call.
export const cartItems: CartItemData[] = [
  {
    id: "cart-01",
    name: "Terraform Vase No. 04",
    variant: "Sandstone / Matte Finish",
    price: 185,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "cart-02",
    name: "Raw Linen Journal",
    variant: "Bone / 120 Pages",
    price: 42,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  },
] as const;

// TODO: Replace with API call.
export const wishlistItems: WishlistItemData[] = [
  {
    id: "wish-01",
    category: "Living Essentials",
    title: "Tapered Alabaster Vase",
    price: 185,
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "wish-02",
    category: "Archive",
    title: "Grain Leather Journal",
    price: 65,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "wish-03",
    category: "Furniture",
    title: "Nordic Oak Occasional Chair",
    price: 1240,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
] as const;

// TODO: Replace with API call.
export const profilePurchases: ProfilePurchaseData[] = [
  {
    id: "purchase-01",
    title: "Hasegawa Vase, 1974",
    date: "Oct 12",
    value: "$620",
    image:
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "purchase-02",
    title: "Raw Linen Throw",
    date: "Oct 08",
    value: "$140",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "purchase-03",
    title: "Tanner Archive Case",
    date: "Sep 24",
    value: "$88",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80",
  },
] as const;

// TODO: Replace with API call.
export const shippingOptions: ShippingOptionData[] = [
  {
    id: "standard",
    title: "Curated Standard",
    description: "3-5 business days • Carbon-neutral delivery",
    price: "$12.00",
  },
  {
    id: "express",
    title: "Express Archive",
    description: "Next day delivery • Signature required",
    price: "$25.00",
  },
] as const;