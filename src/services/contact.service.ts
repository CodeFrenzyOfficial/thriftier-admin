/**
 * Contact Service
 * Handles all contact form related API calls
 */

import { api } from "./api";

export interface Contact {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  message: string;
  createdAt: Date;
}

export interface ContactFilters {
  startDate?: string;
  endDate?: string;
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

class ContactService {
  /**
   * Get all contact form submissions (Admin only)
   */
  async getContacts(
    params: PaginationParams = {},
    filters: ContactFilters = {}
  ): Promise<PaginatedResponse<Contact>> {
    const queryParams: Record<string, string> = {
      page: String(params.page || 1),
      limit: String(params.limit || 10),
    };

    if (filters.startDate) {
      queryParams.startDate = filters.startDate;
    }
    if (filters.endDate) {
      queryParams.endDate = filters.endDate;
    }

    const response = await api.get<any>("/users/admin/contacts", queryParams);

    // The API returns { data: [], meta: {}, success: true }
    // Transform backend response to match our interface
    const responseData = response.data || [];
    const responseMeta = response.meta || response.pagination || {};

    return {
      data: responseData,
      pagination: {
        page: responseMeta.page || 1,
        limit: responseMeta.limit || 10,
        totalPages: responseMeta.totalPages || 1,
        totalItems: responseMeta.total || responseMeta.totalItems || 0,
        hasNext: responseMeta.hasNextPage || responseMeta.hasNext || false,
        hasPrev: responseMeta.hasPrevPage || responseMeta.hasPrev || false,
      },
    };
  }

  /**
   * Delete a contact submission (Admin only)
   */
  async deleteContact(id: string): Promise<void> {
    await api.delete(`/users/admin/contacts/${id}`);
  }
}

export const contactService = new ContactService();
export default contactService;
