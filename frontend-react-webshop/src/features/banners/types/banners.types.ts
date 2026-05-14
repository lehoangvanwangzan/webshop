export interface Banner {
  id: number;
  title: string;
  image_url: string | null;
  link_url: string | null;
  position: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerPayload {
  title: string;
  link_url?: string;
  position?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateBannerPayload extends Partial<CreateBannerPayload> {}

export interface BannerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: string;
  is_active?: number; // 0 or 1
}
