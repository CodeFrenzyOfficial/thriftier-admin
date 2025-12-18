/**
 * Orders Routes
 */

export const ordersRoutes = [
  {
    path: "/orders",
    name: "orders",
    component: () => import("../views/orders/list/index.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/orders/:id",
    name: "order-details",
    component: () => import("../views/orders/details/index.vue"),
    meta: { requiresAuth: true },
  },
];

