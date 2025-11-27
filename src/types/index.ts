export * from "./product";
export * from "./cart";
export * from "./user";

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface NavLink {
  name: string;
  href: string;
}
