// App Constants
export const APP_NAME = "TryScentic";
export const APP_DESCRIPTION =
  "Tryscentic offers 100% authentic Perfumes samples and full bottle. You can now experience rare fragrance at exceptional prices";

// Storage Keys
export const STORAGE_KEYS = {
  CART: "tryscentic_cart_items",
  USER: "tryscentic_user",
  THEME: "tryscentic_theme",
} as const;

// Pagination
export const PRODUCTS_PER_PAGE = 12;

// Routes
export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  PRODUCT: (id: string) => `/shop/${id}`,
  CHECKOUT: "/checkout",
  USER_DASHBOARD: "/user-dashboard",
  ABOUT: "/about-us",
  CONTACT: "/contact-us",
  GIFT: "/gift",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

// Navigation Links
export const NAV_LINKS = [
  { name: "Home", href: ROUTES.HOME },
  { name: "Shop", href: ROUTES.SHOP },
  { name: "Wallet", href: "#wallet" },
  { name: "About Us", href: ROUTES.ABOUT },
  { name: "Contact Us", href: ROUTES.CONTACT },
] as const;

// Animation Durations
export const ANIMATION = {
  DURATION: 1000,
  OFFSET: 100,
  EASING: "ease-in-out",
} as const;

// Shipping
export const SHIPPING_COST = 5.0;
export const FREE_SHIPPING_THRESHOLD = 100.0;
