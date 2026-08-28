export type UserRole = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}