import { create } from 'zustand';
import { UserRole } from '@freightiq/shared-types';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
}

const DEFAULT_USER: User = {
  id: 'demo-manager-id',
  email: 'manager@freightiq.io',
  fullName: 'Vikram Sharma (Head of Procurement)',
  role: 'PROCUREMENT_MANAGER',
  organizationId: 'sail-org-id',
  organizationName: 'Steel Authority of India Ltd (SAIL)'
};

interface AuthState {
  user: User;
  accessToken: string;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setDemoRole: (role: UserRole, name?: string, email?: string) => void;
  logout: () => void;
  bypassAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: DEFAULT_USER,
  accessToken: 'demo-session-token',
  isAuthenticated: true, // Always true by default so zero login friction!

  setAuth: (user, accessToken) => {
    localStorage.setItem('freightiq_token', accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setDemoRole: (role: UserRole, name = 'Vikram Sharma', email = 'manager@freightiq.io') => {
    set({
      user: {
        id: `demo-${role.toLowerCase()}-id`,
        email,
        fullName: `${name} (${role})`,
        role,
        organizationId: 'sail-org-id',
        organizationName: 'Steel Authority of India Ltd (SAIL)'
      },
      isAuthenticated: true
    });
  },

  bypassAuth: () => {
    set({ user: DEFAULT_USER, isAuthenticated: true });
  },

  logout: () => {
    // Soft logout re-applies default demo user so app never gets stuck on blank screen
    set({ user: DEFAULT_USER, isAuthenticated: true });
  }
}));
