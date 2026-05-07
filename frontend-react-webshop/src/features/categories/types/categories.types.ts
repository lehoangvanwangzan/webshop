export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
  parent?: Category;
}
