export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBrandPayload {
  name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}

export type UpdateBrandPayload = Partial<CreateBrandPayload>;
