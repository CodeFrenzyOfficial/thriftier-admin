import type { MenuItemType } from "@/types/layout";

/**
 * Admin Menu - Full access to all features
 */
export const adminMenuItems: MenuItemType[] = [
  {
    key: "overview-title",
    label: "Overview",
    isTitle: true,
  },
  {
    key: "dashboards",
    label: "Dashboards",
    icon: "lucide:monitor-dot",
    url: "/dashboard",
  },

  {
    key: "apps-title",
    label: "Management",
    isTitle: true,
  },
  {
    key: "orders",
    label: "Orders",
    icon: "lucide:package",
    url: "/orders",
  },
  {
    key: "drivers",
    label: "Drivers",
    icon: "lucide:truck",
    url: "/drivers",
  },
  {
    key: "employees",
    label: "Employees",
    icon: "lucide:users-round",
    url: "/employees",
  },
  {
    key: "analytics-title",
    label: "Analytics",
    isTitle: true,
  },
  {
    key: "analytics",
    label: "Analytics Dashboard",
    icon: "lucide:bar-chart-3",
    url: "/analytics",
  },
  {
    key: "account-title",
    label: "Account",
    isTitle: true,
  },
  {
    key: "settings",
    label: "Account Settings",
    icon: "lucide:settings",
    url: "/user/settings",
  },
];

/**
 * User Menu - Limited access for regular users
 */
export const userMenuItems: MenuItemType[] = [
  {
    key: "user-title",
    label: "User Dashboard",
    isTitle: true,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "lucide:home",
    url: "/dashboard",
  },
  {
    key: "my-orders",
    label: "My Orders",
    icon: "lucide:shopping-bag",
    url: "/ecommerce/order",
  },
  {
    key: "shopping",
    label: "Shopping",
    icon: "lucide:store",
    children: [
      {
        key: "products",
        label: "Browse Products",
        url: "/ecommerce/product-grid",
      },
      { key: "cart", label: "Shopping Cart", url: "/ecommerce/cart" },
      { key: "checkout", label: "Checkout", url: "/ecommerce/checkout" },
    ],
  },
  {
    key: "my-account",
    label: "My Account",
    icon: "lucide:user",
    children: [
      { key: "profile", label: "Profile", url: "/user/grid" },
      { key: "settings", label: "Account Settings", url: "/user/settings" },
      { key: "orders", label: "Order History", url: "/ecommerce/order" },
    ],
  },
  {
    key: "support-title",
    label: "Support",
    isTitle: true,
  },
  {
    key: "help",
    label: "Help & Support",
    icon: "lucide:help-circle",
    children: [
      { key: "faqs", label: "FAQs", url: "/faqs" },
      { key: "chat", label: "Chat Support", url: "/apps/chat" },
    ],
  },
];

/**
 * Driver Menu - Delivery and order management
 */
export const driverMenuItems: MenuItemType[] = [
  {
    key: "driver-title",
    label: "Overview",
    isTitle: true,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    url: "/driver/dashboard",
  },
  {
    key: "driver-title2",
    label: "Orders",
    isTitle: true,
  },
  {
    key: "my-orders",
    label: "My Orders",
    icon: "lucide:package",
    url: "/driver/orders",
  },
  {
    key: "order-history",
    label: "Order History",
    icon: "lucide:archive",
    url: "/driver/history",
  },
  {
    key: "driver-title3",
    label: "Account",
    isTitle: true,
  },
  {
    key: "settings",
    label: "Account Settings",
    icon: "lucide:settings",
    url: "/user/settings",
  },
];

/**
 * Default export for backward compatibility
 * This is the admin menu by default
 */
export const menuItems = adminMenuItems;
