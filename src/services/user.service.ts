/**
 * User Service
 * Handles all user management related API calls
 */

import api from "./api";

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  location: string;
  role: string;
  phoneNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  phoneNumber: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
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

class UserService {
  /**
   * Get all users with pagination
   */
  async getUsers(
    params: PaginationParams = {}
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return await api.get<PaginatedResponse<User>>(`/users?${queryParams}`);
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    return await api.get<User>(`/users/${id}`);
  }

  /**
   * Create new user (Admin only)
   */
  async createUser(data: CreateUserData): Promise<User> {
    return await api.post<User>("/users", data);
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<CreateUserData>): Promise<User> {
    return await api.put<User>(`/users/${id}`, data);
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    return await api.delete(`/users/${id}`);
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;
