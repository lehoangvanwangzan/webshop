export interface ChildCategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: ChildCategory[];
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order?: number;
  is_active?: boolean;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
