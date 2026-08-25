import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'ADMIN',
  'PROCUREMENT_MANAGER',
  'ANALYST',
  'VIEWER'
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  role: UserRoleSchema.default('VIEWER'),
  organizationId: z.string().uuid('Valid organization ID is required')
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    organizationId: string;
    organizationName: string;
  };
}
