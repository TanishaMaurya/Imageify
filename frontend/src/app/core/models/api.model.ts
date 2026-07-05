export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: { field: string; message: string }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  pagination: Pagination;
}
