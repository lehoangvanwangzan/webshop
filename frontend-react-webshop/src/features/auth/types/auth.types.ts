export interface LoginDto {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterDto {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  phone?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'staff' | 'customer';
  avatar_url?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}
