// src/interfaces/auth.ts

export type UserRole = "super_admin" | "school_admin" | "lecturer" | "student";

export interface User {
  id: string;
  tenantId?: string;
  subdomain?: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  matricNumber?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
