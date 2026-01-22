/**
 * Escorts API Service
 * 
 * @module services/api/escorts
 * @category API Services
 * 
 * Handles all escort-related API calls:
 * - Fetching escort listings with filters
 * - Getting escort profiles
 * - VIP and featured escorts
 * - Search functionality
 * 
 * @example
 * ```typescript
 * import { escortsService } from './escorts';
 * 
 * const escorts = await escortsService.getAll({ city: 'Istanbul', page: 1 });
 * ```
 */

import { apiClient } from './client';

/**
 * Escort types
 */
export interface Escort {
  id: string;
  name: string;
  age: number;
  city: string;
  district?: string;
  price: number;
  hourlyRate?: number;
  avatar: string;
  photos: string[];
  bio: string;
  services: string[];
  availability: 'available' | 'busy' | 'offline';
  rating: number;
  reviewCount: number;
  verified: boolean;
  vip: boolean;
  featured: boolean;
  height?: number;
  weight?: number;
  bodyType?: string;
  hairColor?: string;
  eyeColor?: string;
  languages: string[];
  ethnicity?: string;
  orientation?: string;
  smoking?: boolean;
  tattoos?: boolean;
  piercings?: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter and pagination types
 */
export interface EscortFilters {
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minAge?: number;
  maxAge?: number;
  services?: string[];
  availability?: 'available' | 'busy' | 'offline';
  vip?: boolean;
  verified?: boolean;
  bodyType?: string;
  hairColor?: string;
  eyeColor?: string;
  sortBy?: 'price' | 'rating' | 'recent' | 'popular';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Escorts Service
 */
export const escortsService = {
  /**
   * Get all escorts with filters and pagination
   * 
   * @param filters - Filter criteria
   * @param pagination - Pagination parameters
   * @returns Paginated escort list
   */
  async getAll(
    filters?: EscortFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Escort>> {
    const params = {
      ...filters,
      ...pagination,
    };

    const response = await apiClient.get<PaginatedResponse<Escort>>('/escorts', {
      params,
    });

    return response.data;
  },

  /**
   * Get escort by ID
   * 
   * @param id - Escort ID
   * @returns Escort details
   */
  async getById(id: string): Promise<Escort> {
    const response = await apiClient.get<Escort>(`/escorts/${id}`);
    return response.data;
  },

  /**
   * Get featured escorts
   * 
   * @param limit - Number of escorts to fetch
   * @returns List of featured escorts
   */
  async getFeatured(limit: number = 10): Promise<Escort[]> {
    const response = await apiClient.get<Escort[]>('/escorts/featured', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get VIP escorts
   * 
   * @param limit - Number of escorts to fetch
   * @returns List of VIP escorts
   */
  async getVip(limit: number = 10): Promise<Escort[]> {
    const response = await apiClient.get<Escort[]>('/escorts/vip', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Search escorts
   * 
   * @param query - Search query
   * @param pagination - Pagination parameters
   * @returns Search results
   */
  async search(
    query: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Escort>> {
    const response = await apiClient.get<PaginatedResponse<Escort>>('/escorts/search', {
      params: {
        q: query,
        ...pagination,
      },
    });
    return response.data;
  },

  /**
   * Get escorts by city
   * 
   * @param city - City name
   * @param pagination - Pagination parameters
   * @returns Escorts in the specified city
   */
  async getByCity(
    city: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Escort>> {
    const response = await apiClient.get<PaginatedResponse<Escort>>(`/escorts/city/${city}`, {
      params: pagination,
    });
    return response.data;
  },

  /**
   * Get similar escorts
   * 
   * @param id - Escort ID
   * @param limit - Number of similar escorts to fetch
   * @returns List of similar escorts
   */
  async getSimilar(id: string, limit: number = 6): Promise<Escort[]> {
    const response = await apiClient.get<Escort[]>(`/escorts/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Add escort to favorites
   * 
   * @param id - Escort ID
   */
  async addToFavorites(id: string): Promise<void> {
    await apiClient.post(`/escorts/${id}/favorite`);
  },

  /**
   * Remove escort from favorites
   * 
   * @param id - Escort ID
   */
  async removeFromFavorites(id: string): Promise<void> {
    await apiClient.delete(`/escorts/${id}/favorite`);
  },

  /**
   * Get user's favorite escorts
   * 
   * @param pagination - Pagination parameters
   * @returns User's favorite escorts
   */
  async getFavorites(pagination?: PaginationParams): Promise<PaginatedResponse<Escort>> {
    const response = await apiClient.get<PaginatedResponse<Escort>>('/escorts/favorites', {
      params: pagination,
    });
    return response.data;
  },

  /**
   * Report escort profile
   * 
   * @param id - Escort ID
   * @param reason - Report reason
   * @param description - Report description
   */
  async report(id: string, reason: string, description: string): Promise<void> {
    await apiClient.post(`/escorts/${id}/report`, {
      reason,
      description,
    });
  },
};

export default escortsService;
