export interface ProductsData {
  id: string;
  title: string;
  price: string;
  shopeUrl: string;
  description: string;
  thumbnail: string;
  size: string | null;
  category: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  sold: number;
  stock: number;
}

export interface Pagination {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
  totalItems: number;
}

export interface ApiResponse {
  data: ProductsData[];
  pagination: Pagination;
}
