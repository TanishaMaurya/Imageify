export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: User;
  token: string;
}
