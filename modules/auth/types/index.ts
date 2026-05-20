export interface User {
  id: number;
  name: string;
  full_name: string;
  email: string;
  employee_id: number | null;
  is_linked_to_employee: boolean;
  profileUrl: string | null;
  roles: string[];
  permissions: string[];
  username?: string;
  avatar?: string;
}

export interface AuthToken {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  token: AuthToken;
  user: User;
}
