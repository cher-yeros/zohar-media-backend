export interface UserAccount {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url?: string;
  is_active: boolean;
  last_login_at?: Date;
}
