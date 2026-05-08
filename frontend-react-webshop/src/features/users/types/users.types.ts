export type UserRole = 'admin' | 'staff' | 'customer';

export interface AdminUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;   // /picture/user/xxx.jpg — served as static file
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
  avatar?: File;
}

export interface UpdateUserPayload {
  full_name?: string;
  phone?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  role?: UserRole;
  sort_by?: 'id' | 'full_name' | 'email' | 'role' | 'is_active' | 'created_at';
  sort_order?: 'ASC' | 'DESC';
}
