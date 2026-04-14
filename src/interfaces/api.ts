// src/interfaces/api.ts
import type { AxiosResponse } from "axios";

export interface ApiResponse<T = unknown> extends AxiosResponse {
  data: {
    success: boolean;
    message: string;
    data?: T;
  };
}

export interface PaginatedResponse<T = unknown> extends AxiosResponse {
  data: {
    success: boolean;
    message: string;
    data?: T[];
    meta: PaginationMeta;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  success: false;
}

export interface TableFilter {
  page: number;
  limit: number;
  search?: string;
}
