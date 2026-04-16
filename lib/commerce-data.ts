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
  { label: "Archive", href: "/products" },
  { label: "Journal", href: "/user-profile" },
] as const;

// TODO: Replace with API call.
export const bottomNavigationItems = [
  { label: "Curated", href: "/" },
  { label: "Archive", href: "/products" },
  { label: "Cart", href: "/shopping-cart" },
  { label: "Profile", href: "/user-profile" },
] as const;

export const storefrontCategories = [
  {
    key: "audio",
    label: "Audio",
    description: "Speakers, headphones, and immersive listening systems.",
    image:
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "computing",
    label: "Computing",
    description: "Performance desktops, ultrabooks, and creator workstations.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "mobile",
    label: "Mobile",
    description: "Phones, tablets, and smart wearables for daily productivity.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
  },
  {
    key: "gaming",
    label: "Gaming",
    description: "Consoles, displays, and precision accessories for play.",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1400&q=80",
  },
] as const;

// TODO: Replace with API call.
export const homepageProducts: Product[] = [
  {
    id: "audio-atlas-one",
    slug: "atlas-wireless-headphones",
    name: "Atlas Wireless Headphones",
    category: "Audio / Noise Cancelling",
    categoryKey: "audio",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    description: "Adaptive ANC, 40-hour battery, and studio-grade detail in a matte alloy shell.",
    badge: "Best Seller",
    rating: 4.8,
    tags: ["wireless", "anc", "bluetooth", "premium"],
  },
  {
    id: "audio-sonicbar-pro",
    slug: "sonicbar-pro-soundbar",
    name: "SonicBar Pro",
    category: "Audio / Home Theater",
    categoryKey: "audio",
    price: 499,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=900&q=80",
    description: "Dolby Atmos-ready soundbar with deep bass channel and room calibration.",
    rating: 4.7,
    tags: ["soundbar", "dolby", "tv", "surround"],
  },
  {
    id: "compute-nova-ultra",
    slug: "nova-ultra-laptop-14",
    name: "Nova Ultra 14",
    category: "Computing / Ultrabook",
    categoryKey: "computing",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
    description: "14-inch OLED workstation with all-day battery and creator-grade performance.",
    badge: "New",
    rating: 4.9,
    tags: ["laptop", "oled", "creator", "workstation"],
  },
  {
    id: "mobile-pulse-x",
    slug: "pulse-x-smartphone",
    name: "Pulse X Smartphone",
    category: "Mobile / Flagship",
    categoryKey: "mobile",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1512499617640-c2f999098c01?auto=format&fit=crop&w=900&q=80",
    description: "Flagship camera array, titanium frame, and intelligent battery optimization.",
    rating: 4.6,
    tags: ["phone", "5g", "camera", "flagship"],
  },
  {
    id: "mobile-orbit-pad",
    slug: "orbit-pad-tablet-12",
    name: "Orbit Pad 12",
    category: "Mobile / Tablet",
    categoryKey: "mobile",
    price: 749,
    image:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=900&q=80",
    description: "12-inch tablet with pen support and desktop-class multitasking.",
    rating: 4.5,
    tags: ["tablet", "pen", "creative", "portable"],
  },
  {
    id: "gaming-arc-console",
    slug: "arc-console-x",
    name: "Arc Console X",
    category: "Gaming / Console",
    categoryKey: "gaming",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1486401899868-0e435ed85128?auto=format&fit=crop&w=900&q=80",
    description: "4K 120fps-ready console with instant-load architecture and cloud sync.",
    badge: "Limited",
    rating: 4.7,
    tags: ["console", "4k", "fps", "cloud"],
  },
  {
    id: "gaming-vector-monitor",
    slug: "vector-32-gaming-monitor",
    name: "Vector 32 Pro Monitor",
    category: "Gaming / Display",
    categoryKey: "gaming",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=900&q=80",
    description: "32-inch QD panel with 240Hz refresh and low-latency HDR processing.",
    rating: 4.8,
    tags: ["monitor", "240hz", "hdr", "esports"],
  },
  {
    id: "compute-apex-dock",
    slug: "apex-thunderbolt-dock",
    name: "Apex Thunderbolt Dock",
    category: "Computing / Accessories",
    categoryKey: "computing",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80",
    description: "Single-cable dock with dual-display output, 2.5GbE, and high-speed IO.",
    rating: 4.4,
    tags: ["dock", "thunderbolt", "usb-c", "desktop"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return homepageProducts.find((product) => product.slug === slug);
}

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

export const heroCampaigns = [
  {
    id: "spring-audio",
    eyebrow: "Seasonal Drop",
    title: "Spring Audio Collection",
    description: "Experience warmer, richer soundscapes with our handpicked premium audio lineup.",
    ctaLabel: "Shop Audio",
    href: "/products?category=audio",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "creator-computing",
    eyebrow: "Creator Week",
    title: "Performance Laptops for Creative Work",
    description: "OLED displays, faster rendering, and all-day battery in one refined setup.",
    ctaLabel: "Explore Computing",
    href: "/products?category=computing",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "mobile-upgrade",
    eyebrow: "Upgrade Event",
    title: "Trade Up to Flagship Mobile",
    description: "Capture better, game smoother, and stay powered longer with next-gen devices.",
    ctaLabel: "Browse Mobile",
    href: "/products?category=mobile",
    image:
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=1600&q=80",
  },
] as const;

export const flashDeals = [
  {
    id: "deal-atlas",
    slug: "atlas-wireless-headphones",
    title: "Atlas Wireless Headphones",
    discountLabel: "18% OFF",
    price: 245,
    originalPrice: 299,
    href: "/products/atlas-wireless-headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "deal-sonicbar",
    slug: "sonicbar-pro-soundbar",
    title: "SonicBar Pro",
    discountLabel: "12% OFF",
    price: 439,
    originalPrice: 499,
    href: "/products/sonicbar-pro-soundbar",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "deal-vector",
    slug: "vector-32-gaming-monitor",
    title: "Vector 32 Pro Monitor",
    discountLabel: "15% OFF",
    price: 679,
    originalPrice: 799,
    href: "/products/vector-32-gaming-monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

export const brandSpotlight = [
  { id: "sony", label: "Sony", href: "/products?q=sony" },
  { id: "bose", label: "Bose", href: "/products?q=bose" },
  { id: "samsung", label: "Samsung", href: "/products?q=samsung" },
  { id: "logitech", label: "Logitech", href: "/products?q=logitech" },
  { id: "apple", label: "Apple", href: "/products?q=apple" },
  { id: "asus", label: "ASUS", href: "/products?q=asus" },
] as const;

export const bundleOffers = [
  {
    id: "bundle-creator",
    title: "Creator Desk Bundle",
    description: "Nova Ultra 14 + Apex Thunderbolt Dock + Orbit Pad 12",
    savingsLabel: "Save $220",
    href: "/products?category=computing",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "bundle-gaming",
    title: "Pro Gaming Bundle",
    description: "Arc Console X + Vector 32 Pro Monitor",
    savingsLabel: "Save $150",
    href: "/products?category=gaming",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

export const trustHighlights = [
  { id: "shipping", title: "Free Shipping", description: "On orders above $499 across India." },
  { id: "returns", title: "10-Day Returns", description: "No-stress exchanges and quick refund processing." },
  { id: "warranty", title: "Official Warranty", description: "Brand-backed warranty on every listed product." },
  { id: "support", title: "Expert Support", description: "Real product specialists available every day." },
] as const;

export const customerTestimonials = [
  {
    id: "review-aisha",
    name: "Aisha R.",
    quote: "Veltron's curation quality is leagues ahead. Every purchase felt premium from unboxing to setup.",
    rating: "5.0",
  },
  {
    id: "review-kabir",
    name: "Kabir M.",
    quote: "The product recommendations were spot on. I upgraded my entire desk setup in one order.",
    rating: "4.9",
  },
  {
    id: "review-janvi",
    name: "Janvi T.",
    quote: "Fast delivery, genuine products, and support that actually understands electronics.",
    rating: "4.8",
  },
] as const;

export const buyingGuides = [
  {
    id: "guide-headphones",
    title: "How to Choose ANC Headphones in 2026",
    excerpt: "Understand codecs, driver sizes, and real-world battery benchmarks before you buy.",
    href: "/products?q=headphones",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "guide-laptop",
    title: "Best Creator Laptops Under $2000",
    excerpt: "Compare display quality, thermal design, and sustained performance for creative workflows.",
    href: "/products?q=laptop",
    image:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "guide-gaming",
    title: "Building a Minimal Gaming Setup",
    excerpt: "Pick the right monitor, console, and accessories without cluttering your space.",
    href: "/products?category=gaming",
    image:
      "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

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