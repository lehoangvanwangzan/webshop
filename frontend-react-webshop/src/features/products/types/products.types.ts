export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description?: string;
  description?: string;
  price: number;
  discount_price?: number;
  stock: number;
  is_active: number;
  is_featured: boolean;
  category_id: number;
  brand_id?: number;
  created_at: string;
  updated_at: string;
  category?: { id: number; name: string; slug: string };
  brand?: { id: number; name: string; slug: string };
  images?: ProductImage[];
}

export interface CreateProductPayload {
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock: number;
  category_id: number;
  discount_price?: number;
  brand_id?: number;
  short_description?: string;
  description?: string;
  is_active?: number;
  is_featured?: boolean;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: number;
}
