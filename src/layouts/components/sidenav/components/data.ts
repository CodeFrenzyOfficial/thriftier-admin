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
    label: "Apps",
    isTitle: true,
  },

  // {
  //   key: "invoice",
  //   label: "Invoice",
  //   icon: "lucide:file-text",
  //   children: [
  //     { key: "overview", label: "Overview", url: "/invoice/overview" },
  //     { key: "list", label: "List Invoice", url: "/invoice/list" },
  //     { key: "add", label: "Add Invoice", url: "/invoice/add" },
  //   ],
  // },
  {
    key: "users",
    label: "Users",
    icon: "lucide:square-user-round",
    url: "/user",
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
    label: "Driver Dashboard",
    isTitle: true,
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "lucide:layout-dashboard",
    url: "/dashboard",
  },
  {
    key: "deliveries",
    label: "Deliveries",
    icon: "lucide:truck",
    children: [
      { key: "pending", label: "Pending Deliveries", url: "/ecommerce/order" },
      { key: "in-progress", label: "In Progress", url: "/ecommerce/order" },
      { key: "completed", label: "Completed", url: "/ecommerce/order" },
    ],
  },
  {
    key: "orders",
    label: "Order Management",
    icon: "lucide:package",
    children: [
      { key: "view-orders", label: "View Orders", url: "/ecommerce/order" },
      {
        key: "order-details",
        label: "Order Details",
        url: "/ecommerce/order-detail",
      },
    ],
  },
  {
    key: "routes",
    label: "Routes & Maps",
    icon: "lucide:map",
    url: "/apps/calendar",
  },
  {
    key: "driver-title2",
    label: "Management",
    isTitle: true,
  },
  {
    key: "earnings",
    label: "Earnings",
    icon: "lucide:wallet",
    url: "/invoice/list",
  },
  {
    key: "schedule",
    label: "My Schedule",
    icon: "lucide:calendar",
    url: "/apps/calendar",
  },
  {
    key: "profile",
    label: "My Profile",
    icon: "lucide:user",
    children: [
      { key: "view-profile", label: "View Profile", url: "/user/grid" },
      { key: "settings", label: "Account Settings", url: "/user/settings" },
    ],
  },
  {
    key: "support",
    label: "Support",
    icon: "lucide:headphones",
    children: [
      { key: "help", label: "Help Center", url: "/faqs" },
      { key: "chat", label: "Chat Support", url: "/apps/chat" },
    ],
  },
];

/**
 * Default export for backward compatibility
 * This is the admin menu by default
 */
export const menuItems = adminMenuItems;
