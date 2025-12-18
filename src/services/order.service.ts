/**
 * Order Service
 * Handles all order-related API calls
 */

import { api } from "./api";

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  driverId?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  pickupAddress: string;
  deliveryAddress: string;
  packageDescription: string;
  packageWeight?: number;
  packageImages?: string[];
  estimatedPrice: number;
  finalPrice?: number;
  scheduledPickupTime?: Date;
  pickupTime?: Date;
  deliveryTime?: Date;
  notes?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  driver?: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderData {
  userId: string;
  pickupAddress: string;
  deliveryAddress: string;
  packageDescription: string;
  packageWeight?: number;
  estimatedPrice: number;
  scheduledPickupTime?: Date;
  notes?: string;
}

export interface UpdateOrderData {
  driverId?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  pickupAddress?: string;
  deliveryAddress?: string;
  packageDescription?: string;
  packageWeight?: number;
  finalPrice?: number;
  pickupTime?: Date;
  deliveryTime?: Date;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  userId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class OrderService {
  /**
   * Get all orders with pagination and filters
   */
  async getOrders(
    params: PaginationParams = {},
    filters: OrderFilters = {}
  ): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    // Filters
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.userId) queryParams.append("userId", filters.userId);
    if (filters.driverId) queryParams.append("driverId", filters.driverId);
    if (filters.startDate) queryParams.append("startDate", filters.startDate);
    if (filters.endDate) queryParams.append("endDate", filters.endDate);
    if (filters.search) queryParams.append("search", filters.search);

    const endpoint = `/orders${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    return await api.get<PaginatedResponse<Order>>(endpoint);
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    return await api.get<Order>(`/orders/${id}`);
  }

  /**
   * Create new order
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    return await api.post<Order>("/orders", data);
  }

  /**
   * Update order
   */
  async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
    return await api.put<Order>(`/orders/${id}`, data);
  }

  /**
   * Assign driver to order
   */
  async assignDriver(orderId: string, driverId: string): Promise<Order> {
    return await api.put<Order>(`/orders/${orderId}/assign-driver`, {
      driverId,
    });
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  ): Promise<Order> {
    return await api.put<Order>(`/orders/${orderId}/status`, { status });
  }

  /**
   * Delete order
   */
  async deleteOrder(id: string): Promise<void> {
    return await api.delete(`/orders/${id}`);
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStats> {
    return await api.get<OrderStats>("/orders/stats");
  }

  /**
   * Upload package images
   */
  async uploadPackageImages(
    orderId: string,
    images: File[]
  ): Promise<string[]> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", image);
    });

    // Note: Don't set Content-Type header for FormData
    // The browser will automatically set it with the correct boundary
    return await api.post<string[]>(
      `/orders/${orderId}/upload-images`,
      formData
    );
  }
}

export const orderService = new OrderService();

